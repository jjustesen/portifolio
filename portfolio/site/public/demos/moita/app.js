// Moita product recreation (English) with scripted demos.
// Scenes: #record (a recording ends, the AI pipeline runs), #speakers (naming a speaker), #tasks (checking tasks).
// ?clean hides the controls (used when embedded, and for recording).

const stage = document.getElementById('stage');
if (new URLSearchParams(location.search).has('clean')) document.body.classList.add('clean');

/* ───────── Icons (Lucide paths) ───────── */
const P = (d) => `<path d="${d}"/>`;
const ICONS = {
  mic: P('M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3'),
  tasks: '<rect x="8" y="2" width="8" height="4" rx="1"/>' + P('M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 14l2 2 4-4'),
  chat: P('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'),
  users: P('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8') + '<circle cx="9" cy="7" r="4"/>',
  settings: '<circle cx="12" cy="12" r="3"/>' + P('M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1'),
  logout: P('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9'),
  sparkles: P('M9.9 15.5A2 2 0 0 0 8.5 14.1L2.4 12.5a.5.5 0 0 1 0-1L8.5 9.9A2 2 0 0 0 9.9 8.5l1.6-6.1a.5.5 0 0 1 1 0l1.6 6.1a2 2 0 0 0 1.4 1.4l6.1 1.6a.5.5 0 0 1 0 1l-6.1 1.6a2 2 0 0 0-1.4 1.4l-1.6 6.1a.5.5 0 0 1-1 0zM20 3v4M22 5h-4'),
  check: P('M20 6 9 17l-5-5'),
  pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  square: '<rect x="5" y="5" width="14" height="14" rx="2"/>',
  play: P('M7 4l13 8-13 8z'),
  bulb: P('M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4'),
  align: P('M21 6H3M15 12H3M17 18H3'),
  checkSq: '<rect x="3" y="3" width="18" height="18" rx="2"/>' + P('m9 12 2 2 4-4'),
  book: P('M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z'),
  search: '<circle cx="11" cy="11" r="8"/>' + P('m21 21-4.3-4.3'),
  plus: P('M12 5v14M5 12h14'),
  finger: P('M12 10a2 2 0 0 0-2 2c0 1 0 3.3-1 5M14 13.1c0 2.4 0 6.4-2 8.9M17.3 21.1c.1-.6.4-2.3.5-3.1M2 12a10 10 0 0 1 18-6M2 16h.01M21.8 16c.2-2 .1-5.4 0-6M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .3-2M8.7 22c.2-.7.4-1.3.6-2M9 6.8a6 6 0 0 1 9 5.2v2'),
  user: '<circle cx="12" cy="8" r="4"/>' + P('M4 21a8 8 0 0 1 16 0'),
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/>' + P('M16 2v4M8 2v4M3 10h18'),
  folder: P('M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z'),
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
  list: P('M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'),
  chevDown: P('m6 9 6 6 6-6'),
  wave: P('M2 10v3M6 6v11M10 3v18M14 8v7M18 5v13M22 10v3'),
};
const icon = (name, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24">${ICONS[name]}</svg>`;

function sidebar(active) {
  const nav = [['mic', 'Meetings'], ['tasks', 'Tasks'], ['chat', 'Chat'], ['users', 'Speakers']];
  return `<aside class="sidebar">
    <div class="logo"><img src="logo.png" alt="">Moita</div>
    <div class="side-label">MENU</div>
    ${nav.map(([i, t]) => `<div class="nav${t === active ? ' on' : ''}" data-nav="${t}">${icon(i)}${t}</div>`).join('')}
    <div class="side-gap"></div>
    <div class="side-label">OTHER</div>
    <div class="nav">${icon('settings')}Settings</div>
    <div class="nav out">${icon('logout')}Sign out</div>
    <div class="me"><span>J</span>johannes@moita.app</div>
  </aside>`;
}

const AURORA = ['#a78bfa', '#60a5fa', '#34d399'];
const auroraBg = () => `background:#f5f3ff;background-image:radial-gradient(60% 120% at 10% 10%, ${AURORA[0]}66, transparent 70%),radial-gradient(60% 120% at 60% 0%, ${AURORA[1]}55, transparent 70%),radial-gradient(70% 140% at 100% 100%, ${AURORA[2]}55, transparent 70%)`;
const TAG_COLORS = [['#7c3aed', '#ede9fe'], ['#0284c7', '#e0f2fe'], ['#059669', '#d1fae5']];
const tag = (t, i) => `<span class="tagchip fade-in" style="color:${TAG_COLORS[i % 3][0]};background:${TAG_COLORS[i % 3][1]}">${t}</span>`;

function sessionCard(title, meta, badge, uuid = false) {
  return `<div class="s-card"><span class="ic">${icon('wave')}</span><div><b class="${uuid ? 'uuid' : ''}">${title}</b><small>${meta}</small></div>${badge}</div>`;
}
const TRANSCRIBED = `<span class="badge b-em">Transcribed</span>`;

const TASKS = [
  { t: 'Deliver the design system', who: 'Speaker 2', to: 'Carla Mendes', due: 'Sep 30', p: 'high' },
  { t: 'Share the pricing notes with Carla', who: 'Johannes', due: 'Today', p: 'med' },
  { t: 'Lock the MVP scope', who: 'Johannes', due: 'Friday', p: 'high', done: true },
  { t: 'Own the onboarding flow', who: 'Ana Ribeiro', due: 'Oct 7', p: 'med' },
];
const PRI = { high: ['p-high', 'HIGH'], med: ['p-med', 'MEDIUM'], low: ['p-low', 'LOW'] };
function taskCard(t, i) {
  const [cls, label] = PRI[t.p];
  return `<div class="task${t.done ? ' done' : ''}" data-task="${i}"><span class="cb">${icon('check')}</span><div><div class="tx">${t.t}</div><div class="mt"><span class="who">${icon('user')}<span>${t.who}</span></span><span>${icon('calendar')}${t.due}</span></div></div><span class="pri ${cls}">${label}</span></div>`;
}

const SUMMARY = 'The team locked the MVP scope for Friday and split the next steps: Carla delivers the design system by the 30th, Ana owns onboarding, and pricing notes go out after the call.';

function detailMarkup({ processing }) {
  return `
    <div class="detail-top"><h1 class="${processing ? 'uuid' : ''}" data-title>${processing ? '6f2c9a1e-4b7d-4e2a' : 'Q3 roadmap sync with Acme'}</h1><span data-status></span></div>
    <div class="meta" data-meta>${processing ? 'Processing…' : 'October 2, 2025 · 24min 17s'}</div>
    <div class="tags" data-tags>${processing ? '' : ['Roadmap', 'Acme', 'Pricing'].map(tag).join('') + '<span class="tagchip add">+ Tag</span>'}</div>
    ${processing ? `<div class="proc" data-proc><h3>${icon('sparkles')}Processing recording</h3>
      ${[['Combine audio', 'Joining the audio chunks into a single file'], ['Transcribe', 'Turning the audio into text with speech-to-text'], ['Separate speakers', 'Detecting who spoke and when (diarization)'], ['Identify participants', 'Recognising and naming known speakers'], ['AI analysis', 'Generating summary, tasks, chapters and tags']].map(([b, s]) => `<div class="step" data-step><span class="d"></span><div><b>${b}</b><small>${s}</small></div></div>`).join('')}
    </div>` : ''}
    <div data-done class="${processing ? 'hidden' : ''}">
      <div class="player"><span class="pl">${icon('play')}</span><div class="track"><div></div></div><span>00:00 / 24:17</span></div>
      <div class="aurora" style="${auroraBg()}"><div class="lab">${icon('bulb')}AI SUMMARY</div><p data-summary>${processing ? '' : SUMMARY}</p></div>
      <div class="tabs"><span class="on" data-tab="transcript">${icon('align')}Transcript</span><span data-tab="tasks">${icon('checkSq')}Tasks<em>4</em></span><span data-tab="chapters">${icon('book')}Chapters<em>3</em></span><span data-tab="chat">${icon('chat')}Chat</span></div>
      <div class="tabpane" data-pane="transcript">
        ${[['Me', 0, 'Let’s lock the MVP scope before Friday.'], ['Speaker 2', 1, 'Agreed. I can deliver the design system by the 30th.'], ['Ana Ribeiro', 2, 'Then I’ll own the onboarding flow.'], ['Speaker 2', 1, 'Send me the pricing notes and I’ll update the deck.'], ['Me', 0, 'Perfect, I’ll share them right after the call.']].map(([s, c, t]) => `<div class="line"><span class="spk c${c}" data-spk="${s}" title="Click to identify">${s}</span><span>${t}</span></div>`).join('')}
      </div>
      <div class="tabpane hidden" data-pane="tasks">${TASKS.map(taskCard).join('')}</div>
    </div>`;
}

/* ───────── Scene markup ───────── */
function recordMarkup() {
  return `${sidebar('Meetings')}
  <div class="page" data-pg="list"><div class="col">
    <h1 class="title">Meetings</h1><p class="sub">Your recordings, synced to the cloud.</p>
    <div class="date-head">Today</div>
    <div data-today>${sessionCard('Weekly design review', '10:30 · 32 min', TRANSCRIBED)}${sessionCard('Pricing call with Northwind', '09:00 · 18 min', TRANSCRIBED)}</div>
    <div class="date-head">Yesterday</div>
    ${sessionCard('1:1 with Bruno', '16:00 · 27 min', TRANSCRIBED)}
  </div></div>
  <div class="page off" data-pg="detail"><div class="col">${detailMarkup({ processing: true })}</div></div>
  <div class="rec" data-rec>
    <div class="row"><span class="dot"></span><span class="timer" data-timer>24:12</span><span class="chunks" data-chunks>12 chunks</span><span style="margin-left:auto"></span><span class="rbtn">${icon('pause')}Pause</span><span class="rbtn stop" data-stop>${icon('square')}Stop</span></div>
    <div class="live"><div class="lab">LIVE PREVIEW</div><div class="wave" data-wave>${'<i></i>'.repeat(24)}</div><p>Listening… the full transcript will be generated when you finish.</p></div>
  </div>
  <div class="newrec"><i></i>New recording</div>`;
}

function speakersMarkup() {
  return `${sidebar('Meetings')}
  <div class="page"><div class="col" style="padding-top:48px">${detailMarkup({ processing: false })}</div></div>
  <div class="pop" data-pop></div>
  <div class="modal-back" data-modal><div class="modal">
    <div class="fp">${icon('finger')}</div>
    <h2>Voice identification</h2><div class="req">Requires your consent</div>
    <p>Naming a speaker creates a <b>voice profile</b>, so Moita can recognise this person automatically in future meetings. A voice profile is <b>biometric data</b> under LGPD and GDPR.</p>
    <ul><li>Only a numeric voiceprint is stored, never extra audio.</li><li>It is used only to identify speakers in your meetings.</li><li>You can delete any profile at any time.</li><li>Withdrawing consent stops new profiles from being created.</li></ul>
    <div class="btns"><span>I don’t agree</span><span class="yes" data-agree>I agree</span></div>
  </div></div>`;
}

const FOLDER_COLORS = [['#FFF8ED', '#F5DEB3', '#FFE8C0'], ['#EFF6FF', '#BFDBFE', '#DBEAFE'], ['#F5F3FF', '#DDD6FE', '#EDE9FE'], ['#ECFDF5', '#A7F3D0', '#D1FAE5']];
function folder(i, title, when, total, high, done, tasks = '') {
  const [bg, border, tab] = FOLDER_COLORS[i];
  return `<div class="folder" data-folder="${i}" style="background:${bg};border-color:${border}">
    <span class="ftab" style="background:${tab};border-color:${border}">${icon('folder')}${total}</span>
    <div class="fhead"><div><b>${title}</b><small>${when}</small>${high ? `<span class="hi">${high} high</span>` : ''}</div><span class="open-m">${icon('chevDown')}</span></div>
    <div class="prog"><div><i data-bar style="width:${(done / total) * 100}%"></i></div><span data-count>${done}/${total}</span></div>
    <div class="ftasks">${tasks}</div>
  </div>`;
}

function tasksMarkup() {
  const mine = TASKS.map((t) => (t.to ? { ...t, who: t.to } : t));
  return `${sidebar('Tasks')}
  <div class="page"><div class="col">
    <h1 class="title">Tasks</h1><p class="sub">Every task identified in your meetings.</p>
    <div class="stats">11 tasks · <b class="h">4 high</b> · <b class="m">5 medium</b></div>
    <div class="toolbar">
      <div class="segm" data-seg><span class="on" data-f="all">All</span><span data-f="high">High</span><span data-f="med">Medium</span><span data-f="low">Low</span></div>
      <span class="tog">${icon('check')}Completed</span>
      <div class="segm right"><span class="on">${icon('grid')}</span><span>${icon('list')}</span></div>
    </div>
    <div class="folders">
      ${folder(0, 'Q3 roadmap sync with Acme', 'today', 4, 2, 1, mine.map(taskCard).join(''))}
      ${folder(1, 'Weekly design review', 'today', 3, 1, 2)}
      ${folder(2, 'Pricing call with Northwind', 'today', 2, 1, 0)}
      ${folder(3, '1:1 with Bruno', 'yesterday', 2, 0, 1)}
    </div>
  </div></div>`;
}

/* ───────── Timeline helpers ───────── */
let speed = 1;
class Run {
  constructor() { this.ctrl = new AbortController(); this.timers = []; }
  get signal() { return this.ctrl.signal; }
  abort() { this.ctrl.abort(); this.timers.forEach(clearInterval); }
  every(ms, fn) { const t = setInterval(fn, ms / speed); this.timers.push(t); return t; }
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

function makeCursor(run) {
  const el = document.createElement('div');
  el.className = 'cursor';
  el.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 2.5 19.5 13l-7 1.2-3.9 6.3z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  stage.appendChild(el);
  let x = 1500, y = 1150;
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
      r.style.left = `${x + 4}px`;
      r.style.top = `${y + 3}px`;
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

async function typeInto(run, el, text, { min = 30, max = 70 } = {}) {
  el.innerHTML = '<span data-val></span><span class="caret"></span>';
  const val = el.querySelector('[data-val]');
  for (const ch of text) { val.textContent += ch; await run.wait(min + Math.random() * (max - min)); }
  el.querySelector('.caret').remove();
}

async function stream(run, el, text, perWord = 45) {
  el.textContent = '';
  for (const word of text.split(' ')) { el.textContent += (el.textContent ? ' ' : '') + word; await run.wait(perWord + Math.random() * 35); }
}

const STATUS = [['b-blue', 'Combining audio'], ['b-yellow', 'Transcribing'], ['b-teal', 'Separating speakers'], ['b-sky', 'Identifying participants'], ['b-purple', 'Analyzing with AI']];

/* ───────── Scene flows ───────── */
const FLOWS = {
  async record(run, root) {
    const $ = (s) => root.querySelector(s);
    const cursor = makeCursor(run);
    // Live recording: timer and waveform keep moving.
    let secs = 24 * 60 + 12;
    run.every(1000, () => { secs++; $('[data-timer]').textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`; });
    const bars = [...root.querySelectorAll('[data-wave] i')];
    run.every(160, () => bars.forEach((b) => { b.style.height = `${15 + Math.random() * 85}%`; }));
    await run.wait(1800);
    const stop = $('[data-stop]');
    await cursor.tap(stop);
    run.timers.forEach(clearInterval);
    const rec = $('[data-rec]');
    rec.style.opacity = '0';
    rec.style.transform = 'translateY(20px) scale(0.96)';
    await run.wait(350);
    $('.newrec').classList.add('on');
    // The new session appears and starts processing.
    $('[data-today]').insertAdjacentHTML('afterbegin', `<div class="fade-in" data-new>${sessionCard('6f2c9a1e-4b7d-4e2a', '11:48 · 24 min', `<span class="badge b-yellow"><span class="spin"></span>Transcribing...</span>`, true)}</div>`);
    await run.wait(900);
    const card = $('[data-new] .s-card');
    await cursor.move(card, 0.3, 0.5);
    card.classList.add('hl');
    await cursor.click();
    root.querySelector('[data-pg="list"]').classList.add('off');
    root.querySelector('[data-pg="detail"]').classList.remove('off');
    $('.newrec').classList.remove('on');
    await cursor.move([1560, 980]);
    // The pipeline, step by step.
    const steps = [...root.querySelectorAll('[data-step]')];
    const status = $('[data-status]');
    const durations = [900, 1500, 1300, 1100, 1700];
    for (let i = 0; i < steps.length; i++) {
      steps[i].classList.add('active');
      steps[i].querySelector('.d').innerHTML = '<span class="spin"></span>';
      status.innerHTML = `<span class="badge ${STATUS[i][0]}"><span class="spin"></span>${STATUS[i][1]}</span>`;
      await run.wait(durations[i]);
      steps[i].classList.remove('active');
      steps[i].classList.add('done');
      steps[i].querySelector('.d').innerHTML = icon('check');
    }
    status.innerHTML = `<span class="badge b-em">${icon('check')}Done</span>`;
    await run.wait(500);
    // Generations land: title, tags, summary, tasks.
    $('[data-proc]').style.display = 'none';
    const title = $('[data-title]');
    title.classList.remove('uuid');
    await typeInto(run, title, 'Q3 roadmap sync with Acme', { min: 25, max: 50 });
    $('[data-meta]').textContent = 'October 2, 2025 · 24min 17s';
    const tags = $('[data-tags]');
    for (const [i, t] of ['Roadmap', 'Acme', 'Pricing'].entries()) { tags.insertAdjacentHTML('beforeend', tag(t, i)); await run.wait(180); }
    $('[data-done]').classList.remove('hidden');
    await stream(run, $('[data-summary]'), SUMMARY);
    await run.wait(500);
    const tasksTab = $('[data-tab="tasks"]');
    await cursor.tap(tasksTab);
    $('[data-tab="transcript"]').classList.remove('on');
    tasksTab.classList.add('on');
    $('[data-pane="transcript"]').classList.add('hidden');
    const pane = $('[data-pane="tasks"]');
    pane.classList.remove('hidden');
    pane.querySelectorAll('.task').forEach((t, i) => { t.classList.add('fade-in'); t.style.animationDelay = `${i * 120}ms`; });
    await cursor.move([1560, 1000]);
    await run.wait(3000);
  },

  async speakers(run, root) {
    const $ = (s) => root.querySelector(s);
    const cursor = makeCursor(run);
    await run.wait(900);
    // Open the speaker picker on "Speaker 2".
    const pill = $('[data-spk="Speaker 2"]');
    await cursor.tap(pill);
    const [px, py] = pointOf(pill, 0, 1);
    const pop = $('[data-pop]');
    pop.style.left = `${px}px`;
    pop.style.top = `${py + 10}px`;
    const people = [['A', 'Ana Ribeiro', 'c2'], ['B', 'Bruno Costa', 'c3'], ['J', 'Johannes', 'c0']];
    pop.innerHTML = `<header>Speakers<em>3</em></header>
      <div class="search">${icon('search')}Search speaker...</div>
      ${people.map(([i, n, c]) => `<div class="opt"><span class="ini ${c}">${i}</span>${n}${n === 'Johannes' ? '<span class="me-b">ME</span>' : ''}</div>`).join('')}
      <footer data-foot><div class="newp" data-newp><span class="dash">${icon('plus')}</span>New profile</div></footer>`;
    pop.classList.add('on');
    await run.wait(900);
    // Create a new profile.
    await cursor.tap($('[data-newp]'));
    $('[data-foot]').innerHTML = `<div class="name-in"><div data-name><span class="ph">Speaker name</span></div><span data-ok>${icon('check')}</span></div>`;
    await run.wait(300);
    await typeInto(run, $('[data-name]'), 'Carla Mendes');
    await cursor.tap($('[data-ok]'));
    pop.classList.remove('on');
    // Biometric consent, then the name spreads through the transcript.
    $('[data-modal]').classList.add('on');
    await run.wait(1600);
    const agree = $('[data-agree]');
    await cursor.tap(agree);
    agree.textContent = 'Saving…';
    await run.wait(700);
    $('[data-modal]').classList.remove('on');
    await run.wait(300);
    for (const s of root.querySelectorAll('[data-spk="Speaker 2"]')) {
      s.textContent = 'Carla Mendes';
      s.className = 'spk c4 flash';
      await run.wait(220);
      s.classList.remove('flash');
    }
    await run.wait(900);
    // Her tasks now carry her name.
    const tasksTab = $('[data-tab="tasks"]');
    await cursor.tap(tasksTab);
    $('[data-tab="transcript"]').classList.remove('on');
    tasksTab.classList.add('on');
    $('[data-pane="transcript"]').classList.add('hidden');
    $('[data-pane="tasks"]').classList.remove('hidden');
    await run.wait(600);
    const who = $('[data-task="0"] .who');
    who.querySelector('span').textContent = 'Carla Mendes';
    who.classList.add('new');
    await cursor.move(who, 0.5, 0.5);
    await run.wait(3000);
  },

  async tasks(run, root) {
    const $ = (s) => root.querySelector(s);
    const cursor = makeCursor(run);
    await run.wait(900);
    // Open the meeting folder.
    const f0 = $('[data-folder="0"]');
    await cursor.tap(f0, 0.4, 0.3);
    f0.classList.add('open');
    f0.querySelectorAll('.task').forEach((t, i) => { t.classList.add('fade-in'); t.style.animationDelay = `${i * 100}ms`; });
    await run.wait(1100);
    // Tick a task off.
    const t1 = f0.querySelector('[data-task="1"]');
    await cursor.tap(t1.querySelector('.cb'));
    t1.classList.add('done');
    f0.querySelector('[data-bar]').style.width = '50%';
    f0.querySelector('[data-count]').textContent = '2/4';
    await run.wait(1100);
    // Filter by high priority.
    const high = $('[data-f="high"]');
    await cursor.tap(high);
    root.querySelectorAll('[data-f]').forEach((s) => s.classList.toggle('on', s === high));
    f0.querySelectorAll('.task').forEach((t) => { if (!t.querySelector('.p-high')) t.style.display = 'none'; });
    root.querySelectorAll('[data-folder="3"]').forEach((f) => { f.style.display = 'none'; });
    await cursor.move([1560, 1000]);
    await run.wait(3200);
  },
};

const MARKUP = { record: recordMarkup, speakers: speakersMarkup, tasks: tasksMarkup };
const ORDER = ['record', 'speakers', 'tasks'];

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
  return ORDER.includes(h) ? h : 'record';
}

document.querySelectorAll('[data-scene]').forEach((b) => b.addEventListener('click', () => { playAll = false; location.hash = b.dataset.scene; play(b.dataset.scene); }));
document.getElementById('play-all').addEventListener('click', () => { playAll = true; location.hash = 'record'; play('record'); });
document.getElementById('replay').addEventListener('click', () => play(sceneFromHash()));
document.getElementById('speed').addEventListener('change', (e) => { speed = Number(e.target.value); });
addEventListener('keydown', (e) => { if (e.key === 'r') play(sceneFromHash()); });
addEventListener('hashchange', () => { if (sceneFromHash() !== current?.scene) play(sceneFromHash()); });

fit();
play(sceneFromHash());
