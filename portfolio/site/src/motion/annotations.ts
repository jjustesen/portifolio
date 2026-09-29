// Margin annotations that write themselves onto a section after the reader settles there.
// Three styles are available for comparison; the strokes are generated placeholders until
// real hand-drawn SVGs replace them.

export type AnnotationStyle = 'contact' | 'code' | 'machine' | 'off';

type Anchor = 'tl' | 't' | 'tr' | 'r' | 'br' | 'b' | 'bl' | 'l' | 'c';

/** What a note points at: an element in the block (CSS selector, nth match) and optionally a phrase inside it. */
interface Target {
  sel?: string;
  nth?: number;
  text?: string;
}

interface Place {
  at: Anchor;
  dx?: number;
  dy?: number;
}

type NoteSpec =
  | { kind: 'circle' | 'underline' | 'underline2' | 'crop' | 'box' | 'bracket'; target: Target; label?: string }
  | { kind: 'detect'; target: Target; label: string }
  | { kind: 'x' | 'star'; target: Target; place: Place; size?: number }
  | { kind: 'text'; target: Target; text: string; place: Place; rotate?: number }
  | { kind: 'arrow'; target: Target; from: Place; to: Place }
  | { kind: 'loop'; target: Target; to: Target; text?: string };

interface StyleLook {
  color: string;
  font: (size: number) => string;
  textSize: number;
  lineWidth: number;
  /** Hand tremor in px; 0 draws clean geometric lines. */
  jitter: number;
  dash?: number[];
}

const HAND = (size: number) => `400 ${size}px Caveat, 'Comic Sans MS', cursive`;
const MONO = (size: number) => `400 ${size}px ui-monospace, 'SFMono-Regular', Consolas, monospace`;

const LOOKS: Record<Exclude<AnnotationStyle, 'off'>, StyleLook> = {
  // Red grease pencil on a contact sheet.
  contact: { color: '#ff5a36', font: HAND, textSize: 28, lineWidth: 2.4, jitter: 1.6 },
  // Devtools overlay and review comments.
  code: { color: '#7cb7ff', font: MONO, textSize: 13, lineWidth: 1.2, jitter: 0, dash: [4, 4] },
  // Detection boxes and model scores.
  machine: { color: '#c6ff4d', font: MONO, textSize: 12, lineWidth: 1.4, jitter: 0 },
};

const H1 = { sel: 'h1' };
const H2 = { sel: 'h2' };

/** Notes per style, keyed by the block's data-notes value. */
const NOTES: Record<Exclude<AnnotationStyle, 'off'>, Record<string, NoteSpec[]>> = {
  contact: {
    intro: [
      { kind: 'crop', target: H1 },
      { kind: 'star', target: H1, place: { at: 'tr', dx: 18, dy: -8 }, size: 16 },
      { kind: 'text', target: H1, text: 'select', place: { at: 'tr', dx: 40, dy: -2 }, rotate: -6 },
    ],
    manifesto: [
      { kind: 'underline2', target: { sel: 'h2', text: 'human intuition' } },
      { kind: 'text', target: H2, text: 'the whole point', place: { at: 'br', dx: 30, dy: 28 }, rotate: -4 },
      { kind: 'arrow', target: { sel: 'h2', text: 'human intuition' }, from: { at: 'br', dx: 60, dy: 44 }, to: { at: 'br', dx: 6, dy: 14 } },
    ],
    auramind: [
      { kind: 'arrow', target: H2, from: { at: 'r', dx: 150, dy: 26 }, to: { at: 'r', dx: 16, dy: 4 } },
      { kind: 'text', target: H2, text: 'hover me', place: { at: 'r', dx: 112, dy: 44 }, rotate: -5 },
      { kind: 'circle', target: { sel: '.detail .small', text: 'Sole frontend engineer' } },
      { kind: 'text', target: { sel: '.detail .small', text: 'Sole frontend engineer' }, text: 'yes, all of it', place: { at: 'r', dx: 44, dy: -30 }, rotate: -5 },
    ],
    project2: [
      { kind: 'circle', target: H2 },
      { kind: 'text', target: H2, text: 'no bot in the room', place: { at: 'r', dx: 40, dy: -4 }, rotate: -4 },
    ],
    project3: [
      { kind: 'underline', target: H2 },
      { kind: 'text', target: H2, text: 'all mine, every line', place: { at: 'r', dx: 36, dy: -14 }, rotate: -6 },
    ],
    process: [
      { kind: 'loop', target: { sel: 'h3', nth: 2 }, to: { sel: 'h3', nth: 0 }, text: 'repeat' },
    ],
    capabilities: [
      { kind: 'bracket', target: { sel: '.detail', nth: 2 } },
      { kind: 'text', target: { sel: '.detail', nth: 2 }, text: 'the fun part', place: { at: 'r', dx: 40, dy: -6 }, rotate: -4 },
    ],
    experience: [
      { kind: 'arrow', target: { sel: '.experience-row h3', nth: 0 }, from: { at: 'r', dx: 150, dy: 30 }, to: { at: 'r', dx: 16, dy: 4 } },
      { kind: 'text', target: { sel: '.experience-row h3', nth: 0 }, text: 'still going', place: { at: 'r', dx: 110, dy: 48 }, rotate: -5 },
    ],
    lab: [
      { kind: 'text', target: H2, text: 'go on, move your mouse', place: { at: 'r', dx: 36, dy: -20 }, rotate: -5 },
      { kind: 'arrow', target: H2, from: { at: 'r', dx: 110, dy: 10 }, to: { at: 'r', dx: 14, dy: 6 } },
    ],
    contact: [
      { kind: 'underline', target: { sel: '.contact-email' } },
      { kind: 'text', target: { sel: '.contact-email' }, text: 'say hi :)', place: { at: 'r', dx: 30, dy: -6 }, rotate: -6 },
    ],
  },
  code: {
    intro: [
      { kind: 'box', target: H1 },
      { kind: 'text', target: { sel: '.hero-role' }, text: '// ship it', place: { at: 'r', dx: 24, dy: 0 } },
    ],
    manifesto: [
      { kind: 'box', target: { sel: 'h2', text: 'human intuition' } },
      { kind: 'text', target: H2, text: '/* the actual job */', place: { at: 'br', dx: 16, dy: 26 } },
    ],
    auramind: [
      { kind: 'box', target: { sel: '.detail .small', text: 'Sole frontend engineer' } },
      { kind: 'text', target: { sel: '.detail .small', text: 'Sole frontend engineer' }, text: 'LGTM ✓', place: { at: 'r', dx: 20, dy: 0 } },
    ],
    project2: [{ kind: 'text', target: { sel: '.label' }, text: '// C++ → Python → Gemini, one repo, one dev', place: { at: 'r', dx: 16, dy: 0 } }],
    project3: [{ kind: 'text', target: { sel: '.label' }, text: '// CODEOWNERS: * @jjustesen', place: { at: 'r', dx: 16, dy: 0 } }],
    process: [
      { kind: 'text', target: { sel: 'h3', nth: 2 }, text: 'while (true) {', place: { at: 'tl', dx: 0, dy: -22 } },
      { kind: 'loop', target: { sel: 'h3', nth: 2 }, to: { sel: 'h3', nth: 0 } },
    ],
    capabilities: [
      { kind: 'box', target: { sel: '.detail h3', nth: 2 } },
      { kind: 'text', target: { sel: '.detail h3', nth: 2 }, text: '// TODO: more WebGL', place: { at: 'r', dx: 20, dy: 0 } },
    ],
    experience: [{ kind: 'text', target: { sel: '.experience-row .label', nth: 0 }, text: '$ git log --oneline', place: { at: 'r', dx: 16, dy: 0 } }],
    lab: [{ kind: 'text', target: H2, text: '<!-- experiments, may break -->', place: { at: 'r', dx: 24, dy: 0 } }],
    contact: [
      { kind: 'box', target: { sel: '.contact-email' } },
      { kind: 'text', target: { sel: '.contact-email' }, text: '200 OK', place: { at: 'r', dx: 20, dy: 0 } },
    ],
  },
  machine: {
    intro: [
      { kind: 'detect', target: H1, label: 'person · 0.99' },
      { kind: 'detect', target: { sel: '.hero-role' }, label: 'frontend_engineer · 0.97' },
    ],
    manifesto: [{ kind: 'detect', target: { sel: 'h2', text: 'human intuition' }, label: 'human_intuition · 0.97' }],
    auramind: [
      { kind: 'detect', target: H2, label: 'enterprise_ai · 0.94' },
      { kind: 'text', target: H2, text: 'streaming… ▍', place: { at: 'r', dx: 24, dy: 0 } },
    ],
    project2: [{ kind: 'detect', target: H2, label: 'speakers_recognised · 0.97' }],
    project3: [{ kind: 'detect', target: H2, label: 'authors: 1 · ai_features: 4' }],
    process: [{ kind: 'detect', target: H2, label: 'pattern: loop · 0.91' }],
    capabilities: [{ kind: 'detect', target: { sel: '.detail h3', nth: 2 }, label: 'fun · 0.99' }],
    experience: [{ kind: 'text', target: { sel: '.experience-row .label', nth: 0 }, text: 'trajectory: ↗  (p = 0.93)', place: { at: 'r', dx: 16, dy: 0 } }],
    lab: [{ kind: 'text', target: H2, text: 'confidence: low · curiosity: high', place: { at: 'r', dx: 24, dy: 0 } }],
    contact: [{ kind: 'detect', target: { sel: '.contact-email' }, label: 'next_action: reply' }],
  },
};

type Point = [number, number];
interface Rect { left: number; top: number; right: number; bottom: number; width: number; height: number }
interface Drawing {
  lines: { points: Point[]; dash?: number[] }[];
  texts: { text: string; x: number; y: number; rotate: number; size: number }[];
}

const NOTE_STAGGER = 0.45;
const MIN_WIDTH = 1000;
const NOTE_DURATION = 0.8;
const FADE_OUT = 0.4;

function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hashString = (s: string) => [...s].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261);

function anchorPoint(r: Rect, p: Place): Point {
  const x = p.at.includes('l') ? r.left : p.at.includes('r') ? r.right : r.left + r.width / 2;
  const y = p.at.startsWith('t') ? r.top : p.at.startsWith('b') ? r.bottom : r.top + r.height / 2;
  return [x + (p.dx ?? 0), y + (p.dy ?? 0)];
}

/**
 * Viewport rect of a target: the extent of its text (not the full-width block box, so notes
 * placed "to the right" sit next to the words), or the first line of a phrase inside it.
 */
function resolve(block: Element, target: Target): Rect | null {
  const el = target.sel ? block.querySelectorAll(target.sel)[target.nth ?? 0] : block;
  if (!el) return null;
  if (!target.text) {
    const range = document.createRange();
    range.selectNodeContents(el);
    const rect = range.getBoundingClientRect();
    return rect.width > 0 ? rect : el.getBoundingClientRect();
  }
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const i = node.textContent?.indexOf(target.text) ?? -1;
    if (i < 0) continue;
    const range = document.createRange();
    range.setStart(node, i);
    range.setEnd(node, i + target.text.length);
    return range.getClientRects()[0] ?? range.getBoundingClientRect();
  }
  return el.getBoundingClientRect();
}

/** Polyline with a slow hand tremor perpendicular to the stroke. */
function handLine(a: Point, b: Point, rng: () => number, jitter: number, n = 18): Point[] {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  const nx = -(b[1] - a[1]) / len, ny = (b[0] - a[0]) / len;
  const phase = rng() * 6, bow = (rng() - 0.5) * jitter * 3;
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, wobble = Math.sin(t * Math.PI) * bow + Math.sin(t * 7 + phase) * jitter * 0.5;
    return [a[0] + (b[0] - a[0]) * t + nx * wobble, a[1] + (b[1] - a[1]) * t + ny * wobble] as Point;
  });
}

function bezier(a: Point, c: Point, b: Point, n = 28): Point[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, u = 1 - t;
    return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]] as Point;
  });
}

function arrowHead(tip: Point, from: Point, size: number, rng: () => number, jitter: number) {
  const angle = Math.atan2(tip[1] - from[1], tip[0] - from[0]);
  return [-1, 1].map((side) => {
    const a = angle + Math.PI + side * (0.45 + rng() * 0.15);
    return handLine(tip, [tip[0] + Math.cos(a) * size, tip[1] + Math.sin(a) * size], rng, jitter * 0.4, 5);
  });
}

function build(spec: NoteSpec, block: Element, look: StyleLook, seed: number): Drawing | null {
  const r = resolve(block, spec.target);
  if (!r) return null;
  const rng = mulberry32(seed), j = look.jitter;
  const d: Drawing = { lines: [], texts: [] };
  const pad = 8;
  switch (spec.kind) {
    case 'circle': {
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2, rx = r.width / 2 + pad + 6, ry = r.height / 2 + pad;
      const start = rng() * Math.PI * 2, sweep = Math.PI * 2 * (1.06 + rng() * 0.08), phase = rng() * 6;
      d.lines.push({
        points: Array.from({ length: 73 }, (_, i) => {
          const t = i / 72, a = start + sweep * t, k = 1 + Math.sin(a * 2 + phase) * 0.04 + t * 0.05;
          return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k] as Point;
        }),
      });
      break;
    }
    case 'underline':
    case 'underline2': {
      const y = r.bottom + 4;
      d.lines.push({ points: handLine([r.left - 4, y], [r.right + 6, y + 2], rng, j + 0.6) });
      if (spec.kind === 'underline2') d.lines.push({ points: handLine([r.left + 6, y + 7], [r.right - 10, y + 8], rng, j + 0.6) });
      break;
    }
    case 'crop': {
      const L = Math.min(28, r.height * 0.6), o = 14;
      const corners: [Point, number, number][] = [
        [[r.left - o, r.top - o], 1, 1], [[r.right + o, r.top - o], -1, 1],
        [[r.right + o, r.bottom + o], -1, -1], [[r.left - o, r.bottom + o], 1, -1],
      ];
      for (const [[x, y], sx, sy] of corners) {
        d.lines.push({ points: handLine([x, y + sy * L], [x, y], rng, j, 6).concat(handLine([x, y], [x + sx * L, y], rng, j, 6)) });
      }
      break;
    }
    case 'box': {
      const [a, b, c, e]: Point[] = [[r.left - 4, r.top - 4], [r.right + 4, r.top - 4], [r.right + 4, r.bottom + 4], [r.left - 4, r.bottom + 4]];
      d.lines.push({ points: [a, b, c, e, a], dash: look.dash });
      // Size badge below the box, like the devtools tooltip (labels above headings stay clear).
      d.texts.push({ text: spec.label ?? `${Math.round(r.width)} × ${Math.round(r.height)}`, x: r.left - 4, y: r.bottom + 16, rotate: 0, size: look.textSize - 2 });
      break;
    }
    case 'detect': {
      const L = Math.min(18, r.height * 0.5), o = 6;
      const x0 = r.left - o, y0 = r.top - o, x1 = r.right + o, y1 = r.bottom + o;
      d.lines.push({ points: [[x0, y0 + L], [x0, y0], [x0 + L, y0]] }, { points: [[x1 - L, y0], [x1, y0], [x1, y0 + L]] });
      d.lines.push({ points: [[x1, y1 - L], [x1, y1], [x1 - L, y1]] }, { points: [[x0 + L, y1], [x0, y1], [x0, y1 - L]] });
      d.texts.push({ text: spec.label, x: x0, y: y1 + 12, rotate: 0, size: look.textSize });
      break;
    }
    case 'bracket': {
      const x = r.right + 14, w = 12, midY = r.top + r.height / 2;
      d.lines.push({ points: bezier([x, r.top], [x + w, r.top], [x + w * 0.6, midY - 6]).concat(bezier([x + w * 0.6, midY - 6], [x + w, midY], [x + w * 1.6, midY])) });
      d.lines.push({ points: bezier([x + w * 1.6, midY], [x + w, midY], [x + w * 0.6, midY + 6]).concat(bezier([x + w * 0.6, midY + 6], [x + w, r.bottom], [x, r.bottom])) });
      break;
    }
    case 'x':
    case 'star': {
      const [x, y] = anchorPoint(r, spec.place), s = spec.size ?? 14;
      if (spec.kind === 'x') {
        d.lines.push({ points: handLine([x - s, y - s], [x + s, y + s], rng, j, 8) }, { points: handLine([x + s, y - s], [x - s, y + s], rng, j, 8) });
      } else {
        const pts: Point[] = [];
        for (let i = 0; i <= 10; i++) {
          const a = -Math.PI / 2 + (i * Math.PI * 4) / 5 + (rng() - 0.5) * 0.08;
          pts.push([x + Math.cos(a) * s, y + Math.sin(a) * s]);
        }
        d.lines.push({ points: pts });
      }
      break;
    }
    case 'text': {
      const [x, y] = anchorPoint(r, spec.place);
      d.texts.push({ text: spec.text, x, y, rotate: ((spec.rotate ?? 0) * Math.PI) / 180, size: look.textSize });
      break;
    }
    case 'arrow': {
      const from = anchorPoint(r, spec.from), to = anchorPoint(r, spec.to);
      const mid: Point = [(from[0] + to[0]) / 2 + (to[1] - from[1]) * 0.25, (from[1] + to[1]) / 2 - (to[0] - from[0]) * 0.25];
      const path = bezier(from, mid, to);
      d.lines.push({ points: path }, ...arrowHead(to, path[path.length - 4], 12, rng, j).map((points) => ({ points })));
      break;
    }
    case 'loop': {
      const to = resolve(block, spec.to);
      if (!to) return null;
      const from: Point = [r.left - 14, r.top + r.height / 2], end: Point = [to.left - 14, to.top + to.height / 2];
      const bulge = 70 + Math.abs(from[1] - end[1]) * 0.08;
      const path = bezier(from, [Math.min(from[0], end[0]) - bulge, (from[1] + end[1]) / 2], end, 40);
      d.lines.push({ points: path, dash: look.dash }, ...arrowHead(end, path[path.length - 4], 12, rng, j).map((points) => ({ points })));
      if (spec.text) d.texts.push({ text: spec.text, x: Math.min(from[0], end[0]) - bulge - 20, y: (from[1] + end[1]) / 2, rotate: -Math.PI / 2, size: look.textSize });
      break;
    }
  }
  return d;
}

const polylineLength = (pts: Point[]) => pts.reduce((sum, p, i) => (i ? sum + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0), 0);

/**
 * Draws the active block's notes into its own canvas (sampled by the shader, so notes float and
 * dissolve with the text). Notes write themselves in one after another; leaving the block fades them out.
 */
export function createAnnotator() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  let w = 1, h = 1;
  let block: Element | null = null, key = '', start = 0;
  let leaving: { block: Element; key: string; start: number; left: number } | null = null;

  function drawBlock(style: Exclude<AnnotationStyle, 'off'>, target: Element, noteKey: string, begin: number, now: number, alpha: number, calm: boolean) {
    const look = LOOKS[style];
    const specs = NOTES[style][noteKey] ?? [];
    ctx.strokeStyle = look.color; ctx.fillStyle = look.color;
    ctx.lineWidth = look.lineWidth; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    specs.forEach((spec, i) => {
      const p = calm ? 1 : Math.max(0, Math.min(1, ((now - begin) / 1000 - i * NOTE_STAGGER) / NOTE_DURATION));
      if (p <= 0) return;
      const drawing = build(spec, target, look, hashString(`${style}:${noteKey}:${i}`));
      if (!drawing) return;
      ctx.globalAlpha = alpha;
      // Strokes are drawn in order up to the current share of their total length.
      const total = drawing.lines.reduce((s, l) => s + polylineLength(l.points), 0);
      let budget = total * Math.min(1, p * (drawing.texts.length ? 1.6 : 1));
      for (const line of drawing.lines) {
        if (budget <= 0) break;
        ctx.setLineDash(line.dash ?? []);
        ctx.beginPath();
        ctx.moveTo(line.points[0][0], line.points[0][1]);
        for (let k = 1; k < line.points.length && budget > 0; k++) {
          const [x0, y0] = line.points[k - 1], [x1, y1] = line.points[k];
          const seg = Math.hypot(x1 - x0, y1 - y0);
          const f = Math.min(1, budget / (seg || 1));
          ctx.lineTo(x0 + (x1 - x0) * f, y0 + (y1 - y0) * f);
          budget -= seg;
        }
        ctx.stroke();
      }
      ctx.setLineDash([]);
      // Text writes in letter by letter.
      for (const t of drawing.texts) {
        const shown = Math.ceil(t.text.length * Math.min(1, p * 1.25));
        ctx.save();
        ctx.font = look.font(t.size);
        ctx.textBaseline = 'middle';
        ctx.translate(t.x, t.y); ctx.rotate(t.rotate);
        ctx.fillText(t.text.slice(0, shown), 0, 0);
        ctx.restore();
      }
    });
    ctx.globalAlpha = 1;
  }

  return {
    canvas,
    resize(width: number, height: number, dpr: number) {
      w = width; h = height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },
    /** Switches the active block; its notes start writing after `delay` seconds. */
    setBlock(next: Element | null, now: number, delay: number) {
      if (next === block) return;
      if (block) leaving = { block, key, start, left: now };
      block = next;
      key = (next as HTMLElement | null)?.dataset.notes ?? '';
      start = now + delay * 1000;
    },
    draw(style: AnnotationStyle, now: number, calm: boolean) {
      ctx.clearRect(0, 0, w, h);
      // Notes live in the margins beside the text; narrow screens have no margin for them.
      if (style === 'off' || !(style in LOOKS) || w < MIN_WIDTH) return;
      if (leaving) {
        const a = 1 - (now - leaving.left) / 1000 / FADE_OUT;
        if (a <= 0) leaving = null;
        else drawBlock(style, leaving.block, leaving.key, leaving.start, now, a, calm);
      }
      if (block && key) drawBlock(style, block, key, start, now, 1, calm);
    },
  };
}
