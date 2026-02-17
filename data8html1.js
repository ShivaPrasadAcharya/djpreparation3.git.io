// data8html1.js
window.html1Content = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Plea of Alibi — Tree Notes</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@400;500&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0d1117;
    --bg2: #161b22;
    --border: #30363d;
    --gold: #e6b44a;
    --gold-dim: #8a6c2a;
    --teal: #4ecdc4;
    --coral: #e07b6e;
    --lavender: #9b8ecf;
    --green: #5dae8b;
    --text: #e6e1d3;
    --muted: #7c8a9a;
    --line: #2a3340;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Lora', serif;
    min-height: 100vh;
    padding: 2rem 1.5rem 4rem;
    overflow-x: hidden;
  }

  /* Grain texture overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1000;
    opacity: 0.5;
  }

  /* Header */
  .header {
    text-align: center;
    margin-bottom: 3.5rem;
    animation: fadeDown 0.7s ease both;
  }

  .badge {
    display: inline-block;
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    color: var(--gold);
    border: 1px solid var(--gold-dim);
    padding: 0.3rem 1rem;
    border-radius: 2px;
    margin-bottom: 1rem;
    text-transform: uppercase;
  }

  h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 5vw, 3.4rem);
    font-weight: 900;
    color: #fff;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  h1 span {
    color: var(--gold);
    font-style: italic;
  }

  .subtitle {
    font-size: 0.85rem;
    color: var(--muted);
    margin-top: 0.6rem;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.05em;
  }

  .divider {
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    margin: 1.2rem auto 0;
  }

  /* Controls */
  .controls {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 2.5rem;
    flex-wrap: wrap;
    animation: fadeUp 0.7s 0.2s ease both;
  }

  .ctrl-btn {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    color: var(--muted);
    background: var(--bg2);
    border: 1px solid var(--border);
    padding: 0.4rem 0.9rem;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.2s;
    text-transform: uppercase;
  }

  .ctrl-btn:hover {
    color: var(--gold);
    border-color: var(--gold-dim);
  }

  /* Tree Container */
  .tree-root {
    max-width: 960px;
    margin: 0 auto;
  }

  /* Node styles */
  .node {
    position: relative;
    animation: fadeIn 0.4s ease both;
  }

  .node-inner {
    display: flex;
    align-items: flex-start;
    gap: 0;
    position: relative;
  }

  /* Connector lines */
  .connector {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
  }

  .connector-v {
    width: 1px;
    background: var(--line);
    flex: 1;
    min-height: 100%;
  }

  .connector-h {
    width: 28px;
    height: 1px;
    background: var(--line);
    flex-shrink: 0;
    margin-top: 22px;
  }

  /* Cards */
  .card {
    flex: 1;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: var(--bg2);
    padding: 0.65rem 1rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
  }

  .card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    border-radius: 3px 0 0 3px;
    background: var(--accent, var(--gold));
    transition: width 0.25s ease;
  }

  .card:hover::before { width: 5px; }
  .card:hover {
    border-color: var(--accent, var(--gold));
    transform: translateX(2px);
    box-shadow: 0 4px 24px rgba(0,0,0,0.4);
  }

  .card.open {
    border-color: var(--accent, var(--gold));
    background: #1a2030;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .icon {
    font-size: 0.9rem;
    flex-shrink: 0;
  }

  .card-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    color: var(--muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    display: block;
    line-height: 1;
    margin-bottom: 0.2rem;
  }

  .card-title {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: 0.95rem;
    color: #fff;
    line-height: 1.3;
  }

  .toggle-icon {
    margin-left: auto;
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    color: var(--muted);
    transition: transform 0.3s ease;
    flex-shrink: 0;
  }

  .card.open .toggle-icon { transform: rotate(90deg); }

  /* Content area */
  .card-content {
    display: none;
    padding-top: 0.65rem;
    margin-top: 0.55rem;
    border-top: 1px solid var(--border);
  }

  .card.open .card-content { display: block; }

  .card-content ul {
    list-style: none;
    padding: 0;
  }

  .card-content ul li {
    font-size: 0.82rem;
    color: #b0bac6;
    padding: 0.2rem 0;
    padding-left: 1.1rem;
    position: relative;
    line-height: 1.5;
    font-family: 'Lora', serif;
  }

  .card-content ul li::before {
    content: '›';
    position: absolute;
    left: 0;
    color: var(--accent, var(--gold));
    font-weight: bold;
  }

  .card-content .highlight {
    display: inline-block;
    background: rgba(230,180,74,0.1);
    border: 1px solid rgba(230,180,74,0.25);
    border-radius: 3px;
    padding: 0.1rem 0.4rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    color: var(--gold);
    margin: 0.1rem 0.1rem 0.1rem 0;
  }

  .card-content .case-ref {
    display: block;
    font-size: 0.78rem;
    font-style: italic;
    color: var(--lavender);
    padding: 0.2rem 0 0.2rem 1.1rem;
    position: relative;
  }

  .card-content .case-ref::before {
    content: '⚖';
    position: absolute;
    left: 0;
    font-style: normal;
  }

  /* Children wrapper */
  .children {
    padding-left: 2.5rem;
    position: relative;
  }

  /* Vertical left line for children */
  .children::before {
    content: '';
    position: absolute;
    left: 13px;
    top: 0;
    bottom: 24px;
    width: 1px;
    background: var(--line);
  }

  /* Horizontal connector from left line */
  .child-node .card-wrap::before {
    content: '';
    position: absolute;
    left: -27px;
    top: 22px;
    width: 27px;
    height: 1px;
    background: var(--line);
  }

  .child-node {
    position: relative;
  }

  .child-node .card-wrap {
    position: relative;
  }

  /* Root card special */
  .root-card {
    background: linear-gradient(135deg, #1a2035, #0f1620);
    border-color: var(--gold);
    padding: 1rem 1.2rem;
    cursor: default;
  }

  .root-card:hover { transform: none; }
  .root-card::before { width: 4px; }
  .root-card .card-title {
    font-size: 1.2rem;
    color: var(--gold);
  }

  /* Accent color classes */
  .accent-gold { --accent: #e6b44a; }
  .accent-teal { --accent: #4ecdc4; }
  .accent-coral { --accent: #e07b6e; }
  .accent-lavender { --accent: #9b8ecf; }
  .accent-green { --accent: #5dae8b; }

  /* Level badges */
  .level-tag {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    padding: 0.15rem 0.45rem;
    border-radius: 2px;
    text-transform: uppercase;
    flex-shrink: 0;
  }

  .tag-gold { background: rgba(230,180,74,0.15); color: var(--gold); border: 1px solid var(--gold-dim); }
  .tag-teal { background: rgba(78,205,196,0.12); color: var(--teal); border: 1px solid rgba(78,205,196,0.3); }
  .tag-coral { background: rgba(224,123,110,0.12); color: var(--coral); border: 1px solid rgba(224,123,110,0.3); }
  .tag-lavender { background: rgba(155,142,207,0.12); color: var(--lavender); border: 1px solid rgba(155,142,207,0.3); }
  .tag-green { background: rgba(93,174,139,0.12); color: var(--green); border: 1px solid rgba(93,174,139,0.3); }

  /* Table mini */
  .mini-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.75rem;
    margin-top: 0.5rem;
    font-family: 'DM Mono', monospace;
  }
  .mini-table th {
    color: var(--muted);
    text-align: left;
    padding: 0.2rem 0.5rem;
    border-bottom: 1px solid var(--border);
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    font-size: 0.65rem;
  }
  .mini-table td {
    padding: 0.25rem 0.5rem;
    border-bottom: 1px solid rgba(48,54,61,0.5);
    color: #b0bac6;
    vertical-align: top;
    font-size: 0.72rem;
  }
  .mini-table tr:last-child td { border-bottom: none; }

  /* Legend */
  .legend {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 2rem;
    animation: fadeUp 0.7s 0.3s ease both;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    color: var(--muted);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .legend-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* Animations */
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* Responsive */
  @media (max-width: 600px) {
    .children { padding-left: 1.5rem; }
    .card-title { font-size: 0.88rem; }
  }
</style>
</head>
<body>

<div class="header">
  <div class="badge">LLM Criminal Law &amp; Evidence · India / Nepal</div>
  <h1>Plea of <span>Alibi</span></h1>
  <p class="subtitle">Interactive Tree Notes · Click any node to expand</p>
  <div class="divider"></div>
</div>

<div class="controls">
  <button class="ctrl-btn" onclick="expandAll()">▸ Expand All</button>
  <button class="ctrl-btn" onclick="collapseAll()">▾ Collapse All</button>
</div>

<div class="legend">
  <div class="legend-item"><div class="legend-dot" style="background:#e6b44a"></div>Foundation</div>
  <div class="legend-item"><div class="legend-dot" style="background:#4ecdc4"></div>Burden &amp; Proof</div>
  <div class="legend-item"><div class="legend-dot" style="background:#e07b6e"></div>Case Law</div>
  <div class="legend-item"><div class="legend-dot" style="background:#9b8ecf"></div>Procedure</div>
  <div class="legend-item"><div class="legend-dot" style="background:#5dae8b"></div>Nepal / Comparative</div>
</div>

<div class="tree-root" id="tree">

  <!-- ROOT -->
  <div class="node">
    <div class="card root-card accent-gold">
      <div class="card-header">
        <span class="icon">⚖️</span>
        <div>
          <span class="card-label">Doctrine</span>
          <div class="card-title">PLEA OF ALIBI</div>
        </div>
        <span class="level-tag tag-gold" style="margin-left:auto">Root</span>
      </div>
    </div>

    <div class="children">

      <!-- BRANCH 1: CONCEPTUAL FOUNDATION -->
      <div class="child-node">
        <div class="card-wrap">
          <div class="card accent-gold" onclick="toggle(this)">
            <div class="card-header">
              <span class="icon">📖</span>
              <div style="flex:1">
                <span class="card-label">Branch 1</span>
                <div class="card-title">Conceptual Foundation</div>
              </div>
              <span class="level-tag tag-gold">Core</span>
              <span class="toggle-icon">›</span>
            </div>
            <div class="card-content">
              <ul>
                <li><strong>Alibi</strong> (Latin) = <em>"Elsewhere"</em></li>
                <li>Not a substantive defence — a <strong>rule of evidence</strong></li>
                <li>Accused denies <em>presence</em> at the scene, not the act itself</li>
                <li>Creates <em>inconsistency</em> with prosecution's narrative</li>
                <li>One of the strongest defences when adequately proved</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="children">

          <!-- Sub: Statutory Framework -->
          <div class="child-node">
            <div class="card-wrap">
              <div class="card accent-gold" onclick="toggle(this)">
                <div class="card-header">
                  <span class="icon">📜</span>
                  <div style="flex:1">
                    <span class="card-label">1.1</span>
                    <div class="card-title">Statutory Framework</div>
                  </div>
                  <span class="toggle-icon">›</span>
                </div>
                <div class="card-content">
                  <table class="mini-table">
                    <tr><th>Provision</th><th>Law</th><th>Rule</th></tr>
                    <tr><td>S.11 IEA 1872 / S.11 BSA 2023</td><td>India</td><td>Facts inconsistent with fact in issue are relevant</td></tr>
                    <tr><td>S.103 IEA / S.107 BSA</td><td>India</td><td>Burden to prove special exceptions</td></tr>
                    <tr><td>S.330 BNSS 2023</td><td>India</td><td>Advance notice of alibi (new requirement)</td></tr>
                    <tr><td>Evidence Act 2031 BS</td><td>Nepal</td><td>Relevancy of alibi facts</td></tr>
                    <tr><td>Muluki Criminal Code 2074 BS</td><td>Nepal</td><td>Defence provisions</td></tr>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Sub: Legal Character -->
          <div class="child-node">
            <div class="card-wrap">
              <div class="card accent-gold" onclick="toggle(this)">
                <div class="card-header">
                  <span class="icon">🔍</span>
                  <div style="flex:1">
                    <span class="card-label">1.2</span>
                    <div class="card-title">Legal Character</div>
                  </div>
                  <span class="toggle-icon">›</span>
                </div>
                <div class="card-content">
                  <ul>
                    <li>Rule of <strong>relevancy</strong> under S.11 IEA — not a statutory defence</li>
                    <li>Creates inconsistency with prosecution's case of presence</li>
                    <li>Must be distinguished from mere denial</li>
                    <li><span class="highlight">Key</span> Alibi ≠ Admission of act + Excuse</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- BRANCH 2: BURDEN & PROOF -->
      <div class="child-node">
        <div class="card-wrap">
          <div class="card accent-teal" onclick="toggle(this)">
            <div class="card-header">
              <span class="icon">⚖️</span>
              <div style="flex:1">
                <span class="card-label">Branch 2</span>
                <div class="card-title">Burden &amp; Standard of Proof</div>
              </div>
              <span class="level-tag tag-teal">Evidence</span>
              <span class="toggle-icon">›</span>
            </div>
            <div class="card-content">
              <ul>
                <li>Legal burden always on <strong>prosecution</strong> — prove guilt beyond reasonable doubt</li>
                <li>Alibi shifts only the <em>evidential burden</em> to the accused</li>
                <li>Accused's standard: <strong>Preponderance of probabilities</strong></li>
                <li>Successful alibi raises <em>reasonable doubt</em> — does not require absolute proof</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="children">
          <div class="child-node">
            <div class="card-wrap">
              <div class="card accent-teal" onclick="toggle(this)">
                <div class="card-header">
                  <span class="icon">📊</span>
                  <div style="flex:1">
                    <span class="card-label">2.1</span>
                    <div class="card-title">Two-Burden Framework</div>
                  </div>
                  <span class="toggle-icon">›</span>
                </div>
                <div class="card-content">
                  <ul>
                    <li><span class="highlight">Legal Burden</span> Prosecution → Beyond Reasonable Doubt</li>
                    <li><span class="highlight">Evidential Burden</span> Accused → Balance of Probabilities</li>
                    <li>If prosecution fails to prove presence → alibi need not even be examined</li>
                    <li>Court considers alibi cumulatively with all evidence</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="child-node">
            <div class="card-wrap">
              <div class="card accent-teal" onclick="toggle(this)">
                <div class="card-header">
                  <span class="icon">⚠️</span>
                  <div style="flex:1">
                    <span class="card-label">2.2</span>
                    <div class="card-title">Critical Distinctions</div>
                  </div>
                  <span class="toggle-icon">›</span>
                </div>
                <div class="card-content">
                  <ul>
                    <li>Mere denial ≠ Alibi (must be substantiated)</li>
                    <li>Alibi must be specific as to time, place, and persons</li>
                    <li>Vague alibi treated with suspicion</li>
                    <li>Fabricated alibi — courts are vigilant</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- BRANCH 3: CASE LAW -->
      <div class="child-node">
        <div class="card-wrap">
          <div class="card accent-coral" onclick="toggle(this)">
            <div class="card-header">
              <span class="icon">🏛️</span>
              <div style="flex:1">
                <span class="card-label">Branch 3</span>
                <div class="card-title">Landmark Cases — India</div>
              </div>
              <span class="level-tag tag-coral">Precedents</span>
              <span class="toggle-icon">›</span>
            </div>
            <div class="card-content">
              <ul>
                <li>Five must-know cases covering all key principles</li>
                <li>Courts consistently demand <em>cogent and reliable</em> evidence</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="children">

          <div class="child-node">
            <div class="card-wrap">
              <div class="card accent-coral" onclick="toggle(this)">
                <div class="card-header">
                  <span class="icon">📑</span>
                  <div style="flex:1">
                    <span class="card-label">Tier 1 · Case 1</span>
                    <div class="card-title">Dudh Nath Pandey v. State of U.P.</div>
                  </div>
                  <span class="level-tag tag-coral">1981</span>
                  <span class="toggle-icon">›</span>
                </div>
                <div class="card-content">
                  <ul>
                    <li><span class="highlight">(1981) 2 SCC 166</span></li>
                    <li><strong>Principle:</strong> Alibi must be proved with certainty; courts vigilant of fabrication</li>
                    <li class="case-ref">"Burden on accused to prove alibi is not same as prosecution's; balance of probabilities suffices"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="child-node">
            <div class="card-wrap">
              <div class="card accent-coral" onclick="toggle(this)">
                <div class="card-header">
                  <span class="icon">📑</span>
                  <div style="flex:1">
                    <span class="card-label">Tier 1 · Case 2</span>
                    <div class="card-title">Binay Kumar Singh v. State of Bihar</div>
                  </div>
                  <span class="level-tag tag-coral">1997</span>
                  <span class="toggle-icon">›</span>
                </div>
                <div class="card-content">
                  <ul>
                    <li><span class="highlight">(1997) 1 SCC 283</span></li>
                    <li><strong>Principle:</strong> Prosecution must first establish presence; alibi is a plea in reply</li>
                    <li class="case-ref">If prosecution fails to prove presence, alibi need not be examined</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="child-node">
            <div class="card-wrap">
              <div class="card accent-coral" onclick="toggle(this)">
                <div class="card-header">
                  <span class="icon">📑</span>
                  <div style="flex:1">
                    <span class="card-label">Tier 1 · Case 3</span>
                    <div class="card-title">State of Maharashtra v. Narsingrao Pimple</div>
                  </div>
                  <span class="level-tag tag-coral">1984</span>
                  <span class="toggle-icon">›</span>
                </div>
                <div class="card-content">
                  <ul>
                    <li><span class="highlight">(1984) 1 SCC 446</span></li>
                    <li><strong>Principle:</strong> Alibi witnesses must be credible</li>
                    <li>Interested witnesses (family) given lesser weight</li>
                    <li>Corroboration from independent sources essential</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="child-node">
            <div class="card-wrap">
              <div class="card accent-coral" onclick="toggle(this)">
                <div class="card-header">
                  <span class="icon">📑</span>
                  <div style="flex:1">
                    <span class="card-label">Tier 1 · Case 4</span>
                    <div class="card-title">Vijayee Singh v. State of U.P.</div>
                  </div>
                  <span class="level-tag tag-coral">1990</span>
                  <span class="toggle-icon">›</span>
                </div>
                <div class="card-content">
                  <ul>
                    <li><span class="highlight">(1990) 3 SCC 190</span></li>
                    <li><strong>Principle:</strong> Mere denial ≠ alibi</li>
                    <li>Must be substantiated by positive evidence</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="child-node">
            <div class="card-wrap">
              <div class="card accent-coral" onclick="toggle(this)">
                <div class="card-header">
                  <span class="icon">📑</span>
                  <div style="flex:1">
                    <span class="card-label">Tier 1 · Case 5</span>
                    <div class="card-title">Mukesh v. State NCT (Nirbhaya Case)</div>
                  </div>
                  <span class="level-tag tag-coral">2017</span>
                  <span class="toggle-icon">›</span>
                </div>
                <div class="card-content">
                  <ul>
                    <li><span class="highlight">(2017) 6 SCC 1</span></li>
                    <li><strong>Principle:</strong> Modern reiteration of alibi standards</li>
                    <li>Cogent and reliable evidence must be produced</li>
                    <li class="case-ref">Reaffirmed that alibi must be proved on balance of probabilities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- BRANCH 4: PROCEDURE -->
      <div class="child-node">
        <div class="card-wrap">
          <div class="card accent-lavender" onclick="toggle(this)">
            <div class="card-header">
              <span class="icon">⚙️</span>
              <div style="flex:1">
                <span class="card-label">Branch 4</span>
                <div class="card-title">Procedure &amp; Evidence</div>
              </div>
              <span class="level-tag tag-lavender">Practice</span>
              <span class="toggle-icon">›</span>
            </div>
            <div class="card-content">
              <ul>
                <li>Must be raised at earliest opportunity</li>
                <li>Late introduction viewed with suspicion</li>
                <li>BNSS 2023 S.330: Mandatory advance notice to court &amp; prosecution</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="children">

          <div class="child-node">
            <div class="card-wrap">
              <div class="card accent-lavender" onclick="toggle(this)">
                <div class="card-header">
                  <span class="icon">📂</span>
                  <div style="flex:1">
                    <span class="card-label">4.1</span>
                    <div class="card-title">Types of Alibi Evidence</div>
                  </div>
                  <span class="toggle-icon">›</span>
                </div>
                <div class="card-content">
                  <ul>
                    <li><span class="highlight">Witness</span> Employer, co-traveller, friend (independent &gt; family)</li>
                    <li><span class="highlight">Documentary</span> Travel tickets, hotel records, attendance registers</li>
                    <li><span class="highlight">Electronic</span> Call records (CDR), CCTV, GPS data, credit card logs</li>
                    <li><span class="highlight">Medical</span> Hospital admission records, prescriptions</li>
                    <li><span class="highlight">Toll/Transit</span> Toll records, train/bus booking</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="child-node">
            <div class="card-wrap">
              <div class="card accent-lavender" onclick="toggle(this)">
                <div class="card-header">
                  <span class="icon">🚫</span>
                  <div style="flex:1">
                    <span class="card-label">4.2</span>
                    <div class="card-title">Common Pitfalls</div>
                  </div>
                  <span class="toggle-icon">›</span>
                </div>
                <div class="card-content">
                  <ul>
                    <li>Alibi witnesses are "interested parties" (family)</li>
                    <li>Contradictions in timing between witnesses</li>
                    <li>Failure to cross-examine prosecution on identification</li>
                    <li>Alibi raised belatedly / after charge framing</li>
                    <li>No corroborative documentary evidence</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="child-node">
            <div class="card-wrap">
              <div class="card accent-lavender" onclick="toggle(this)">
                <div class="card-header">
                  <span class="icon">💻</span>
                  <div style="flex:1">
                    <span class="card-label">4.3</span>
                    <div class="card-title">Digital &amp; Electronic Alibi</div>
                  </div>
                  <span class="toggle-icon">›</span>
                </div>
                <div class="card-content">
                  <ul>
                    <li>CDRs (Call Detail Records) — location via tower pinging</li>
                    <li>CCTV footage — authentication under S.65B IEA</li>
                    <li>GPS / Google Timeline data</li>
                    <li>Social media timestamps, email metadata</li>
                    <li><span class="highlight">Emerging</span> Deepfake / AI — risk of fabricated digital alibi</li>
                    <li>Courts require proper certification for electronic evidence</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- BRANCH 5: NEPAL / COMPARATIVE -->
      <div class="child-node">
        <div class="card-wrap">
          <div class="card accent-green" onclick="toggle(this)">
            <div class="card-header">
              <span class="icon">🌏</span>
              <div style="flex:1">
                <span class="card-label">Branch 5</span>
                <div class="card-title">Nepal &amp; Comparative Law</div>
              </div>
              <span class="level-tag tag-green">Comparative</span>
              <span class="toggle-icon">›</span>
            </div>
            <div class="card-content">
              <ul>
                <li>Nepal follows broadly similar principles — shared common law heritage</li>
                <li>SAARC judicial dialogue promotes convergence</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="children">

          <div class="child-node">
            <div class="card-wrap">
              <div class="card accent-green" onclick="toggle(this)">
                <div class="card-header">
                  <span class="icon">🇳🇵</span>
                  <div style="flex:1">
                    <span class="card-label">5.1</span>
                    <div class="card-title">Nepali Statutory Position</div>
                  </div>
                  <span class="toggle-icon">›</span>
                </div>
                <div class="card-content">
                  <ul>
                    <li>Muluki Criminal Code Act 2074 BS — defence provisions</li>
                    <li>Evidence Act 2031 BS — relevancy of alibi facts</li>
                    <li><em>Samarthana</em> (corroboration) principle in Nepali evidence law</li>
                    <li>Timing of raising alibi: must be at trial stage</li>
                    <li>Adjudication: District Courts → High Courts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="child-node">
            <div class="card-wrap">
              <div class="card accent-green" onclick="toggle(this)">
                <div class="card-header">
                  <span class="icon">🌐</span>
                  <div style="flex:1">
                    <span class="card-label">5.2</span>
                    <div class="card-title">Cross-Jurisdictional Comparison</div>
                  </div>
                  <span class="toggle-icon">›</span>
                </div>
                <div class="card-content">
                  <table class="mini-table">
                    <tr><th>Issue</th><th>India</th><th>UK</th><th>USA</th></tr>
                    <tr><td>Statutory basis</td><td>S.11 IEA / BSA</td><td>Common law</td><td>Rule 12.1 FRCP</td></tr>
                    <tr><td>Notice required?</td><td>Yes (BNSS)</td><td>No</td><td>Yes (advance)</td></tr>
                    <tr><td>Standard</td><td>Balance of probs</td><td>Evidential only</td><td>Preponderance</td></tr>
                    <tr><td>Electronic evidence</td><td>S.65B IEA</td><td>Similar</td><td>Similar</td></tr>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- BRANCH 6: RECENT DEVELOPMENTS -->
      <div class="child-node">
        <div class="card-wrap">
          <div class="card accent-gold" onclick="toggle(this)">
            <div class="card-header">
              <span class="icon">🆕</span>
              <div style="flex:1">
                <span class="card-label">Branch 6</span>
                <div class="card-title">Recent Developments</div>
              </div>
              <span class="level-tag tag-gold">2023–25</span>
              <span class="toggle-icon">›</span>
            </div>
            <div class="card-content">
              <ul>
                <li><span class="highlight">BNSS 2023 S.330</span> Mandatory advance notice of alibi — major change from IEA regime</li>
                <li><span class="highlight">BSA 2023</span> S.11 retains alibi relevancy; S.107 on burden</li>
                <li>Courts increasingly accepting CDR, GPS, social media as alibi evidence</li>
                <li><span class="highlight">Emerging</span> AI/Deepfake risk — authentication of digital alibi challenged</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- BRANCH 7: ASSESSMENT -->
      <div class="child-node">
        <div class="card-wrap">
          <div class="card accent-teal" onclick="toggle(this)">
            <div class="card-header">
              <span class="icon">🎯</span>
              <div style="flex:1">
                <span class="card-label">Branch 7</span>
                <div class="card-title">Problem Scenarios</div>
              </div>
              <span class="level-tag tag-teal">Assessment</span>
              <span class="toggle-icon">›</span>
            </div>
            <div class="card-content">
              <ul>
                <li>Three-tier problem design: Basic → Intermediate → Advanced</li>
                <li>Key issues: Credibility of witnesses, digital evidence, co-accused</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="children">

          <div class="child-node">
            <div class="card-wrap">
              <div class="card accent-teal" onclick="toggle(this)">
                <div class="card-header">
                  <span class="icon">🅐</span>
                  <div style="flex:1">
                    <span class="card-label">Problem 1 · Basic</span>
                    <div class="card-title">Ram — Wedding Alibi (Delhi/Lucknow)</div>
                  </div>
                  <span class="toggle-icon">›</span>
                </div>
                <div class="card-content">
                  <ul>
                    <li>Charged: robbery in Delhi at 3 PM, 15 Jan</li>
                    <li>Claims: attending wedding in Lucknow</li>
                    <li>Evidence: 2 relatives + photographer; name absent from hotel register</li>
                    <li><span class="highlight">Issues</span> Interested witnesses? Corroboration? Gaps in timing?</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="child-node">
            <div class="card-wrap">
              <div class="card accent-teal" onclick="toggle(this)">
                <div class="card-header">
                  <span class="icon">🅑</span>
                  <div style="flex:1">
                    <span class="card-label">Problem 2 · Intermediate</span>
                    <div class="card-title">Sita — Phone Tower Alibi (Nepal)</div>
                  </div>
                  <span class="toggle-icon">›</span>
                </div>
                <div class="card-content">
                  <ul>
                    <li>Charged: murder in Kathmandu</li>
                    <li>Claims: was in Pokhara at material time</li>
                    <li>Evidence: Mobile pinging Pokhara tower</li>
                    <li>Prosecution: Phone could have been with someone else</li>
                    <li><span class="highlight">Issues</span> Evidentiary value of CDR; authentication; rebuttal</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="child-node">
            <div class="card-wrap">
              <div class="card accent-teal" onclick="toggle(this)">
                <div class="card-header">
                  <span class="icon">🅒</span>
                  <div style="flex:1">
                    <span class="card-label">Problem 3 · Advanced</span>
                    <div class="card-title">Three Co-Accused — Terror Case</div>
                  </div>
                  <span class="toggle-icon">›</span>
                </div>
                <div class="card-content">
                  <ul>
                    <li>Accused A: Abroad — passport stamped ✓ Strong alibi</li>
                    <li>Accused B: Claims alibi but witnesses turn hostile ✗</li>
                    <li>Accused C: No alibi raised at all</li>
                    <li><span class="highlight">Issues</span> Effect of A's success on B &amp; C? Individual vs. joint liability? Common intention?</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</div>

<!-- Footer -->
<div style="text-align:center; margin-top:3rem; font-family:'DM Mono',monospace; font-size:0.65rem; color:var(--muted); letter-spacing:0.1em;">
  PLEA OF ALIBI · LLM NOTES · INDIA &amp; NEPAL · CRIMINAL LAW &amp; EVIDENCE
</div>

<script>
  function toggle(card) {
    card.classList.toggle('open');
  }

  function expandAll() {
    document.querySelectorAll('.card:not(.root-card)').forEach(c => c.classList.add('open'));
  }

  function collapseAll() {
    document.querySelectorAll('.card:not(.root-card)').forEach(c => c.classList.remove('open'));
  }
</script>

</body>
</html>

`;
window.html1Meta = {
  name: "Alibi Full HTML 1",
  emoji: "📝"

};
