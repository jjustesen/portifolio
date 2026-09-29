// Vocab Node product recreation (English) with scripted demos.
// Scenes: #call (live class), #lesson (AI lesson + assignment), #task (student on mobile).
// ?clean hides the controls (used when embedded, and for recording).

const stage = document.getElementById('stage');
if (new URLSearchParams(location.search).has('clean')) document.body.classList.add('clean');

/* ───────── Icons (Lucide paths) ───────── */
const P = (d) => `<path d="${d}"/>`;
const ICONS = {
  cap: P('M21.4 10.9a1 1 0 0 0 0-1.8L12.8 5.2a2 2 0 0 0-1.6 0L2.6 9.1a1 1 0 0 0 0 1.8l8.6 3.9a2 2 0 0 0 1.6 0zM22 10v6M6 12.5V16a6 3 0 0 0 12 0v-3.5'),
  sun: '<circle cx="12" cy="12" r="4"/>' + P('M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4'),
  users: P('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8') + '<circle cx="9" cy="7" r="4"/>',
  usersRound: P('M18 21a8 8 0 0 0-16 0') + '<circle cx="10" cy="8" r="5"/>' + P('M22 20c0-3.4-2-6.5-4-8a5 5 0 0 0-.4-8.9'),
  pencil: P('M21.2 6.8a2.8 2.8 0 0 0-4-4L3.8 16.2a2 2 0 0 0-.5.8l-1.3 4.4a.5.5 0 0 0 .6.6l4.4-1.3a2 2 0 0 0 .8-.5zM15 5l4 4'),
  library: P('m16 6 4 14M12 6v14M8 8v12M4 4v16'),
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/>' + P('M16 2v4M8 2v4M3 10h18'),
  wallet: P('M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4'),
  settings: '<circle cx="12" cy="12" r="3"/>' + P('M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z'),
  logout: P('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9'),
  video: P('m16 13 5.2 3.5a.5.5 0 0 0 .8-.4V7.9a.5.5 0 0 0-.8-.4L16 11') + '<rect x="2" y="6" width="14" height="12" rx="2"/>',
  mic: P('M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3'),
  screen: '<rect x="2" y="3" width="20" height="14" rx="2"/>' + P('M8 21h8M12 17v4M9 10l3-3 3 3M12 7v7'),
  layers: P('m12.8 2.2 8.5 3.9a1 1 0 0 1 0 1.8l-8.5 3.9a2 2 0 0 1-1.6 0L2.7 7.9a1 1 0 0 1 0-1.8l8.5-3.9a2 2 0 0 1 1.6 0zM2 12a1 1 0 0 0 .6.9l8.6 3.9a2 2 0 0 0 1.6 0l8.6-3.9A1 1 0 0 0 22 12M2 17a1 1 0 0 0 .6.9l8.6 3.9a2 2 0 0 0 1.6 0l8.6-3.9A1 1 0 0 0 22 17'),
  smile: '<circle cx="12" cy="12" r="10"/>' + P('M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01'),
  chat: P('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'),
  panel: '<rect x="3" y="3" width="18" height="18" rx="2"/>' + P('M15 3v18'),
  door: P('M13 4h3a2 2 0 0 1 2 2v14M2 20h3M13 20h9M10 12v.01M13 4.6v16.2a1 1 0 0 1-1.2 1L5 20V5.6a2 2 0 0 1 1.6-2l4-.8A2 2 0 0 1 13 4.6z'),
  mouse: P('M4 4l7.1 17 2.5-7.4L21 11.1z'),
  pen: P('M12 20h9M16.4 3.6a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z'),
  type: P('M4 7V4h16v3M9 20h6M12 4v16'),
  square: '<rect x="3" y="3" width="18" height="18" rx="2"/>',
  circle: '<circle cx="12" cy="12" r="9"/>',
  arrow: P('M7 17 17 7M8 7h9v9'),
  eraser: P('m7 21-4.3-4.3a1 1 0 0 1 0-1.4l10-10a1 1 0 0 1 1.4 0l5.6 5.6a1 1 0 0 1 0 1.4L11 21M22 21H7M5 11l9 9'),
  sparkles: P('M9.9 15.5A2 2 0 0 0 8.5 14.1L2.4 12.5a.5.5 0 0 1 0-1L8.5 9.9A2 2 0 0 0 9.9 8.5l1.6-6.1a.5.5 0 0 1 1 0l1.6 6.1a2 2 0 0 0 1.4 1.4l6.1 1.6a.5.5 0 0 1 0 1l-6.1 1.6a2 2 0 0 0-1.4 1.4l-1.6 6.1a.5.5 0 0 1-1 0zM20 3v4M22 5h-4'),
  file: P('M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zM14 2v4a2 2 0 0 0 2 2h4'),
  check: P('M20 6 9 17l-5-5'),
  search: '<circle cx="11" cy="11" r="8"/>' + P('m21 21-4.3-4.3'),
  send: P('M14.5 21.7a.5.5 0 0 0 .9 0L22 2.9a.5.5 0 0 0-.6-.6L2.3 8.6a.5.5 0 0 0 0 .9l7.9 3.2a2 2 0 0 1 1.1 1.1zM21.9 2.1 10.9 13.1'),
  copy: '<rect x="8" y="8" width="14" height="14" rx="2"/>' + P('M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2'),
  whatsapp: P('M7.9 20A9 9 0 1 0 4 16.1L2 22z'),
  play: P('M6 3l14 9-14 9z'),
  x: P('M18 6 6 18M6 6l12 12'),
  flame: P('M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3.2.1 1.3.9 2.3 2.5 2.7z'),
  party: P('M5.8 11.3 2 22l10.7-3.8M4 3h.01M22 8h.01M15 2h.01M22 20h.01M22 2l-2.2.7a2.9 2.9 0 0 0-1.9 3.3c.1.6-.4 1.1-1 1.1h-.4c-.9 0-1.6.6-1.8 1.4L14 10M22 13l-.8-.3c-.9-.3-1.8.2-2.1 1.1-.2.6-.8 1-1.4 1h0c-.9 0-1.6.7-1.6 1.6V18M11 2l.3.8c.3.9-.2 1.8-1.1 2.1-.6.2-1 .8-1 1.4v0c0 .9-.7 1.6-1.6 1.6H6') + P('M10.7 13.3c-1.9-1.9-4.3-2.8-5.3-1.8s-.1 3.4 1.8 5.3 4.3 2.8 5.3 1.8.1-3.4-1.8-5.3z'),
  bulb: P('M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4'),
  volume: P('M11 4.7a.7.7 0 0 0-1.2-.5L6.4 7.6A1.4 1.4 0 0 1 5.4 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.4a1.4 1.4 0 0 1 1 .4l3.4 3.4a.7.7 0 0 0 1.2-.5zM16 9a5 5 0 0 1 0 6M19.4 18.4a9 9 0 0 0 0-12.8'),
  trash: P('M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'),
  chevDown: P('m6 9 6 6 6-6'),
  thumb: P('M7 10v12M15 5.9 14 10h5.8a2 2 0 0 1 1.9 2.6l-2.3 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.8a2 2 0 0 0 1.8-1.1L12 2a3.1 3.1 0 0 1 3 3.9z'),
};
const icon = (name, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24">${ICONS[name]}</svg>`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ───────── Teacher app frame ───────── */
function header(active) {
  const items = [['sun', 'Today'], ['users', 'Students'], ['usersRound', 'Classes'], ['pencil', 'Activities'], ['library', 'Materials'], ['calendar', 'Schedule'], ['wallet', 'Finance']];
  return `<header class="app-header">
    <div class="brand"><span class="brand-mark">${icon('cap')}</span>Vocab Node</div>
    <nav class="top-nav">${items.map(([i, t]) => `<span class="${t === active ? 'on' : ''}">${icon(i)}${t}</span>`).join('')}</nav>
    <div class="head-right"><span class="me">A</span>${icon('settings')}${icon('logout')}</div>
  </header>`;
}

// Video tile: a stylised person in a softly lit room.
function tile(name, hue, cls = '') {
  const bg = hue === 'warm' ? 'radial-gradient(120% 90% at 30% 20%, #6b4f8f, #2a1f3d 55%, #140f1f)' : 'radial-gradient(120% 90% at 70% 20%, #2f6f86, #173848 55%, #0b1c24)';
  const skin = hue === 'warm' ? '#e9b99a' : '#c98f6b';
  const shirt = hue === 'warm' ? '#c4b5fd' : '#fcd34d';
  const hair = hue === 'warm' ? '#3b2418' : '#1f140e';
  return `<div class="tile ${cls}" style="background:${bg}">
    <svg class="person" viewBox="0 0 200 200"><path d="M20 200c4-46 36-70 80-70s76 24 80 70z" fill="${shirt}"/><rect x="86" y="104" width="28" height="32" rx="10" fill="${skin}"/><ellipse cx="100" cy="78" rx="38" ry="44" fill="${skin}"/><path d="M60 78c-4-40 24-58 44-56 26 2 42 20 38 52-6-18-22-26-44-26-18 0-30 10-38 30z" fill="${hair}"/></svg>
    <div class="conn"><div><span class="spin"></span>Connecting…</div></div>
    <span class="name">${name}</span>
  </div>`;
}

/* ───────── Scene markup ───────── */
function callMarkup() {
  return `
  <div class="screen" data-s="profile">${header('Students')}
    <div class="panel"><div class="content">
      <div class="profile-head"><div class="avatar">L</div><div><h1>Lucas Martins</h1><p>B1 · Student since August · Tuesdays 7 pm</p></div></div>
      <div class="profile-grid">
        <div class="room-card">
          <div class="eyebrow">${icon('video')}Video room</div>
          <h2>Lucas’s room</h2>
          <span class="btn violet" data-join>${icon('video')}Join</span>
          <div class="link-field">vocabnode.app/s/k3f9x2…<span class="copy">Copy</span></div>
          <small>The link is the same every week — agree on it once and Lucas joins directly, nothing to install and no password.</small>
        </div>
        <div class="card list-card">
          <h3>Assignments</h3>
          <div class="row"><span class="tag t-violet">B1</span>Weekend in Rio — Past simple<span class="pill done">9/10</span></div>
          <div class="row"><span class="tag t-violet">B1</span>Travel vocabulary — Unit 7<span class="pill wait">Waiting</span></div>
          <div class="row"><span class="tag t-violet">B1</span>At the airport — Listening<span class="pill done">8/10</span></div>
          <div class="row"><span class="tag t-violet">A2</span>Daily routine — Present simple<span class="pill done">10/10</span></div>
        </div>
      </div>
    </div></div>
  </div>
  <div class="screen dark off" data-s="lobby">
    <div class="lobby">
      <div class="badge">${icon('cap')}</div>
      <h1>Lucas Martins</h1>
      <p>You’ll join as <b>Ana</b>.</p>
      <span class="btn violet" data-enter>${icon('video')}Join room</span>
      <small>Your browser will ask for camera and microphone access.</small>
    </div>
  </div>
  <div class="screen dark off" data-s="room">
    <div class="speakers"><span class="talk" data-sp="ana">${icon('mic')}Ana</span><span data-sp="lucas" style="display:none">${icon('mic')}Lucas</span></div>
    <div class="tiles" data-tiles>${tile('Ana (you)', 'warm', 'talk')}</div>
    <div class="stage-area" data-stage>
      <div class="board-tools">${['mouse', 'pen', 'type', 'square', 'circle', 'arrow', 'eraser'].map((t) => `<span class="${t === 'pen' ? 'on' : ''}">${icon(t)}</span>`).join('')}</div>
      <div class="board">
        <svg viewBox="0 0 1420 870" data-board>
          <defs><clipPath id="write"><rect data-writeclip x="0" y="0" width="0" height="870"/></clipPath><clipPath id="note"><rect data-noteclip x="0" y="0" width="0" height="870"/></clipPath></defs>
          <text class="ink" x="170" y="330" font-size="74" fill="#171717" clip-path="url(#write)">Yesterday I <tspan data-went>went</tspan> to the beach.</text>
          <path data-ring class="draw" fill="none" stroke="#8b5cf6" stroke-width="6" stroke-linecap="round"/>
          <path data-arrow class="draw" fill="none" stroke="#8b5cf6" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
          <text class="ink" data-note x="0" y="0" font-size="58" fill="#6d28d9" clip-path="url(#note)">go → went (irregular)</text>
        </svg>
      </div>
    </div>
    <div class="queue" data-queue>
      <header>${icon('door')}1 waiting to join</header>
      <div class="person-row"><span class="ini">L</span>Lucas Martins<span class="decline">Decline</span><span class="admit" data-admit>Admit</span></div>
    </div>
    <div class="menu" data-menu>
      <h4>Put on stage</h4>
      <div>${icon('video')}Video only</div>
      <div data-wb>${icon('pen')}Whiteboard</div>
      <div>${icon('file')}Unit 7 — Travel.pdf</div>
    </div>
    <div class="bar">
      <span>${icon('mic')}</span><span>${icon('video')}${icon('chevDown')}</span><span>${icon('screen')}</span>
      <span data-stagebtn>${icon('layers')}<span data-stagelabel style="padding:0;background:none;height:auto">Video only</span></span>
      <span>Cameras</span><span>${icon('smile')}React</span><span>${icon('chat')}Chat</span><span>${icon('panel')}Panel</span>
      <span class="leave">Leave</span>
    </div>
  </div>`;
}

const MATERIAL = 'Last weekend Julia went to Rio with her friends. They stayed in a small hotel near the beach, ate fresh fish and saw an amazing sunset. On Sunday they bought souvenirs and took the bus home.';

function lessonMarkup() {
  const skills = ['Reading', 'Writing', 'Listening', 'Speaking', 'Vocabulary', 'Grammar'];
  return `${header('Activities')}
  <div class="panel">
    <div class="content screen" data-s="gen">
      <div class="page-head"><span class="spark">${icon('sparkles')}</span><h1>Generate activity with AI</h1></div>
      <p class="page-sub">Paste the text or send a PDF/photo of the class material — the AI only uses what’s there, it never invents new content.</p>
      <div class="gen-grid">
        <div class="card gen-card">
          <h2><span class="num v">1</span>Class material</h2>
          <div class="seg"><span class="on">Paste text</span><span>PDF or photo</span></div>
          <div class="textarea" data-material><span class="ph">Paste the text, dialogue or vocabulary list used in class...</span></div>
        </div>
        <div class="card gen-card">
          <h2><span class="num e">2</span>Parameters</h2>
          <div class="field-label">Level</div>
          <div class="chips">${['A1', 'A2', 'B1', 'B2', 'C1'].map((l) => `<span class="chip${l === 'B1' ? ' on' : ''}">${l}</span>`).join('')}</div>
          <div class="field-label">Questions</div>
          <div class="chips">${['5', '10', '15', '20'].map((n) => `<span class="chip${n === '10' ? ' on' : ''}">${n}</span>`).join('')}</div>
          <div class="field-label">Skills</div>
          <div class="chips">${skills.map((s) => `<span class="chip lilac" data-skill="${s}">${s}</span>`).join('')}</div>
          <div class="field-label">Focus (optional)</div>
          <div class="input" data-focus><span class="ph">e.g. past simple, travel phrasal verbs...</span></div>
        </div>
      </div>
      <div class="gen-actions"><span class="btn" data-generate>${icon('sparkles')}Generate activity</span></div>
    </div>
    <div class="content screen off" data-s="review">
      <div class="review-head"><div><h1>Weekend in Rio — Past simple</h1><p>10 questions · B1 · Reading, Vocabulary, Grammar</p></div><span class="btn" data-save>Save activity</span></div>
      <div class="qlist" data-qlist></div>
    </div>
    <div class="generating" data-generating><div class="box">
      <div class="orb">${icon('sparkles')}</div>
      <h3>Generating...</h3><p>this can take up to 90 seconds</p>
      <div class="steps">
        <div data-step><span class="dot">${icon('check')}</span>Reading your class material</div>
        <div data-step><span class="dot">${icon('check')}</span>Writing 10 questions from it</div>
        <div data-step><span class="dot">${icon('check')}</span>Checking every answer</div>
      </div>
    </div></div>
    <div class="modal-back" data-modal><div class="modal" data-modalbody></div></div>
  </div>`;
}

const QUESTIONS = [
  { tag: 'Q1 · multiple choice', cls: 't-violet', ins: 'Choose the option that completes the sentence', en: 'Last weekend Julia ____ to Rio.', opts: ['went', 'goes', 'go', 'going'], ok: 0, exp: '“Go” is irregular in the past: go → went.' },
  { tag: 'Q2 · fill in the blank', cls: 't-sky', ins: 'Complete the sentence', en: 'They ______ in a small hotel near the beach.', opts: ['stayed', 'stay', 'staying', 'stays'], ok: 0, exp: 'Regular verb: stay → stayed.' },
  { tag: 'Q3 · match columns', cls: 't-emerald', ins: 'Match each verb to its past form', en: 'buy · see · eat · take', opts: ['buy → bought', 'see → saw', 'eat → ate', 'take → took'], ok: -1, exp: 'Four irregular verbs from the text.' },
  { tag: 'Q4 · order the words', cls: 't-amber', ins: 'Put the words in order', en: 'sunset · They · an · saw · amazing', opts: ['They saw an amazing sunset'], ok: 0, exp: 'Adjectives come before the noun.' },
  { tag: 'Q5 · listen and order', cls: 't-indigo', ins: 'Listen and put the sentence in order', en: '▶ 0:03 · AI voice', opts: ['They took the bus home'], ok: 0, exp: 'Audio generated once with AI text-to-speech.' },
];

function taskMarkup() {
  const blobs = [[140, 120, 360, '#ddd6fe'], [1560, 160, 300, '#fde68a'], [1440, 760, 420, '#d1fae5'], [220, 780, 280, '#ffe4e6']];
  return `<div class="task-bg">${blobs.map(([x, y, s, c]) => `<div class="blob" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;background:${c}"></div>`).join('')}
    <div class="phone"><div class="scr"><div class="notch"></div>
      <div class="pane" data-p="intro">
        <div class="intro-head"><div class="c1"></div><div class="c2"></div><div class="teacher-sq">A</div><h1><b>Ana</b> sent you<br>a task</h1></div>
        <div class="task-card"><h2>Weekend in Rio — Past simple</h2><div class="chips"><span>10 questions</span><span>~8 min</span><span class="lv">B1</span></div></div>
        <div class="name-field"><label>Your first name</label><div>Lucas<small>✓ remembered</small></div></div>
        <div class="foot"><div class="chunky" data-start>${icon('play')}Start</div><small>No sign-up, nothing to install</small></div>
      </div>
      <div class="pane next" data-p="q8">
        ${qhead(8, 70, 3)}
        <div style="padding:0 20px"><h1 class="qt">Choose the option that completes the sentence</h1><div class="bubble">Last weekend Julia <span class="blank" data-blank>&nbsp;</span> to Rio.</div></div>
        <div class="tiles-q">${['went', 'goes', 'go', 'going'].map((o, i) => `<div class="opt" data-opt="${o}"><span class="n">${i + 1}</span>${o}<span class="lab"></span></div>`).join('')}</div>
        ${sheet('good', 'party', 'Nice!', '“Go” is irregular in the past: go → went.', 'green', 'Next')}
      </div>
      <div class="pane next" data-p="q9">
        ${qhead(9, 80, 4)}
        <div style="padding:0 20px"><h1 class="qt">Match each verb to its past form</h1></div>
        <div class="hint" data-hint>Tap one word on each side to make a pair.</div>
        <div class="pairs"><div class="col">${['buy', 'see', 'eat', 'take'].map((w) => `<div class="pair" data-l="${w}">${w}</div>`).join('')}</div><div class="col">${['ate', 'bought', 'took', 'saw'].map((w) => `<div class="pair" data-r="${w}">${w}</div>`).join('')}</div></div>
        ${sheet('bad', 'bulb', 'Almost!', 'You matched every pair, but missed 1 on the first try.', 'rose', 'Got it, next')}
      </div>
      <div class="pane next" data-p="q10">
        ${qhead(10, 90, 0)}
        <div style="padding:0 20px"><h1 class="qt">Put the words in order</h1></div>
        <div class="lined" data-lined><span class="ph">Tap the words below</span></div>
        <div class="bank">${['sunset', 'They', 'an', 'saw', 'amazing'].map((w) => `<span class="word" data-w="${w}">${w}</span>`).join('')}</div>
        <div class="foot"><div class="chunky" data-check>Check</div></div>
        ${sheet('good', 'party', 'Nice!', 'Adjectives come before the noun: an amazing sunset.', 'green', 'See result')}
      </div>
      <div class="pane next" data-p="result">
        <div class="result">
          <div class="party">${icon('party')}</div>
          <h1>Well done, Lucas!</h1>
          <p>You got 9 out of 10</p>
          <div class="stats">
            <div class="stat"><div style="background:#38bdf8">TIME</div><b>6:42</b></div>
            <div class="stat"><div style="background:#f59e0b">STREAK</div><b>4</b></div>
            <div class="stat"><div style="background:#10b981">CORRECT</div><b>90%</b></div>
          </div>
        </div>
        <div class="foot"><div class="chunky violet" style="margin-bottom:12px">Review the 1 mistake</div><div class="chunky">Finish</div><div class="received">✓ Ana already got your result</div></div>
      </div>
    </div></div>
  </div>`;
}

function qhead(n, pct, streak) {
  return `<div class="qhead">
    <div class="prog"><span class="x">${icon('x')}</span><div class="track"><div class="fill" style="width:${pct}%"></div></div><span class="streak${streak ? ' hot' : ''}" data-streak>${icon('flame')}<span>${streak}</span></span></div>
    <div class="ey">QUESTION ${n} OF 10</div>
  </div>`;
}

function sheet(kind, ic, title, text, btn, label) {
  return `<div class="sheet ${kind}" data-sheet><h3>${icon(ic)}${title}</h3><p>${text}</p><div class="chunky ${btn}" data-next>${label}</div></div>`;
}

/* ───────── Timeline helpers ───────── */
let speed = 1;
class Run {
  constructor() { this.ctrl = new AbortController(); }
  get signal() { return this.ctrl.signal; }
  abort() { this.ctrl.abort(); }
  wait(ms) {
    return new Promise((resolve, reject) => {
      if (this.signal.aborted) return reject(new DOMException('aborted', 'AbortError'));
      const t = setTimeout(resolve, ms / speed);
      this.signal.addEventListener('abort', () => { clearTimeout(t); reject(new DOMException('aborted', 'AbortError')); }, { once: true });
    });
  }
}

let scale = 1;
function fit() {
  const vp = document.getElementById('viewport').getBoundingClientRect();
  scale = Math.min(vp.width / 1920, vp.height / 1080);
  stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
}
addEventListener('resize', fit);

function pointOf(el, fx = 0.5, fy = 0.5) {
  const r = el.getBoundingClientRect(), s = stage.getBoundingClientRect();
  return [(r.left + r.width * fx - s.left) / scale, (r.top + r.height * fy - s.top) / scale];
}

function makeCursor(run, { touch = false, from = [1500, 1150] } = {}) {
  const el = document.createElement('div');
  el.className = `cursor${touch ? ' touch' : ''}`;
  el.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 2.5 19.5 13l-7 1.2-3.9 6.3z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  stage.appendChild(el);
  let [x, y] = from;
  el.style.transform = `translate(${x}px, ${y}px)`;
  return {
    async move(target, fx, fy) {
      const [tx, ty] = Array.isArray(target) ? target : pointOf(target, fx, fy);
      const d = Math.hypot(tx - x, ty - y);
      const dur = Math.min(1000, Math.max(320, d * 0.85));
      el.style.transitionDuration = `${dur / speed}ms`;
      el.style.transform = `translate(${tx}px, ${ty}px)`;
      x = tx; y = ty;
      await run.wait(dur + 60);
    },
    async click(pressEl) {
      el.classList.add('press');
      pressEl?.classList.add('press');
      const r = document.createElement('span');
      r.className = 'ripple';
      r.style.left = `${x + (touch ? 0 : 4)}px`;
      r.style.top = `${y + (touch ? 0 : 3)}px`;
      stage.appendChild(r);
      setTimeout(() => r.remove(), 700);
      await run.wait(150);
      el.classList.remove('press');
      pressEl?.classList.remove('press');
      await run.wait(110);
    },
    async tap(target, fx, fy) { await this.move(target, fx, fy); await this.click(Array.isArray(target) ? null : target); },
  };
}

async function typeInto(run, el, text, { min = 22, max = 55 } = {}) {
  el.innerHTML = '<span data-val></span><span class="caret"></span>';
  const val = el.querySelector('[data-val]');
  for (const ch of text) {
    val.textContent += ch;
    await run.wait(min + Math.random() * (max - min));
  }
}

/** Reveals an SVG clip rect from left to right, like handwriting. */
async function writeOn(run, rect, width, ms) {
  const steps = 40;
  for (let i = 1; i <= steps; i++) { rect.setAttribute('width', String((width * i) / steps)); await run.wait(ms / steps); }
}

function drawPath(path, d) {
  path.setAttribute('d', d);
  const len = path.getTotalLength();
  path.style.setProperty('--len', `${len}`);
  path.getBoundingClientRect();
  path.classList.add('go');
}

/* ───────── Scene flows ───────── */
const FLOWS = {
  async call(run, root) {
    const $ = (s) => root.querySelector(s);
    const show = (name) => root.querySelectorAll('[data-s]').forEach((s) => s.classList.toggle('off', s.dataset.s !== name));
    const cursor = makeCursor(run);
    await run.wait(700);
    // Teacher opens the student's room from the profile.
    await cursor.tap($('[data-join]'));
    show('lobby');
    await run.wait(900);
    const enter = $('[data-enter]');
    await cursor.tap(enter);
    enter.innerHTML = '<span class="spin"></span>Connecting…';
    await run.wait(900);
    show('room');
    await cursor.move([1500, 980]);
    await run.wait(1400);
    // The student knocks: waiting room, admit.
    $('[data-queue]').classList.add('on');
    await run.wait(900);
    await cursor.tap($('[data-admit]'));
    $('[data-queue]').classList.remove('on');
    const tiles = $('[data-tiles]');
    tiles.insertAdjacentHTML('beforeend', tile('Lucas', 'cool', 'connecting'));
    $('[data-sp="lucas"]').style.display = '';
    await run.wait(1100);
    tiles.querySelectorAll('.tile')[1].classList.remove('connecting');
    const talk = (who) => {
      root.querySelectorAll('[data-sp]').forEach((s) => s.classList.toggle('talk', s.dataset.sp === who));
      tiles.querySelectorAll('.tile').forEach((t, i) => t.classList.toggle('talk', (i === 0) === (who === 'ana')));
    };
    await run.wait(700);
    talk('lucas');
    await run.wait(1500);
    talk('ana');
    await run.wait(800);
    // Put the whiteboard on stage.
    await cursor.tap($('[data-stagebtn]'));
    $('[data-menu]').classList.add('on');
    await run.wait(600);
    const wb = $('[data-wb]');
    await cursor.move(wb);
    wb.classList.add('hl');
    await cursor.click();
    $('[data-menu]').classList.remove('on');
    $('[data-stagebtn]').classList.add('on');
    $('[data-stagelabel]').textContent = 'Whiteboard ✕';
    tiles.classList.add('strip');
    $('[data-stage]').classList.add('on');
    await run.wait(700);
    // Handwriting, then the circle and the note.
    await cursor.move([420, 470]);
    await writeOn(run, $('[data-writeclip]'), 1420, 1600);
    const b = $('[data-went]').getBBox();
    const cx = b.x + b.width / 2, cy = b.y + b.height / 2 + 4, rx = b.width / 2 + 14, ry = b.height / 2 + 10;
    // The board's viewBox is 1:1 with its box, which sits at (60, 90) on the stage.
    await cursor.move([60 + cx + rx, 90 + cy + 30]);
    drawPath($('[data-ring]'), `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2 - 12} -8`);
    await run.wait(1150);
    const ax = cx, ay = cy + ry + 8;
    drawPath($('[data-arrow]'), `M ${ax} ${ay} C ${ax - 10} ${ay + 70}, ${ax + 30} ${ay + 120}, ${ax + 110} ${ay + 150} M ${ax + 110} ${ay + 150} l -34 -4 M ${ax + 110} ${ay + 150} l -16 -30`);
    await run.wait(1100);
    const note = $('[data-note]');
    note.setAttribute('x', String(ax + 130));
    note.setAttribute('y', String(ay + 170));
    await writeOn(run, $('[data-noteclip]'), 1420, 1200);
    await run.wait(500);
    // The student reacts.
    talk('lucas');
    const [lx, ly] = pointOf(tiles.querySelectorAll('.tile')[1], 0.5, 0.6);
    const r = document.createElement('span');
    r.className = 'react';
    r.innerHTML = `${icon('thumb')}Got it`;
    r.style.left = `${lx - 50}px`;
    r.style.top = `${ly}px`;
    root.querySelector('[data-s="room"]').appendChild(r);
    await run.wait(3000);
  },

  async lesson(run, root) {
    const $ = (s) => root.querySelector(s);
    const cursor = makeCursor(run);
    await run.wait(600);
    // Material and parameters.
    await cursor.tap($('[data-material]'), 0.2, 0.2);
    await typeInto(run, $('[data-material]'), MATERIAL, { min: 8, max: 22 });
    for (const s of ['Reading', 'Vocabulary', 'Grammar']) {
      const chip = $(`[data-skill="${s}"]`);
      await cursor.tap(chip);
      chip.classList.add('on');
      chip.innerHTML = `${icon('check')}${s}`;
    }
    await cursor.tap($('[data-focus]'), 0.3, 0.5);
    await typeInto(run, $('[data-focus]'), 'past simple, irregular verbs');
    const gen = $('[data-generate]');
    await cursor.tap(gen);
    // Generation.
    $('[data-generating]').classList.add('on');
    await cursor.move([1560, 980]);
    const steps = root.querySelectorAll('[data-step]');
    for (const [i, ms] of [[0, 900], [1, 1400], [2, 900]]) { await run.wait(ms); steps[i].classList.add('done'); }
    await run.wait(500);
    $('[data-generating]').classList.remove('on');
    root.querySelector('[data-s="gen"]').classList.add('off');
    root.querySelector('[data-s="review"]').classList.remove('off');
    // Review: questions arrive one by one.
    const list = $('[data-qlist]');
    for (const q of QUESTIONS) {
      list.insertAdjacentHTML('beforeend', `<div class="card q fade-in"><div class="top"><span class="tag ${q.cls}">${q.tag}</span><span class="actions">${icon('pencil')}${icon('trash')}</span></div>
        <div class="ins">${q.ins}</div><div class="en">${esc(q.en)}</div>
        <div class="opts">${q.opts.map((o, i) => `<span class="${i === q.ok || q.ok === -1 ? 'ok' : ''}">${esc(o)}</span>`).join('')}</div>
        <div class="exp">Explanation (shown to the student): ${esc(q.exp)}</div></div>`);
      await run.wait(380);
    }
    await run.wait(900);
    // Save and send to students.
    await cursor.tap($('[data-save]'));
    const modal = $('[data-modalbody]');
    const students = [['L', 'Lucas Martins', 'B1'], ['J', 'Julia Souza', 'B1'], ['P', 'Pedro Alves', 'A2'], ['C', 'Carla Dias', 'B2']];
    modal.innerHTML = `<h2>Send activity</h2><div class="sub">Weekend in Rio — Past simple · 10 questions</div>
      <div class="seg"><span class="on">Send to students</span><span>Open link</span></div>
      <div class="search">${icon('search')}Search student...</div>
      ${students.map(([i, n, l]) => `<div class="student" data-st="${n}"><span class="ini">${i}</span>${n}<small> · ${l}</small><span class="ck">${icon('check')}</span></div>`).join('')}
      <div class="due">Due date (optional)<div class="input" data-due>${icon('calendar')}<span class="ph">Pick a day</span></div></div>
      <span class="btn wide" data-send>${icon('send')}Choose students</span>`;
    $('[data-modal]').classList.add('on');
    await run.wait(700);
    let count = 0;
    for (const n of ['Lucas Martins', 'Julia Souza']) {
      const row = $(`[data-st="${n}"]`);
      await cursor.tap(row, 0.3, 0.5);
      row.classList.add('sel');
      count++;
      $('[data-send]').innerHTML = `${icon('send')}Send to ${count} student${count > 1 ? 's' : ''}`;
    }
    await cursor.tap($('[data-due]'), 0.4, 0.5);
    $('[data-due]').innerHTML = `${icon('calendar')}Friday, October 3`;
    await run.wait(300);
    await cursor.tap($('[data-send]'));
    modal.innerHTML = `<div class="success fade-in"><span>${icon('check')}</span>Sent! Each student gets their own link.</div>
      ${[['Lucas Martins', 'vocabnode.app/t/7qk2m9'], ['Julia Souza', 'vocabnode.app/t/x4p8d1']].map(([n, l]) => `<div class="sent-row fade-in">${n}<span class="lnk">${l}</span><span class="cp">${icon('copy')}</span><span class="wa">${icon('whatsapp')}WhatsApp</span></div>`).join('')}
      <div class="sub fade-in" style="margin:14px 0 18px">“Hi Lucas! Your homework is ready: Weekend in Rio — Past simple. Just open the link: …”</div>
      <span class="btn wide fade-in">Done</span>`;
    await cursor.move([1560, 980]);
    await run.wait(3200);
  },

  async task(run, root) {
    const $ = (s) => root.querySelector(s);
    const pane = (name) => $(`[data-p="${name}"]`);
    const go = (from, to) => { pane(from).classList.add('prev'); pane(to).classList.remove('next'); };
    const cursor = makeCursor(run, { touch: true, from: [1300, 1200] });
    await run.wait(900);
    await cursor.tap($('[data-start]'));
    go('intro', 'q8');
    await run.wait(900);
    // Q8: multiple choice.
    const q8 = pane('q8');
    const went = q8.querySelector('[data-opt="went"]');
    await cursor.tap(went);
    went.classList.add('right');
    went.querySelector('.lab').textContent = 'CORRECT';
    q8.querySelector('[data-blank]').textContent = 'went';
    q8.querySelector('[data-streak]').lastElementChild.textContent = '4';
    await run.wait(300);
    q8.querySelector('[data-sheet]').classList.add('on');
    await run.wait(1300);
    await cursor.tap(q8.querySelector('[data-next]'));
    go('q8', 'q9');
    await run.wait(800);
    // Q9: match columns, one wrong pair.
    const q9 = pane('q9');
    const hint = q9.querySelector('[data-hint]');
    let n = 0;
    const pair = async (l, r, ok) => {
      const L = q9.querySelector(`[data-l="${l}"]`), R = q9.querySelector(`[data-r="${r}"]`);
      await cursor.tap(L);
      L.classList.add('pick');
      hint.textContent = 'Now tap its pair on the other side.';
      await cursor.tap(R);
      L.classList.remove('pick');
      if (ok) {
        n++;
        for (const el of [L, R]) { el.classList.add('ok'); el.insertAdjacentHTML('beforeend', `<span class="b">${n}</span>`); }
        hint.textContent = n < 4 ? `Nice! ${4 - n} to go.` : 'All pairs matched.';
      } else {
        L.classList.add('bad'); R.classList.add('bad');
        await run.wait(450);
        L.classList.remove('bad'); R.classList.remove('bad');
        hint.textContent = 'Not that one — try again.';
      }
      await run.wait(250);
    };
    await pair('buy', 'bought', true);
    await pair('see', 'ate', false);
    await pair('see', 'saw', true);
    await pair('eat', 'ate', true);
    await pair('take', 'took', true);
    q9.querySelector('[data-streak]').classList.remove('hot');
    q9.querySelector('[data-streak]').lastElementChild.textContent = '0';
    q9.querySelector('[data-sheet]').classList.add('on');
    await run.wait(1500);
    await cursor.tap(q9.querySelector('[data-next]'));
    go('q9', 'q10');
    await run.wait(800);
    // Q10: order the words.
    const q10 = pane('q10');
    const lined = q10.querySelector('[data-lined]');
    lined.innerHTML = '';
    for (const w of ['They', 'saw', 'an', 'amazing', 'sunset']) {
      const tileEl = q10.querySelector(`[data-w="${w}"]`);
      await cursor.tap(tileEl);
      tileEl.classList.add('used');
      lined.insertAdjacentHTML('beforeend', `<span class="word fade-in">${w}</span>`);
    }
    await cursor.tap(q10.querySelector('[data-check]'));
    q10.querySelector('[data-streak]').classList.add('hot');
    q10.querySelector('[data-streak]').lastElementChild.textContent = '1';
    q10.querySelector('[data-sheet]').classList.add('on');
    await run.wait(1300);
    await cursor.tap(q10.querySelector('[data-next]'));
    go('q10', 'result');
    await cursor.move([1300, 1200]);
    await run.wait(3600);
  },
};

const MARKUP = { call: callMarkup, lesson: lessonMarkup, task: taskMarkup };
const ORDER = ['call', 'lesson', 'task'];

/* ───────── Player ───────── */
let current = null;
let playAll = false;

function setPressed(name) {
  document.querySelectorAll('[data-scene]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.scene === name)));
  document.getElementById('play-all').setAttribute('aria-pressed', String(playAll));
}

async function play(name) {
  current?.abort();
  const run = new Run();
  run.scene = name;
  current = run;
  stage.innerHTML = MARKUP[name]();
  setPressed(name);
  fit();
  try {
    await FLOWS[name](run, stage);
    await run.wait(600);
    const next = playAll ? ORDER[(ORDER.indexOf(name) + 1) % ORDER.length] : name;
    if (current === run) { location.hash = next; if (next === name) play(name); }
  } catch (e) {
    if (e.name !== 'AbortError') throw e;
  }
}

function sceneFromHash() {
  const h = location.hash.slice(1);
  return ORDER.includes(h) ? h : 'call';
}

document.querySelectorAll('[data-scene]').forEach((b) => b.addEventListener('click', () => { playAll = false; location.hash = b.dataset.scene; play(b.dataset.scene); }));
document.getElementById('play-all').addEventListener('click', () => { playAll = true; location.hash = 'call'; play('call'); });
document.getElementById('replay').addEventListener('click', () => play(sceneFromHash()));
document.getElementById('speed').addEventListener('change', (e) => { speed = Number(e.target.value); });
addEventListener('keydown', (e) => { if (e.key === 'r') play(sceneFromHash()); });
addEventListener('hashchange', () => { if (sceneFromHash() !== current?.scene) play(sceneFromHash()); });

fit();
play(sceneFromHash());
