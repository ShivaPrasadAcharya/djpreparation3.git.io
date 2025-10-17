// appNoteU.js
(function() {
    // --- Define dropdown hierarchy for NoteU sections ---
    const noteUNested = [
        {
            key: 'noteU1', label: 'NoteU1', items: [
                ...['noteU11', 'noteU12', 'noteU13', 'noteU14', 'noteU15'].map(k => ({
                    key: k,
                    label: (window[`${k}Meta`]?.name || k.replace('noteU', 'NoteU')),
                    emoji: window[`${k}Meta`]?.emoji || '',
                    content: window[`${k}Content`]
                }))
            ]
        },
        {
            key: 'noteU2', label: 'NoteU2', items: [
                ...['noteU21', 'noteU22', 'noteU23', 'noteU24', 'noteU25'].map(k => ({
                    key: k,
                    label: (window[`${k}Meta`]?.name || k.replace('noteU', 'NoteU')),
                    emoji: window[`${k}Meta`]?.emoji || '',
                    content: window[`${k}Content`]
                }))
            ]
        },
        {
            key: 'noteU3', label: 'NoteU3', items: [
                ...['noteU31', 'noteU32', 'noteU33', 'noteU34', 'noteU35'].map(k => ({
                    key: k,
                    label: (window[`${k}Meta`]?.name || k.replace('noteU', 'NoteU')),
                    emoji: window[`${k}Meta`]?.emoji || '',
                    content: window[`${k}Content`]
                }))
            ]
        },
        {
            key: 'noteU4', label: 'NoteU4', items: [
                ...['noteU41', 'noteU42', 'noteU43', 'noteU44', 'noteU45'].map(k => ({
                    key: k,
                    label: (window[`${k}Meta`]?.name || k.replace('noteU', 'NoteU')),
                    emoji: window[`${k}Meta`]?.emoji || '',
                    content: window[`${k}Content`]
                }))
            ]
        }
    ];

    // --- Dropdown injection ---
    function injectNoteUDropdown() {
        if (document.querySelector('.noteu-dropdown')) return;
        const filesDropdown = document.querySelector('.files-dropdown');
        if (!filesDropdown) return;

        const noteUParent = document.createElement('div');
        noteUParent.className = 'noteu-dropdown';
        Object.assign(noteUParent.style, {
            display: 'inline-block',
            position: 'relative',
            marginLeft: '8px'
        });
        noteUParent.innerHTML = `
            <button class="noteu-btn"
                style="font-weight:bold;cursor:pointer;padding:10px 20px;
                       border-radius:25px;border:none;background:#e0e7ff;">
                NoteU ▼
            </button>
        `;

        const noteUSubmenu = document.createElement('div');
        Object.assign(noteUSubmenu.style, {
            display: 'none',
            position: 'absolute',
            left: '0',
            top: '110%',
            background: '#fff',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            borderRadius: '12px',
            minWidth: '160px',
            zIndex: '1001',
            padding: '8px 0'
        });

        noteUNested.forEach(nested => {
            const nestedDiv = document.createElement('div');
            nestedDiv.className = `${nested.key}-dropdown`;
            nestedDiv.style.position = 'relative';
            nestedDiv.style.marginBottom = '4px';

            const nestedBtn = document.createElement('button');
            nestedBtn.className = `${nested.key}-btn`;
            nestedBtn.innerHTML = `${nested.label} ▼`;
            Object.assign(nestedBtn.style, {
                fontWeight: 'bold',
                cursor: 'pointer',
                padding: '8px 18px',
                borderRadius: '18px',
                border: 'none',
                background: '#e0e7ff',
                marginBottom: '2px'
            });

            const nestedSubmenu = document.createElement('div');
            Object.assign(nestedSubmenu.style, {
                display: 'none',
                position: 'absolute',
                left: '100%',
                top: '0',
                background: '#fff',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                borderRadius: '12px',
                minWidth: '160px',
                zIndex: '1002',
                padding: '8px 0'
            });

            // Create inner buttons for each note file
            nested.items.forEach(note => {
                if (!note.content) return;
                const btn = document.createElement('button');
                btn.className = 'noteu-dropdown-item';
                btn.innerHTML = `${note.emoji || ''} ${note.label}`;
                btn.type = 'button';
                btn.style.display = 'block';
                btn.style.width = '100%';
                btn.style.textAlign = 'left';
                btn.style.padding = '8px 16px';
                btn.style.border = 'none';
                btn.style.background = 'transparent';
                btn.style.cursor = 'pointer';

                btn.onclick = e => {
                    e.stopPropagation();
                    showNoteUContent(note.key, note.label, note.content);
                    nestedSubmenu.style.display = 'none';
                    noteUSubmenu.style.display = 'none';
                };

                // Hover effect
                btn.addEventListener('mouseenter', () => btn.style.background = '#f3f4f6');
                btn.addEventListener('mouseleave', () => btn.style.background = 'transparent');

                nestedSubmenu.appendChild(btn);
            });

            nestedDiv.appendChild(nestedBtn);
            nestedDiv.appendChild(nestedSubmenu);

            nestedBtn.addEventListener('click', e => {
                e.stopPropagation();
                nestedSubmenu.style.display = (nestedSubmenu.style.display === 'block') ? 'none' : 'block';
            });
            nestedDiv.addEventListener('mouseleave', () => {
                nestedSubmenu.style.display = 'none';
            });

            noteUSubmenu.appendChild(nestedDiv);
        });

        noteUParent.appendChild(noteUSubmenu);
        noteUParent.querySelector('.noteu-btn').addEventListener('click', e => {
            e.stopPropagation();
            noteUSubmenu.style.display = (noteUSubmenu.style.display === 'block') ? 'none' : 'block';
        });
        noteUParent.addEventListener('mouseleave', () => {
            noteUSubmenu.style.display = 'none';
        });

        filesDropdown.parentNode.insertBefore(noteUParent, filesDropdown.nextSibling);
    }

    // --- Markdown Rendering Function ---
    function simpleMarkdownToHtml(md) {
        if (!md) return '';
        const h1s = [];
        const lines = md.split('\n');
        const newLines = [];
        let h1Count = 0, inCodeBlock = false, inTable = false, tableRows = [];

        lines.forEach((line, idx) => {
            const m = line.match(/^# (.*)$/);
            const isTableRow = /^\s*\|(.+\|)+\s*$/.test(line);
            const isTableHeaderSep = /^\s*\|?(\s*:?-+:?\s*\|)+\s*$/.test(line);

            if (line.trim().startsWith('```')) {
                inCodeBlock = !inCodeBlock;
                newLines.push(inCodeBlock ? '<pre><code>' : '</code></pre>');
                return;
            }
            if (inCodeBlock) { newLines.push(line); return; }

            if (isTableRow && !isTableHeaderSep) {
                if (!inTable) { inTable = true; tableRows = []; }
                tableRows.push(line);
                if (idx === lines.length - 1) {
                    newLines.push(renderTable(tableRows));
                    inTable = false; tableRows = [];
                }
                return;
            } else if (isTableHeaderSep && inTable) {
                tableRows.push(line); return;
            } else if (inTable) {
                newLines.push(renderTable(tableRows));
                inTable = false; tableRows = [];
            }

            if (m) {
                h1Count++;
                const id = 'toc-h1-' + h1Count;
                h1s.push({ text: m[1], id });
                newLines.push(`<h1 id="${id}">${m[1]} <a href="#toc-top" class="toc-back-link">Back to TOC</a></h1>`);
            } else {
                newLines.push(line.replace(/<u>(.*?)<\/u>/g, '<span style="text-decoration:underline;">$1</span>'));
            }
        });

        const toc = h1s.length
            ? `<div id="toc-top" class="toc-container"><strong>Table of Contents</strong><ul>${h1s.map(h => `<li><a href="#${h.id}" class="toc-link">${h.text}</a></li>`).join('')}</ul></div>`
            : '';

        return toc + newLines.join('\n')
            .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em>$1</em>')
            .replace(/\n---\n/g, '<hr>')
            .replace(/\n/g, '<br>');

        function renderTable(rows) {
            if (!rows || rows.length < 2) return rows.join('<br>');
            const header = rows[0].trim().replace(/^[|]|[|]$/g, '').split('|').map(s => s.trim());
            const sep = rows[1].trim().replace(/^[|]|[|]$/g, '').split('|');
            const align = sep.map(cell => {
                cell = cell.trim();
                if (/^:-+:$/.test(cell)) return 'center';
                if (/^-+:$/.test(cell)) return 'right';
                if (/^:-+$/.test(cell)) return 'left';
                return '';
            });
            const bodyRows = rows.slice(2).map(row =>
                row.trim().replace(/^[|]|[|]$/g, '').split('|').map(s => s.trim())
            );
            return `
                <table class="md-table">
                    <thead><tr>${header.map((cell, i) => `<th style="text-align:${align[i] || 'left'};">${cell}</th>`).join('')}</tr></thead>
                    <tbody>${bodyRows.map(cols => `<tr>${cols.map((cell, i) => `<td style="text-align:${align[i] || 'left'};">${cell}</td>`).join('')}</tr>`).join('')}</tbody>
                </table>
            `;
        }
    }

    // --- Display selected NoteU content ---
    function showNoteUContent(noteKey, label, content) {
        const root = document.getElementById('root');
        if (!root) return;
        root.innerHTML = `
            <div class="data-section">
                <div class="data-section-header">
                    <span class="data-section-title">NoteU: ${label}</span>
                </div>
                <div class="markdown-content"></div>
            </div>
        `;
        const mdContent = root.querySelector('.markdown-content');
        mdContent.innerHTML = simpleMarkdownToHtml(content);

        if (window.noteUSearchBar) {
            window.noteUSearchBar(root.querySelector('.data-section'), noteKey, () => simpleMarkdownToHtml(content));
        }
    }

    // --- Auto-inject dropdown when DOM ready ---
    function tryInjectNoteU() { injectNoteUDropdown(); }
    if (document.readyState !== 'loading') tryInjectNoteU();
    else document.addEventListener('DOMContentLoaded', tryInjectNoteU);
    const observer = new MutationObserver(() => tryInjectNoteU());
    observer.observe(document.body, { childList: true, subtree: true });
})();
