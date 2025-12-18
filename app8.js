// app8.js
// HTML search bar (for HTML, searches all HTML and markdown files)
(function() {
    function highlightMatches(html, query) {
        if (!query) return {html, count: 0};
        var safe = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var re = new RegExp(safe, 'gi');
        var idx = 0;
        var count = 0;
        var newHtml = html.replace(re, function(match) {
            count++;
            return '<span class="md-search-highlight" data-md-idx="' + (idx++) + '">' + match + '</span>';
        });
        return {html: newHtml, count};
    }

    function simpleMarkdownToHtml(md) {
        if (!md) return '';
        // Extract h1s for TOC
        var h1s = [];
        var lines = md.split('\n');
        var newLines = [];
        var h1Count = 0;
        lines.forEach(function(line) {
            var m = line.match(/^# (.*)$/);
            if (m) {
                h1Count++;
                var id = 'toc-h1-' + h1Count;
                h1s.push({text: m[1], id: id});
                newLines.push('<h1 id="' + id + '">' + m[1] + ' <a href="#toc-top" class="toc-back-link">Back to TOC</a></h1>');
            } else {
                newLines.push(line);
            }
        });
        var toc = '';
        if (h1s.length > 0) {
            toc = '<div id="toc-top" class="toc-container"><strong>Table of Contents</strong><ul>' +
                h1s.map(function(h) { return '<li><a href="#' + h.id + '" class="toc-link">' + h.text + '</a></li>'; }).join('') +
                '</ul></div>';
        }
        var html = newLines.join('\n')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            // h1 already handled
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            .replace(/\n---\n/g, '<hr>')
            .replace(/\n/g, '<br>');
        return toc + html;
    }

    // Parse a full HTML document string and extract head styles/links/scripts and body HTML
    function parseHtmlDocument(raw) {
        try {
            var parser = new DOMParser();
            var doc = parser.parseFromString(raw, 'text/html');
            var bodyHtml = doc.body ? doc.body.innerHTML : raw;
            var title = (doc.querySelector('title') || {}).textContent || '';
            var styles = [];
            // inline <style>
            Array.from(doc.querySelectorAll('style')).forEach(function(s) {
                styles.push({type: 'style', content: s.textContent});
            });
            // <link rel="stylesheet">
            Array.from(doc.querySelectorAll('link[rel="stylesheet"]')).forEach(function(l) {
                if (l.href) styles.push({type: 'link', href: l.href});
            });
            var scripts = [];
            Array.from(doc.querySelectorAll('script')).forEach(function(s) {
                if (s.src) scripts.push({src: s.src});
                else if (s.textContent && s.textContent.trim()) scripts.push({code: s.textContent});
            });
            return {bodyHtml: bodyHtml, title: title, styles: styles, scripts: scripts};
        } catch (e) {
            return {bodyHtml: raw, title: '', styles: [], scripts: []};
        }
    }

    function getAllHtmlFiles() {
        var files = [];
        for (var key in window) {
            var match = key.match(/^html(\d+)Content$/);
            if (match && window[key]) {
                var idx = match[1];
                var meta = window['html' + idx + 'Meta'] || {};
                var label = (meta.name && meta.name.trim()) ? meta.name : ('html' + idx);
                var emoji = (meta.emoji && meta.emoji.trim()) ? meta.emoji + ' ' : '';
                // allow the html content to be either a fragment or a whole document
                var raw = window[key];
                var parsed = {bodyHtml: raw, title: '', styles: [], scripts: []};
                if (/<!doctype|<html\b/i.test(raw)) {
                    parsed = parseHtmlDocument(raw);
                }
                files.push({
                    key: 'html' + idx,
                    label: label,
                    emoji: emoji,
                    type: 'html',
                    content: parsed.bodyHtml,
                    _htmlTitle: parsed.title,
                    _htmlStyles: parsed.styles,
                    _htmlScripts: parsed.scripts,
                    _raw: raw
                });
            }
        }
        for (var key in window) {
            var match = key.match(/^markdown(\d+)Content$/);
            if (match && window[key]) {
                var idx = match[1];
                var meta = window['markdown' + idx + 'Meta'] || {};
                var label = (meta.name && meta.name.trim()) ? meta.name : ('md' + idx);
                var emoji = (meta.emoji && meta.emoji.trim()) ? meta.emoji + ' ' : '';
                files.push({
                    key: 'md' + idx,
                    label: label,
                    emoji: emoji,
                    type: 'markdown',
                    content: window[key]
                });
            }
        }
        files.sort(function(a, b) {
            var na = parseInt(a.key.replace(/^(md|html)/,''), 10);
            var nb = parseInt(b.key.replace(/^(md|html)/,''), 10);
            if (a.key.startsWith('html') && b.key.startsWith('md')) return -1;
            if (a.key.startsWith('md') && b.key.startsWith('html')) return 1;
            return na-nb;
        });
        return files;
    }

    // Search bar for HTML, searches all HTML and markdown files
    function addHtmlSearch(container, currentHtmlKey) {
        var searchBox = document.createElement('div');
        searchBox.className = 'md-html-search-bar sticky-md-html-search-bar';
        searchBox.style.display = 'flex';
        searchBox.style.alignItems = 'center';
        searchBox.style.gap = '8px';
        searchBox.style.marginBottom = '12px';
        searchBox.innerHTML = '<input type="text" placeholder="Search within this page..." class="md-search-input" style="width:40%;min-width:120px;max-width:100%;padding:8px 12px;border-radius:6px;border:1px solid #ccc;font-size:15px;">' +
            '<button class="md-search-prev" style="padding:6px 10px;">&#8593;</button>' +
            '<button class="md-search-next" style="padding:6px 10px;">&#8595;</button>' +
            '<span class="md-search-count" style="min-width:120px;text-align:center;font-size:14px;color:#555;"></span>';
        container.prepend(searchBox);
        var input = searchBox.querySelector('.md-search-input');
        var prevBtn = searchBox.querySelector('.md-search-prev');
        var nextBtn = searchBox.querySelector('.md-search-next');
        var countSpan = searchBox.querySelector('.md-search-count');
        var htmlContent = container.querySelector('.html-content') || container.querySelector('.markdown-content');
        var files = getAllHtmlFiles();
        var currentFileIdx = files.findIndex(f => f.key === currentHtmlKey);
        var allMatches = [];
        var currentGlobalIdx = 0;

        function updateHighlights(jumpToIdx) {
            var q = input.value.trim();
            allMatches = [];
            var counts = [];
            // Only search in the current file
            var file = files[currentFileIdx];
            var html = file.type === 'markdown' ? simpleMarkdownToHtml(file.content) : file.content;
            var {html: highlighted, count} = highlightMatches(html, q);
            counts.push(count);
            file.html = highlighted;
            for (var j = 0; j < count; ++j) {
                allMatches.push({fileIdx: currentFileIdx, matchIdx: j});
            }
            if (allMatches.length > 0) {
                if (jumpToIdx !== undefined) {
                    currentGlobalIdx = jumpToIdx;
                } else if (currentGlobalIdx >= allMatches.length) {
                    currentGlobalIdx = 0;
                } else if (currentGlobalIdx < 0) {
                    currentGlobalIdx = allMatches.length - 1;
                }
            } else {
                currentGlobalIdx = 0;
            }
            if (file.type === 'markdown') {
                htmlContent.className = 'markdown-content';
                htmlContent.innerHTML = file.html;
            } else {
                htmlContent.className = 'html-content';
                htmlContent.innerHTML = file.html;
            }
            var highlights = htmlContent.querySelectorAll('.md-search-highlight');
            var localIdx = 0;
            if (allMatches.length > 0) {
                localIdx = allMatches[currentGlobalIdx].matchIdx;
                if (highlights[localIdx]) {
                    highlights[localIdx].classList.add('md-search-current');
                    highlights[localIdx].scrollIntoView({block:'center',behavior:'smooth'});
                }
            }
            var countText = count > 0 ? count + ' in ' + file.label : '';
            if (allMatches.length > 0) {
                countSpan.textContent = (currentGlobalIdx+1) + ' / ' + allMatches.length + (countText ? ' ('+countText+')' : '');
            } else {
                countSpan.textContent = '0 / 0';
            }
            var title = container.querySelector('.data-section-title');
            if (title) title.textContent = (file ? (file.type === 'markdown' ? 'Markdown: ' : 'HTML: ') + file.label : '');
        }
        input.addEventListener('input', function() {
            currentGlobalIdx = 0;
            updateHighlights();
        });
        prevBtn.addEventListener('click', function() {
            if (allMatches.length > 0) { currentGlobalIdx = (currentGlobalIdx - 1 + allMatches.length) % allMatches.length; updateHighlights(); }
        });
        nextBtn.addEventListener('click', function() {
            if (allMatches.length > 0) { currentGlobalIdx = (currentGlobalIdx + 1) % allMatches.length; updateHighlights(); }
        });
        updateHighlights();
    }

    function injectHtmlMenuRibbon() {
        if (document.querySelector('.html-ribbon-dropdown')) return;
        var filesDropdown = document.querySelector('.files-dropdown');
        if (!filesDropdown) return;
        var htmlFiles = getAllHtmlFiles().filter(f => f.type === 'html');
        if (htmlFiles.length === 0) return;
        var htmlRibbon = document.createElement('div');
        htmlRibbon.className = 'html-ribbon-dropdown';
        htmlRibbon.style.display = 'inline-block';
        htmlRibbon.style.position = 'relative';
        htmlRibbon.style.marginLeft = '8px';
        htmlRibbon.innerHTML = '<button class="html-ribbon-btn">NoteX ▼</button>';
        var htmlSubmenu = document.createElement('div');
        htmlSubmenu.style.display = 'none';
        htmlSubmenu.style.position = '';
        htmlSubmenu.style.left = '';
        htmlSubmenu.style.top = '';
        htmlSubmenu.style.background = '';
        htmlSubmenu.style.boxShadow = '';
        htmlSubmenu.style.borderRadius = '';
        htmlSubmenu.style.minWidth = '';
        htmlSubmenu.style.zIndex = '';
        htmlSubmenu.style.padding = '';
        htmlSubmenu.style.border = '';
        htmlFiles.forEach(function(html) {
            var btn = document.createElement('button');
            btn.className = 'files-dropdown-item';
            btn.innerHTML = (html.emoji || '') + html.label;
            btn.type = 'button';
            btn.onclick = function(e) {
                e.stopPropagation();
                showHtml(html.key);
                htmlSubmenu.style.display = 'none';
            };
            htmlSubmenu.appendChild(btn);
        });
        htmlRibbon.appendChild(htmlSubmenu);
        htmlRibbon.querySelector('.html-ribbon-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            htmlSubmenu.style.display = (htmlSubmenu.style.display === 'block') ? 'none' : 'block';
        });
        htmlRibbon.addEventListener('mouseleave', function() {
            htmlSubmenu.style.display = 'none';
        });
        filesDropdown.parentNode.insertBefore(htmlRibbon, filesDropdown.nextSibling);
    }

    function showHtml(htmlKey) {
        var root = document.getElementById('root');
        if (!root) return;
        var files = getAllHtmlFiles();
        var file = files.find(f => f.key === htmlKey);
        var label = file ? file.label : htmlKey;
        var content = file ? file.content : '';
        var type = file ? file.type : 'html';
        root.innerHTML = '<div class="data-section"><div class="data-section-header"><span class="data-section-title">' + (type === 'markdown' ? 'Markdown: ' : 'HTML: ') + label + '</span></div>' +
            '<div class="' + (type === 'markdown' ? 'markdown-content' : 'html-content') + '"></div></div>';
        var container = root.querySelector('.data-section');
        var htmlContent = container.querySelector(type === 'markdown' ? '.markdown-content' : '.html-content');
        if (type === 'markdown') {
            htmlContent.innerHTML = simpleMarkdownToHtml(content);
        } else {
            // For HTML, add TOC for h1s
            var div = document.createElement('div');
            div.innerHTML = content;
            var h1s = div.querySelectorAll('h1');
            var toc = '';
            if (h1s.length > 0) {
                toc = '<div id="toc-top" class="toc-container"><strong>Table of Contents</strong><ul>' +
                    Array.from(h1s).map(function(h, i) {
                        var id = 'toc-h1-' + (i+1);
                        h.setAttribute('id', id);
                        h.innerHTML += ' <a href="#toc-top" class="toc-back-link">Back to TOC</a>';
                        return '<li><a href="#' + id + '" class="toc-link">' + h.textContent.replace(' Back to TOC','') + '</a></li>';
                    }).join('') +
                    '</ul></div>';
            }
            htmlContent.innerHTML = toc + div.innerHTML;

            // Add floating TOC arrow button if TOC exists
            if (toc) {
                var tocBtn = document.createElement('button');
                tocBtn.id = 'floating-toc-btn';
                tocBtn.innerHTML = '&#8593;';
                tocBtn.title = 'Go to Table of Contents';
                tocBtn.className = 'floating-toc-btn';
                tocBtn.onclick = function() {
                    var tocTop = htmlContent.querySelector('#toc-top');
                    if (tocTop) tocTop.scrollIntoView({behavior: 'smooth'});
                };
                htmlContent.appendChild(tocBtn);
            }

            // Remove previously injected html assets
            Array.from(document.querySelectorAll('[data-html-owner]')).forEach(function(n) { n.remove(); });

            // Inject styles from the parsed HTML (avoid duplicates)
            try {
                if (file && file._htmlStyles && file._htmlStyles.length > 0) {
                    file._htmlStyles.forEach(function(s, i) {
                        if (s.type === 'style') {
                            var st = document.createElement('style');
                            st.setAttribute('data-html-owner', file.key);
                            st.textContent = s.content;
                            document.head.appendChild(st);
                        } else if (s.type === 'link' && s.href) {
                            var l = document.createElement('link');
                            l.rel = 'stylesheet';
                            l.href = s.href;
                            l.setAttribute('data-html-owner', file.key);
                            document.head.appendChild(l);
                        }
                    });
                }
            } catch (e) {}

            // Inject scripts (external and inline) into the content area so they execute
            try {
                if (file && file._htmlScripts && file._htmlScripts.length > 0) {
                    file._htmlScripts.forEach(function(s, i) {
                        var sc = document.createElement('script');
                        sc.setAttribute('data-html-owner', file.key);
                        if (s.src) {
                            sc.src = s.src;
                            sc.async = false;
                        } else if (s.code) {
                            sc.textContent = s.code;
                        }
                        htmlContent.appendChild(sc);
                    });
                }
            } catch (e) {}

            // Set document title if the HTML provided one
            try { if (file && file._htmlTitle) document.title = file._htmlTitle; } catch (e) {}

            // Auto-render Mermaid flowcharts if present
            var mermaidDivs = htmlContent.querySelectorAll('.mermaid');
            if (mermaidDivs.length > 0) {
                mermaidDivs.forEach(function(div) {
                    renderFlowchart(div.parentNode, div.textContent);
                });
            }
        }
        addHtmlSearch(container, htmlKey);
    }

    function tryInjectHtmlMenu() {
        // Remove HTML from files dropdown if present
        var filesDropdown = document.querySelector('.files-dropdown-content');
        if (filesDropdown) {
            var htmlMain = filesDropdown.querySelector('.files-html-main');
            if (htmlMain) htmlMain.remove();
        }
        injectHtmlMenuRibbon();
    }

    if (document.readyState !== 'loading') tryInjectHtmlMenu();
    else document.addEventListener('DOMContentLoaded', tryInjectHtmlMenu);

    var observer = new MutationObserver(function() {
        tryInjectHtmlMenu();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Add styles for highlight, responsive search bar, and floating TOC button
    var style = document.createElement('style');
    style.textContent = '.md-search-highlight { background: #fff3cd; color: #d35400; border-radius: 3px; padding: 1px 2px; } .md-search-current { background: #ff6b6b !important; color: #fff !important; } .md-html-search-bar .md-search-input { width: 40%; min-width: 120px; max-width: 100%; } .floating-toc-btn { position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; border-radius: 50%; background: #ff6b6b; color: #fff; border: none; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 999; transition: background 0.3s, transform 0.2s; } .floating-toc-btn:hover { background: #ff5252; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.2); } .floating-toc-btn:active { transform: translateY(0); } @media print { .floating-toc-btn { display: none !important; } } @media (max-width: 600px) { .md-html-search-bar .md-search-input { width: 90%; min-width: 60px; } .floating-toc-btn { bottom: 20px; right: 20px; width: 45px; height: 45px; font-size: 20px; } }';
    document.head.appendChild(style);

    // Flowchart rendering using mermaid.js
    function renderFlowchart(container, chartCode) {
        if (!window.mermaid) {
            var script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js';
            script.onload = function() {
                window.mermaid.initialize({ startOnLoad: false });
                renderMermaidChart(container, chartCode);
            };
            document.head.appendChild(script);
        } else {
            renderMermaidChart(container, chartCode);
        }
    }
    function renderMermaidChart(container, chartCode) {
        container.innerHTML = '<div class="mermaid">' + chartCode + '</div>';
        window.mermaid.init(undefined, container.querySelectorAll('.mermaid'));
    }
    // Usage: renderFlowchart(someElement, `graph TD; A-->B; B-->C; C-->A;`);
})();
