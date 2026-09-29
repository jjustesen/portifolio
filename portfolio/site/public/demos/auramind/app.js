// Auramind product recreation (English) with scripted demos.
// Scenes: #chat, #editor, #gallery · ?clean hides the controls for recording.

const stage = document.getElementById('stage');
const params = new URLSearchParams(location.search);
if (params.has('clean')) document.body.classList.add('clean');

/* ───────── Icons (lucide-style strokes) ───────── */
const P = (d) => `<path d="${d}"/>`;
const ICONS = {
  menu: P('M4 6h16M4 12h16M4 18h16'),
  moon: P('M20.5 13A8.5 8.5 0 1 1 11 3.5a6.5 6.5 0 0 0 9.5 9.5z'),
  plus: P('M12 5v14M5 12h14'),
  chatPlus: P('M7.9 20A9 9 0 1 0 4 16.1L2 22z') + P('M8 12h8M12 8v8'),
  bot: '<rect x="4" y="8" width="16" height="12" rx="2"/>' + P('M12 8V4H8M2 14h2M20 14h2M9 13v2M15 13v2'),
  chart: '<rect x="3" y="3" width="18" height="18" rx="2"/>' + P('M8 16v-4M12 16V8M16 16v-6'),
  user: '<circle cx="12" cy="8" r="4"/>' + P('M4 21a8 8 0 0 1 16 0'),
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/>' + P('M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20'),
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/>' + P('M4 5v14a8 3 0 0 0 16 0V5M4 12a8 3 0 0 0 16 0'),
  clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/>' + P('M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M12 11h4M12 16h4M8 11h.01M8 16h.01'),
  pkg: P('M16.5 9.4 7.5 4.2M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7zM3.3 7 12 12l8.7-5M12 22V12'),
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/>' + P('M21 15l-5-5L5 21'),
  shield: P('M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1zM9 12l2 2 4-4'),
  brain: P('M12 5a3 3 0 1 0-5.9.8A4 4 0 0 0 4 12a4 4 0 0 0 2 6.9A3 3 0 0 0 12 19zM12 5a3 3 0 1 1 5.9.8A4 4 0 0 1 20 12a4 4 0 0 1-2 6.9A3 3 0 0 1 12 19zM12 5v14'),
  eye: P('M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z') + '<circle cx="12" cy="12" r="3"/>',
  code: P('M16 18l6-6-6-6M8 6l-6 6 6 6'),
  codeFile: P('M10 9l-3 3 3 3M14 15l3-3-3-3M13.5 6l-3 12'),
  palette: '<circle cx="12" cy="12" r="9"/><circle cx="8" cy="10" r="1.1"/><circle cx="12" cy="7.5" r="1.1"/><circle cx="16" cy="10" r="1.1"/>' + P('M12 21a3 3 0 0 1 0-6h2'),
  maximize: P('M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7'),
  device: P('M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8M10 19v-3.9M7 19h5') + '<rect x="16" y="12" width="6" height="10" rx="2"/>',
  rocket: P('M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1zM12 15l-3-3a22 22 0 0 1 2-4A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2zM9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5'),
  clock: '<circle cx="12" cy="12" r="9"/>' + P('M12 7v5l3 2'),
  rotate: P('M3 12a9 9 0 1 0 9-9 9.8 9.8 0 0 0-6.7 2.7L3 8M3 3v5h5'),
  panel: '<rect x="3" y="3" width="18" height="18" rx="2"/>' + P('M15 3v18'),
  userPlus: '<circle cx="9" cy="7" r="4"/>' + P('M3 21v-1a5 5 0 0 1 5-5h2M18 11v6M15 14h6'),
  arrowUR: P('M7 17 17 7M8 7h9v9'),
  wand: P('M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8 19 13M17.8 6.2 19 5M3 21l9-9M12.2 6.2 11 5'),
  check: P('M20 6 9 17l-5-5'),
  checkCircle: '<circle cx="12" cy="12" r="9"/>' + P('M8.5 12l2.5 2.5 4.5-5'),
  chevDown: P('m6 9 6 6 6-6'),
  chevLeft: P('m15 18-6-6 6-6'),
  globe: '<circle cx="12" cy="12" r="9"/>' + P('M12 3a13.5 13.5 0 0 0 0 18 13.5 13.5 0 0 0 0-18M3 12h18'),
  file: P('M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5'),
  trash: P('M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'),
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
  type: P('M4 7V4h16v3M9 20h6M12 4v16'),
  dots: '<circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="19" cy="12" r="1.2" fill="currentColor"/>',
  chats: P('M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2zM18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1'),
  spark: P('M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4'),
};
const icon = (name, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24">${ICONS[name]}</svg>`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ───────── Shared layout ───────── */
const SIDEBAR = `
<aside class="sidebar">
  <div class="logo"><b>auramind.ai</b><small>powered by <span>aws<svg viewBox="0 0 22 7"><path d="M1 1.5c6 4 14 4 19 0" fill="none" stroke="#ff9900" stroke-width="1.8" stroke-linecap="round"/><path d="M18 .8l2.4.6-.9 2.2" fill="none" stroke="#ff9900" stroke-width="1.5" stroke-linecap="round"/></svg></span></small></div>
  <div class="new-chat">${icon('chatPlus')}New chat</div>
  <div class="nav-item">${icon('bot')}Aura assistant</div>
  <div class="nav-item">${icon('chart')}Analytics</div>
  <div class="nav-item">${icon('user')}Users</div>
  <div class="nav-item">${icon('briefcase')}Departments</div>
  <div class="nav-item">${icon('database')}Knowledge base</div>
  <div class="nav-item">${icon('clipboard')}Shortcuts</div>
  <div class="nav-item new">${icon('pkg')}Aura Apps<span class="badge">New</span></div>
  <div class="nav-item new">${icon('image')}Images<span class="badge">New</span></div>
  <div class="nav-item new">${icon('shield')}Guardrails<span class="badge">New</span></div>
  <div class="nav-item beta">${icon('brain')}Memories<span class="badge">Beta</span></div>
  <div class="side-title">Conversations</div>
  <div class="side-search">Search...</div>
  <div class="side-day">Today</div>
  <div class="side-conv">What’s new today?</div>
  <div class="side-conv">Project plan for a small business</div>
  <div class="side-conv">Analyze the sales spreadsheet</div>
  <div class="side-user"><div class="avatar">PL</div><div><b>Patricia Lima</b><small>Manager</small></div><span class="more">${icon('dots')}</span></div>
</aside>`;

const CLAUDE = `<span class="claude"><svg viewBox="0 0 24 24">${ICONS.spark}</svg></span>`;
const AURA = `<span class="aura-dot"><span></span></span>`;

/* ───────── Thumbnails ───────── */
function snakeThumb() {
  return `<div class="snake" style="position:absolute;inset:0;background:#050505;background-image:linear-gradient(#1c1c1c 1px,transparent 1px),linear-gradient(90deg,#1c1c1c 1px,transparent 1px);background-size:22px 22px">
    <canvas data-snake width="250" height="196" style="position:absolute;inset:0;width:100%;height:100%"></canvas>
    <span style="position:absolute;left:10px;top:6px;font:700 17px var(--mono);color:#eee;letter-spacing:1px">SCORE 1250</span>
  </div>`;
}

const WAVE = (y, c, a) => `<path d="M0 ${y} C 30 ${y - a}, 55 ${y + a}, 85 ${y} S 140 ${y - a}, 170 ${y} S 220 ${y + a}, 250 ${y}" fill="none" stroke="${c}" stroke-width="2.2"/>`;
function powerBiThumb() {
  const pill = (t, on) => `<span style="padding:4px 12px;border-radius:999px;font-size:11.5px;${on ? 'background:#2563eb;color:#fff' : 'background:#e9eaee;color:#555'}">${t}</span>`;
  return `<div style="position:absolute;inset:0;background:#fff;color:#333;font-family:var(--font)">
    <div style="position:absolute;left:24px;top:24px;display:flex;gap:8px">${pill('All', 1)}${pill('Retail')}${pill('Health')}${pill('Goods')}</div>
    <div style="position:absolute;left:-40px;top:66px;width:150px;height:170px;border:1px solid #e3e3e3;border-radius:10px"><div style="position:absolute;left:44px;top:44px;font-size:11px;color:#888">nt and Month</div>
      <svg viewBox="0 0 150 80" style="position:absolute;left:0;bottom:0;width:150px;height:80px">${[46, 52, 58, 64, 70, 76].map((x, i) => `<rect x="${x}" y="${40 - i * 4}" width="2" height="${40 + i * 4}" fill="${['#3b82f6', '#ef4444', '#f59e0b', '#22c55e', '#a855f7', '#06b6d4'][i]}"/>`).join('')}</svg></div>
    <div style="position:absolute;left:126px;top:66px;width:170px;height:170px;border:1px solid #e3e3e3;border-radius:10px;padding:18px 16px;font-size:13px">Opportunity Count<div style="font-size:11px;color:#999;margin-top:6px">Sum of Opportunity</div></div>
    <svg viewBox="0 0 250 60" style="position:absolute;left:130px;top:150px;width:250px;height:60px">${WAVE(18, '#ef4444', 8)}${WAVE(26, '#f59e0b', 7)}${WAVE(34, '#3b82f6', 8)}${WAVE(42, '#a855f7', 6)}</svg>
  </div>`;
}

function legalThumb() {
  const bars = (cols, color) => cols.map((h, i) => `<rect x="${8 + i * 18}" y="${60 - h}" width="12" height="${h}" fill="${color}"/>`).join('');
  const card = (x, inner, title) => `<div style="position:absolute;left:${x}px;top:24px;width:76px;height:96px;background:#fff;border:1px solid #dde3ea;border-radius:3px;font-size:6px;color:#333;padding:4px">${title}<svg viewBox="0 0 70 64" style="width:68px;height:62px">${inner}</svg></div>`;
  return `<div style="position:absolute;inset:0;background:#eef1f5;font-family:var(--font)">
    <div style="height:18px;background:#fff;border-bottom:1px solid #dde3ea;font-size:6px;padding:5px 6px;color:#444">Legal Dashboard</div>
    ${card(4, bars([44, 30, 18], '#2f6fcf'), 'Active cases')}${card(84, bars([30, 50, 26], '#1f9d55'), 'Resolved')}
    ${card(164, '<path d="M2 58 L14 50 L26 54 L38 36 L50 42 L62 20 L68 26" fill="none" stroke="#5b8def" stroke-width="2"/><path d="M2 58 L14 50 L26 54 L38 36 L50 42 L62 20 L68 26 L68 64 L2 64z" fill="#5b8def33"/>', 'Deadlines')}
    <div style="position:absolute;left:4px;top:126px;width:76px;height:26px;background:#3c5a86;border-radius:2px;color:#fff;font-size:6px;padding:4px">Amount at stake<br><b style="font-size:8px">$ 45,000</b></div>
    <div style="position:absolute;left:84px;top:126px;width:76px;height:26px;background:#3c5a86;border-radius:2px;color:#fff;font-size:6px;padding:4px">Appeals<br><b style="font-size:8px">15</b></div>
    <div style="position:absolute;left:4px;top:158px;width:240px;height:40px;background:#fff;border:1px solid #dde3ea;border-radius:2px"></div>
  </div>`;
}

function homeThumb() {
  return `<div style="position:absolute;inset:0;background:#f2f2f6;font-family:var(--font)">
    <div style="position:absolute;left:0;top:0;bottom:0;width:18px;background:#7c3aed"></div>
    <div style="position:absolute;left:36px;top:22px;font-size:9px;color:#333">Hello, <b>John!</b></div>
    <div style="position:absolute;left:90px;top:48px;width:74px;height:74px;border-radius:50%;border:8px solid #e5dcff;display:grid;place-items:center"><div style="width:40px;height:40px;border-radius:50%;background:#7c3aed;color:#fff;font-size:9px;display:grid;place-items:center">25°C</div></div>
    <div style="position:absolute;left:190px;top:40px;width:52px;height:120px;background:#fff;border-radius:6px"></div>
    <div style="position:absolute;left:196px;top:100px;width:40px;height:16px;background:#7c3aed;border-radius:3px"></div>
  </div>`;
}

function crmThumb() {
  const row = (y) => `<div style="position:absolute;left:14px;top:${y}px;width:150px;height:8px;background:#eceff1;border-radius:2px"></div>`;
  return `<div style="position:absolute;inset:0;background:#fafbfa;font-family:var(--font)">
    <div style="position:absolute;left:0;right:0;top:0;height:16px;background:#fff;border-bottom:1px solid #e6e6e6"></div>
    <div style="position:absolute;left:14px;top:24px;font-size:8px;color:#333">Hello, Dr. Jones</div>
    ${[40, 56, 72].map(row).join('')}
    <div style="position:absolute;left:14px;top:96px;width:150px;height:60px;border:1px solid #e6e6e6;border-radius:4px;background:repeating-linear-gradient(90deg,transparent 0 10px,#cfe8d6 10px 16px)"></div>
    <div style="position:absolute;left:176px;top:30px;width:62px;height:140px;background:#fff;border:1px solid #e6e6e6;border-radius:4px"></div>
    <div style="position:absolute;left:176px;top:150px;width:62px;height:30px;background:#16a34a;border-radius:3px"></div>
  </div>`;
}

function analyticsThumb() {
  return `<div style="position:absolute;inset:0;background:#fff;font-family:var(--font)">
    <svg viewBox="0 0 120 60" style="position:absolute;left:10px;top:40px;width:120px;height:60px"><path d="M6 20 Q 20 8 34 18 T 60 16 Q 70 30 58 40 T 30 44 Q 12 40 6 20z" fill="#e5e7eb"/><path d="M68 14 Q 90 6 110 16 Q 116 34 96 40 Q 76 42 70 30z" fill="#e5e7eb"/><circle cx="30" cy="26" r="3" fill="#ef4444"/><circle cx="84" cy="22" r="3" fill="#3b82f6"/></svg>
    <div style="position:absolute;left:150px;top:44px;width:64px;height:64px;border-radius:50%;background:conic-gradient(#3b82f6 0 40%,#f59e0b 0 62%,#10b981 0 82%,#a855f7 0);display:grid;place-items:center"><div style="width:36px;height:36px;border-radius:50%;background:#fff"></div></div>
    <svg viewBox="0 0 230 60" style="position:absolute;left:10px;top:130px;width:230px;height:60px">${Array.from({ length: 12 }, (_, i) => `<rect x="${i * 19}" y="${20 + ((i * 13) % 30)}" width="10" height="${40 - ((i * 13) % 30)}" fill="#4f46e5"/>`).join('')}</svg>
  </div>`;
}

/* Animated snake for thumbnails (a scripted loop, not a game). */
function startSnakes(root) {
  const canvases = [...root.querySelectorAll('canvas[data-snake]')];
  if (!canvases.length) return () => {};
  const path = [];
  const cell = 11;
  // A lap around a rounded rectangle-ish route.
  for (let x = 2; x < 20; x++) path.push([x, 12]);
  for (let y = 12; y > 4; y--) path.push([19, y]);
  for (let x = 19; x > 13; x--) path.push([x, 4]);
  for (let y = 4; y < 9; y++) path.push([13, y]);
  for (let x = 13; x > 2; x--) path.push([x, 9]);
  for (let y = 9; y < 12; y++) path.push([2, y]);
  let raf = 0;
  const t0 = performance.now();
  const draw = (now) => {
    raf = requestAnimationFrame(draw);
    // The first frame's timestamp can precede t0, so keep the index non-negative.
    const head = Math.max(0, Math.floor((now - t0) / 110)) % path.length;
    for (const c of canvases) {
      const ctx = c.getContext('2d');
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = '#e11d48';
      const food = path[(head + 18) % path.length];
      ctx.fillRect(food[0] * cell + 2, food[1] * cell + 2, cell - 4, cell - 4);
      for (let k = 0; k < 16; k++) {
        const [x, y] = path[(head - k + path.length) % path.length];
        ctx.fillStyle = k === 0 ? '#86efac' : '#22c55e';
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }
  };
  raf = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(raf);
}

/* ───────── Code (Dashboard.tsx) ───────── */
const CODE_V1 = [
  "import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';",
  '',
  'const data = [',
  ...[['Jan', 45, 36, 39], ['Feb', 41, 50, 42], ['Mar', 55, 47, 44], ['Apr', 60, 52, 43], ['May', 64, 56, 47], ['Jun', 63, 54, 44], ['Jul', 68, 59, 50], ['Aug', 66, 57, 48], ['Sep', 71, 61, 52], ['Oct', 72, 62, 53], ['Nov', 74, 64, 56]].map(
    ([m, r, h, g]) => `  { month: '${m}', Retail: ${r}, Health: ${h}, Goods: ${g} },`,
  ),
  '];',
  '',
  'export default function Dashboard() {',
  '  return (',
  '    <div className="bg-[#191919] min-h-screen p-6">',
  '      <div className="max-w-7xl mx-auto">',
  '        {/* Header */}',
  '        <div className="mb-8">',
  '          <h1 className="text-white text-3xl mb-2">Analytics Dashboard</h1>',
  '          <p className="text-gray-400">Opportunity overview by sector</p>',
  '        </div>',
  '',
  '        {/* Filters */}',
  '        <div className="flex gap-2 mb-6">',
  '          <button className="bg-blue-600 text-white px-4 py-2 rounded-full">All</button>',
  '          <button className="bg-[#2a2a2a] text-gray-300 px-4 py-2 rounded-full">Retail</button>',
  '        </div>',
  '      </div>',
  '    </div>',
  '  );',
  '}',
];
// Version 2 inserts the monthly opportunity chart before the closing tags.
const V2_AT = CODE_V1.length - 4;
const CODE_V2_INSERT = [
  '',
  '        {/* Monthly opportunities */}',
  '        <ResponsiveContainer width="100%" height={320}>',
  '          <BarChart data={data}>',
  '            <CartesianGrid strokeDasharray="3 3" stroke="#333" />',
  '            <XAxis dataKey="month" stroke="#888" />',
  '            <Tooltip />',
  "            <Bar dataKey=\"Retail\" fill=\"#3b82f6\" radius={[4, 4, 0, 0]} />",
  "            <Bar dataKey=\"Health\" fill=\"#22c55e\" radius={[4, 4, 0, 0]} />",
  "            <Bar dataKey=\"Goods\" fill=\"#a855f7\" radius={[4, 4, 0, 0]} />",
  '          </BarChart>',
  '        </ResponsiveContainer>',
];
// Version 3 restyles the cards and the chart palette.
const CODE_V3_EDITS = {
  bars: ["            <Bar dataKey=\"Retail\" fill=\"#60a5fa\" radius={[6, 6, 0, 0]} />", "            <Bar dataKey=\"Health\" fill=\"#34d399\" radius={[6, 6, 0, 0]} />", "            <Bar dataKey=\"Goods\" fill=\"#f472b6\" radius={[6, 6, 0, 0]} />"],
  pill: '          <button className="bg-[#262626] border border-[#333] text-gray-300 px-4 py-2 rounded-full">Retail</button>',
};

const TOKEN = /(\{\/\*.*?\*\/\})|('[^']*'|"[^"]*")|(\b(?:import|from|const|export|default|function|return)\b)|(<\/?[A-Za-z][\w.]*)|(\b[a-zA-Z]+(?==))|(\b\d+\b)|(\b[A-Z]\w*(?=\())/g;
function highlight(line) {
  let out = '', last = 0;
  line.replace(TOKEN, (m, com, str, kw, tag, attr, num, fn, i) => {
    out += esc(line.slice(last, i));
    const cls = com ? 'c' : str ? 's' : kw ? 'k' : tag ? 't' : attr ? 'a' : num ? 'n' : 'f';
    out += `<span class="${cls}">${esc(m)}</span>`;
    last = i + m.length;
    return m;
  });
  return out + esc(line.slice(last));
}

/* ───────── Scenes (markup) ───────── */
function chatMarkup() {
  return `<div class="chat-scene">${SIDEBAR}
  <div class="main-panel">
    <div class="chat-top"><span class="icon-btn">${icon('menu')}</span><span class="model">${CLAUDE}Claude 3.7 Sonnet ${icon('chevDown')}</span><span class="chip-btn disabled" data-share>${icon('userPlus')}Share</span></div>
    <div class="chat-hello">How can I help you today?</div>
    <div class="thread" data-thread></div>
    <div class="composer" data-composer>
      <div class="field" data-field><span class="ph">Write your message here...</span></div>
      <div class="row">
        <span class="ghost" data-improve>${icon('wand')}Improve</span>
        <span class="primary">${icon('clipboard')}Shortcuts</span>
        <span class="square" data-plus>${icon('plus')}</span>
        <span class="send" data-send>${icon('arrowUR')}</span>
      </div>
    </div>
    <div class="disclaimer">Auramind can make mistakes. Consider checking important information.</div>
    <div class="tools" data-tools>
      <header>${icon('chevLeft')}Tools</header>
      <ul>
        <li>${icon('image')}Image generation<span class="check on">${icon('check')}</span></li>
        <li>${icon('codeFile')}Code interpreter<span class="check on">${icon('check')}</span></li>
        <li>${icon('file', 'file')}Canvas<span class="check" data-canvas>${icon('check')}</span></li>
        <li>${icon('globe')}Web search<span class="check on">${icon('check')}</span></li>
      </ul>
    </div>
  </div>
  <div class="rail-wrap"><div class="rail" data-rail><span class="icon-btn">${icon('panel')}</span><hr><span class="icon-btn">${icon('type')}</span><span class="icon-btn">${icon('code')}</span><span class="icon-btn">${icon('image')}</span></div></div>
</div>`;
}

function editorMarkup() {
  return `<div class="editor-scene">${SIDEBAR}
  <div class="top-icons">${icon('menu')}${icon('moon')}</div>
  <div class="editor-panel">
    <div class="toolbar">
      <span class="seg"><span data-tab-preview>${icon('eye')}Preview</span><span class="on" data-tab-code>${icon('code')}Code</span></span>
      <span class="tool box">${icon('palette')}</span>
      <span class="divider"></span>
      <span class="tool">${icon('maximize')}Full screen</span>
      <span class="tool" style="margin-left:auto">${icon('device')}Device</span>
      <span class="publish" style="margin-left:12px">${icon('rocket')}Publish</span>
    </div>
    <div class="doc">
      <div class="doc-tab">${icon('codeFile')}Dashboard.tsx</div>
      <div class="code" data-code></div>
      <div class="preview" data-preview>
        <h1>Analytics Dashboard</h1>
        <p>Opportunity overview by sector</p>
        <div class="pills"><span class="on">All</span><span>Retail</span><span>Health</span><span>Goods</span></div>
        <div class="kpis">
          <div class="kpi"><small>Retail · Nov</small><b>74</b><div class="bar" style="background:#60a5fa"></div></div>
          <div class="kpi"><small>Health · Nov</small><b>64</b><div class="bar" style="background:#34d399"></div></div>
          <div class="kpi"><small>Goods · Nov</small><b>56</b><div class="bar" style="background:#f472b6"></div></div>
        </div>
        <div class="chart">
          <header>Monthly opportunities<span class="legend"><span><i style="background:#60a5fa"></i>Retail</span><span><i style="background:#34d399"></i>Health</span><span><i style="background:#f472b6"></i>Goods</span></span></header>
          <div class="bars" data-bars></div>
          <div class="months">${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((m) => `<span>${m}</span>`).join('')}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="side-chat">
    <div class="side-head"><span class="app-glyph">${icon('grid')}</span><div><b>Power BI Dashboard</b><small>Doc</small></div><span class="panel-icon">${icon('panel')}</span></div>
    <div class="side-msgs" data-msgs></div>
    <div class="side-input"><span data-side-field>Write your message here...</span><span class="send" data-side-send>${icon('arrowUR')}</span></div>
  </div>
</div>`;
}

function galleryMarkup() {
  const card = (key, thumb, title, desc) => `<div class="card" data-card="${key}"><div class="th">${thumb}<span class="ago">2 hours ago</span></div><div class="meta"><b>${title}</b><p>${desc}</p></div></div>`;
  return `<div class="gallery-scene">${SIDEBAR}
  <div class="top-icons">${icon('menu')}${icon('moon')}</div>
  <div class="gallery-panel">
    <div class="g-col">
      <h1>Aura Apps</h1>
      <div class="sub">Manage apps created in Aura chat</div>
      <div class="g-search">Search...</div>
      <div class="g-filters">
        <div class="g-tabs" data-tabs><i class="pill" data-pill></i><span data-tab="private">Private</span><span data-tab="public">Public</span><span data-tab="department">Department</span></div>
        <div class="g-sort">Most recent ${icon('chevDown')}</div>
      </div>
      <div class="g-h2" data-h2>My apps</div>
      <div class="cards" data-mine>
        ${card('powerbi', powerBiThumb(), 'Power BI Dashboard', 'Company-wide sales dashboard')}
        ${card('snake', snakeThumb(), '2D Game', 'A seriously good snake game')}
        ${card('legal', legalThumb(), 'Legal Dashboard', 'Case and process overview')}
      </div>
      <div class="g-h2 second">Team apps</div>
      <div class="cards">
        ${card('home', homeThumb(), 'Smart Home', '')}
        ${card('crm', crmThumb(), 'Clinic CRM', '')}
        ${card('analytics', analyticsThumb(), 'Global Analytics', '')}
      </div>
    </div>
  </div>
  <div class="details">
    <div class="side-head"><span class="app-glyph">${icon('grid')}</span><div><b>Power BI Dashboard</b><small>July data</small></div></div>
    <div class="kv">
      <span>Status</span><strong class="ready" data-status>Ready ${icon('checkCircle')}</strong>
      <span>Privacy</span><strong>Department</strong>
      <span>Department</span><strong>Sales</strong>
    </div>
    <span class="share">${icon('userPlus')}Share</span>
    <h3>Source</h3>
    <div class="source"><span class="app-glyph">${icon('grid')}</span>Power BI Dashboard<span class="trash">${icon('trash')}</span></div>
    <h3 style="margin-top:28px">Versions</h3>
    <div data-versions></div>
    <div class="launch" data-launch>${icon('chats')}Launch app</div>
  </div>
  <div class="launching" data-launching><div><span class="spin"></span>Launching Power BI Dashboard…</div></div>
</div>`;
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

/** Stage coordinates (1920×1080) of an element's point (fx, fy as fractions of its box). */
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
      const dur = Math.min(1100, Math.max(350, d * 0.9));
      el.style.transitionDuration = `${dur / speed}ms`;
      el.style.transform = `translate(${tx}px, ${ty}px)`;
      x = tx; y = ty;
      await run.wait(dur + 60);
    },
    async click() {
      el.classList.add('press');
      const r = document.createElement('span');
      r.className = 'ripple';
      r.style.left = `${x + 4}px`;
      r.style.top = `${y + 3}px`;
      stage.appendChild(r);
      setTimeout(() => r.remove(), 700);
      await run.wait(140);
      el.classList.remove('press');
      await run.wait(120);
    },
  };
}

async function typeInto(run, el, text, { min = 28, max = 62 } = {}) {
  el.innerHTML = '<span data-val></span><span class="caret"></span>';
  const val = el.querySelector('[data-val]');
  for (const ch of text) {
    val.textContent += ch;
    await run.wait(min + Math.random() * (max - min));
  }
}

async function stream(run, el, text, perWord = 55) {
  el.textContent = '';
  for (const word of text.split(' ')) {
    el.textContent += (el.textContent ? ' ' : '') + word;
    await run.wait(perWord + Math.random() * 40);
  }
}

/* ───────── Scene flows ───────── */
const FLOWS = {
  async chat(run, root) {
    const $ = (s) => root.querySelector(s);
    const cursor = makeCursor(run);
    await run.wait(700);
    // Enable Canvas from the Tools menu.
    await cursor.move($('[data-plus]'));
    await cursor.click();
    $('[data-plus]').classList.add('on');
    $('[data-tools]').classList.add('open');
    await run.wait(700);
    await cursor.move($('[data-canvas]'));
    await cursor.click();
    $('[data-canvas]').classList.add('on');
    await run.wait(650);
    await cursor.move([1180, 560]);
    await cursor.click();
    $('[data-tools]').classList.remove('open');
    $('[data-plus]').classList.remove('on');
    // Write the prompt.
    await cursor.move($('[data-field]'), 0.3, 0.5);
    await cursor.click();
    await typeInto(run, $('[data-field]'), 'Create a markdown component, it can be a simple snake game');
    $('[data-send]').classList.add('ready');
    await run.wait(300);
    await cursor.move($('[data-send]'));
    await cursor.click();
    // Send: the conversation takes over the panel.
    const prompt = $('[data-field] [data-val]').textContent;
    $('[data-field]').innerHTML = '<span class="ph">Write your message here...</span>';
    $('[data-send]').classList.remove('ready');
    $('.chat-hello').classList.add('gone');
    $('.disclaimer').classList.add('gone');
    $('[data-composer]').classList.add('docked');
    $('[data-improve]').classList.add('plain');
    $('[data-improve]').innerHTML = `${icon('grid')}Tools`;
    $('[data-plus]').style.display = 'none';
    await cursor.move([1560, 1000]);
    const thread = $('[data-thread]');
    thread.innerHTML = `<div class="bubble fade-in">${esc(prompt)}</div>`;
    await run.wait(600);
    thread.insertAdjacentHTML('beforeend', `<div class="reply fade-in">${AURA}<div class="text"><span class="typing"><i></i><i></i><i></i></span></div></div>`);
    await run.wait(1300);
    await stream(run, thread.querySelector('.reply .text'), 'I’ll build a simple snake game in HTML for you! It’s a complete component with HTML, CSS and JavaScript.');
    await run.wait(350);
    thread.insertAdjacentHTML('beforeend', `<div class="artifact fade-in"><b>Snake game component</b><small>Code</small><div class="thumb">${snakeThumb()}</div></div>`);
    run.stopSnakes = startSnakes(thread);
    await run.wait(500);
    root.firstElementChild.classList.add('with-rail');
    $('[data-rail]').classList.add('open');
    $('[data-share]').classList.remove('disabled');
    await run.wait(3200);
  },

  async editor(run, root) {
    const $ = (s) => root.querySelector(s);
    const code = $('[data-code]');
    let lines = [...CODE_V1];
    const render = (marks = {}) => {
      // Content in its own span: whitespace-only text between tokens would be dropped as flex items.
      code.innerHTML = lines.map((l, i) => `<div class="ln${marks[i] ? ` ${marks[i]}` : ''}"><b>${i + 1}</b><span>${highlight(l) || ' '}</span></div>`).join('');
    };
    render();
    const msgs = $('[data-msgs]');
    const versionCard = (n, when, note, active) => `<div class="version fade-in${active ? ' active' : ''}" data-v="${n}">${icon('clock')}<b>Version ${n}</b>${active ? '<span class="tag">Active</span>' : `<span class="restore">${icon('rotate')}Restore</span>`}<span class="when">${when}</span>${note ? `<span class="note">${note}</span>` : ''}</div>`;
    const deactivate = () => msgs.querySelectorAll('.version.active').forEach((v) => {
      v.classList.remove('active');
      v.querySelector('.tag').outerHTML = `<span class="restore">${icon('rotate')}Restore</span>`;
    });
    msgs.innerHTML = versionCard(1, 'Dec 9, 2025 · 1:22 PM', 'Initial dashboard version', true);
    const cursor = makeCursor(run);
    const field = $('[data-side-field]'), send = $('[data-side-send]');

    const ask = async (prompt, reply) => {
      await cursor.move(field, 0.2, 0.5);
      await cursor.click();
      await typeInto(run, field, prompt);
      send.classList.add('ready');
      await cursor.move(send);
      await cursor.click();
      field.textContent = 'Write your message here...';
      send.classList.remove('ready');
      msgs.insertAdjacentHTML('beforeend', `<div class="bubble fade-in">${esc(prompt)}</div>`);
      await run.wait(500);
      msgs.insertAdjacentHTML('beforeend', `<div class="reply fade-in">${AURA}<div class="text"><span class="typing"><i></i><i></i><i></i></span></div></div>`);
      await cursor.move([1300, 980]);
      await run.wait(900);
      await stream(run, msgs.lastElementChild.querySelector('.text'), reply);
    };

    await run.wait(800);
    // Version 2: the chart is written into the file line by line.
    await ask('Add monthly opportunity charts', 'I’ll add monthly opportunity charts to the dashboard view.');
    const marks = {};
    for (let k = 0; k < CODE_V2_INSERT.length; k++) {
      lines.splice(V2_AT + k, 0, CODE_V2_INSERT[k]);
      marks[V2_AT + k] = 'add';
      render(marks);
      code.scrollTop = Math.max(0, (V2_AT + k) * 20.8 - 520);
      await run.wait(120);
    }
    deactivate();
    msgs.insertAdjacentHTML('beforeend', versionCard(2, 'Dec 9, 2025 · 1:52 PM', '', true));
    await run.wait(1400);
    render();
    // Version 3: the palette and pills are restyled in place.
    await ask('Adjust the card colors and layout', 'I’ll adjust the colors and the layout of the dashboard cards.');
    const barAt = lines.findIndex((l) => l.includes('dataKey="Retail" fill'));
    const pillAt = lines.findIndex((l) => l.includes('>Retail</button>'));
    const edits = {};
    for (let k = 0; k < 3; k++) { lines[barAt + k] = CODE_V3_EDITS.bars[k]; edits[barAt + k] = 'mod'; render(edits); await run.wait(260); }
    lines[pillAt] = CODE_V3_EDITS.pill; edits[pillAt] = 'mod'; render(edits);
    deactivate();
    msgs.insertAdjacentHTML('beforeend', versionCard(3, 'Dec 9, 2025 · 2:22 PM', '', true));
    await run.wait(1200);
    // Preview the generated dashboard.
    await cursor.move($('[data-tab-preview]'));
    await cursor.click();
    $('[data-tab-code]').classList.remove('on');
    $('[data-tab-preview]').classList.add('on');
    const bars = $('[data-bars]');
    const data = [[45, 36, 39], [41, 50, 42], [55, 47, 44], [60, 52, 43], [64, 56, 47], [63, 54, 44], [68, 59, 50], [66, 57, 48], [71, 61, 52], [72, 62, 53], [74, 64, 56]];
    bars.innerHTML = data.map(() => '<div class="m"><span style="background:#60a5fa"></span><span style="background:#34d399"></span><span style="background:#f472b6"></span></div>').join('');
    $('[data-preview]').classList.add('on');
    await run.wait(250);
    bars.querySelectorAll('.m').forEach((m, i) => m.querySelectorAll('span').forEach((s, j) => {
      s.style.transitionDelay = `${(i * 60 + j * 30) / speed}ms`;
      s.style.height = `${data[i][j] * 1.25}%`;
    }));
    await cursor.move([1300, 1000]);
    await run.wait(3600);
  },

  async gallery(run, root) {
    const $ = (s) => root.querySelector(s);
    const cards = [...root.querySelectorAll('.card')];
    cards.forEach((c) => c.classList.add('hide'));
    run.stopSnakes = startSnakes(root);
    const tabs = $('[data-tabs]'), pill = $('[data-pill]');
    const placePill = (name) => {
      const t = tabs.querySelector(`[data-tab="${name}"]`);
      pill.style.left = `${t.offsetLeft}px`;
      pill.style.width = `${t.offsetWidth}px`;
    };
    placePill('private');
    const versions = $('[data-versions]');
    const V = [
      [3, 'Dec 9, 2025 · 2:22 PM', 'Card colors and layout adjustments'],
      [2, 'Dec 9, 2025 · 1:52 PM', 'Added monthly opportunity charts'],
      [1, 'Dec 9, 2025 · 1:22 PM', 'Initial dashboard version'],
    ];
    const renderVersions = (active) => {
      versions.innerHTML = V.map(([n, when, note]) => `<div class="version${n === active ? ' active' : ''}" data-v="${n}">${icon('clock')}<b>Version ${n}</b>${n === active ? '<span class="tag">Active</span>' : `<span class="restore" data-restore="${n}">${icon('rotate')}Restore</span>`}<span class="when">${when}</span><span class="note">${note}</span></div>`).join('');
    };
    renderVersions(3);
    await run.wait(300);
    for (const c of cards) { c.classList.remove('hide'); await run.wait(110); }
    const cursor = makeCursor(run);
    await run.wait(500);
    // Hover the apps.
    const powerbi = $('[data-card="powerbi"]'), snake = $('[data-card="snake"]');
    await cursor.move(snake, 0.5, 0.35);
    snake.classList.add('lift');
    await run.wait(900);
    snake.classList.remove('lift');
    await cursor.move(powerbi, 0.5, 0.35);
    powerbi.classList.add('lift');
    await cursor.click();
    await run.wait(700);
    // Restore version 2, then go back to version 3.
    const status = $('[data-status]');
    const restore = async (n) => {
      await cursor.move(versions.querySelector(`[data-restore="${n}"]`));
      await cursor.click();
      status.className = 'busy';
      status.innerHTML = '<span class="spin"></span>Restoring';
      await run.wait(1100);
      renderVersions(n);
      status.className = 'ready';
      status.innerHTML = `Ready ${icon('checkCircle')}`;
      await run.wait(900);
    };
    await restore(2);
    await restore(3);
    powerbi.classList.remove('lift');
    // Department apps.
    await cursor.move(tabs.querySelector('[data-tab="department"]'));
    await cursor.click();
    placePill('department');
    const mine = $('[data-mine]');
    mine.querySelectorAll('.card').forEach((c) => c.classList.add('hide'));
    await run.wait(350);
    $('[data-h2]').textContent = 'Sales department';
    snake.style.display = 'none';
    mine.querySelectorAll('.card').forEach((c) => c.classList.remove('hide'));
    await run.wait(1100);
    // Launch.
    const launch = $('[data-launch]');
    await cursor.move(launch);
    launch.classList.add('press');
    await cursor.click();
    launch.classList.remove('press');
    $('[data-launching]').classList.add('on');
    await run.wait(2200);
  },
};

const MARKUP = { chat: chatMarkup, editor: editorMarkup, gallery: galleryMarkup };
const ORDER = ['chat', 'editor', 'gallery'];

/* ───────── Player ───────── */
let current = null;
let playAll = false;

function setPressed(name) {
  document.querySelectorAll('[data-scene]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.scene === name)));
  document.getElementById('play-all').setAttribute('aria-pressed', String(playAll));
}

async function play(name) {
  if (current) { current.abort(); current.stopSnakes?.(); }
  const run = new Run();
  // Remember the scene, so hash changes made by the player itself don't restart it.
  run.scene = name;
  current = run;
  stage.innerHTML = MARKUP[name]();
  setPressed(name);
  fit();
  try {
    await FLOWS[name](run, stage);
    await run.wait(600);
    const next = playAll ? ORDER[(ORDER.indexOf(name) + 1) % ORDER.length] : name;
    if (current === run) { run.stopSnakes?.(); location.hash = next; if (next === name) play(name); }
  } catch (e) {
    if (e.name !== 'AbortError') throw e;
  }
}

document.querySelectorAll('[data-scene]').forEach((b) => b.addEventListener('click', () => { playAll = false; location.hash = b.dataset.scene; play(b.dataset.scene); }));
document.getElementById('play-all').addEventListener('click', () => { playAll = true; location.hash = 'chat'; play('chat'); });
document.getElementById('replay').addEventListener('click', () => play(sceneFromHash()));
document.getElementById('speed').addEventListener('change', (e) => { speed = Number(e.target.value); });
addEventListener('keydown', (e) => { if (e.key === 'r') play(sceneFromHash()); });
addEventListener('hashchange', () => { if (sceneFromHash() !== current?.scene) play(sceneFromHash()); });

function sceneFromHash() {
  const h = location.hash.slice(1);
  return ORDER.includes(h) ? h : 'chat';
}

fit();
play(sceneFromHash());
