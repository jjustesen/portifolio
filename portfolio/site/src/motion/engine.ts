import { Camera, CanvasTexture, LinearFilter, Mesh, NoBlending, PlaneGeometry, Scene, ShaderMaterial, Vector2, WebGLRenderer } from 'three';
import { createAnnotator } from './annotations';
import { fragmentShader, grainFragmentShader, vertexShader } from './shaders';
import type { MotionTokens } from './tokens';

export interface MotionEngine {
  /** Replays the letter reveal. */
  reveal(): void;
  /**
   * Rolls the section number from the current one to `label` (e.g. "03") beside its `title`,
   * dimming the text meanwhile, and schedules the notes of `block`.
   */
  showSection(label: string, title: string, block: Element): void;
  /** Forgets the current section (new page): the next one is set silently. */
  resetSection(): void;
  /** Eases scene values away from the tokens (e.g. a calmer ring on project pages); null returns to the tokens. */
  setSceneOverride(override: SceneOverride | null): void;
  /** Re-reads the [data-ink] text blocks (layout or content changed). */
  measure(): void;
  setCalm(calm: boolean): void;
  dispose(): void;
}

export interface MotionEngineOptions {
  /** Element whose [data-ink] descendants are drawn by the shader. */
  root: HTMLElement;
  /** Live tokens object; read every frame, so mutating it updates the scene. */
  tokens: MotionTokens;
  calm: boolean;
}

export interface SceneOverride {
  ringGlow?: number;
  ringRadius?: number;
  chroma?: number;
  pointer?: number;
  /** 0 = monochrome ring (default), 1 = ring in the letters' thermal colors. */
  ringChroma?: number;
  grain?: number;
}

interface InkBlock {
  x: number;
  y: number;
  width: number;
  height: number;
  font: string;
  letterSpacing: string;
  size: number;
  lineHeight: number;
  lines: string[];
}

interface SectionCount {
  from: string;
  to: string;
  title: string;
  start: number;
}

const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
// 11px labels → .12, ~24px body → .28, display headings → 1.
const typeScale = (size: number) => clamp((size - 10) / 50, 0.12, 1);
// Letter reveal: per-glyph stagger, capped so long pages don't reveal for ages.
const GLYPH_STAGGER = 0.009;
const MAX_STAGGER = 1.4;
// Text keeps a trace while the section number is on screen.
const TEXT_DIM = 0.88;

/**
 * Full-screen WebGL layer that redraws the page's [data-ink] text through a shader
 * (edge dissolve, scroll trails, liquid float, pointer interference, thermal chroma) over a
 * procedural background, plus a grain layer composited above everything. Returns null without WebGL.
 */
export function createMotionEngine(options: MotionEngineOptions): MotionEngine | null {
  const { root, tokens } = options;
  let calm = options.calm;

  const stage = document.createElement('canvas');
  stage.className = 'motion-stage';
  stage.setAttribute('aria-hidden', 'true');
  const grainLayer = document.createElement('canvas');
  grainLayer.className = 'motion-grain';
  grainLayer.setAttribute('aria-hidden', 'true');

  let renderer: WebGLRenderer;
  let grainRenderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas: stage, antialias: false, powerPreference: 'low-power' });
    grainRenderer = new WebGLRenderer({ canvas: grainLayer, antialias: false, alpha: false, powerPreference: 'low-power' });
  } catch {
    return null;
  }
  document.body.prepend(stage);
  document.body.append(grainLayer);

  let revealStart = performance.now();
  // Scene values actually rendered: they ease toward the override, or the tokens without one.
  let override: SceneOverride | null = null;
  let ringGlow = tokens.ringGlow, ringRadius = tokens.ringRadius, chroma = tokens.chroma, pointer = tokens.pointer, ringChroma = 0, grain = tokens.grain;
  let count: SectionCount | null = null;
  let section = '';
  let w = 1, h = 1, last = 0, scroll = 0, velocity = 0, raf = 0;
  const mouse = new Vector2(-2, -2), target = new Vector2(-2, -2);

  const ink = document.createElement('canvas');
  const ctx = ink.getContext('2d')!;
  const texture = new CanvasTexture(ink);
  texture.minFilter = LinearFilter;
  texture.generateMipmaps = false;
  // Low-res map of type scale per screen region: small text dissolves lighter than display type.
  const sizeMap = document.createElement('canvas');
  const sctx = sizeMap.getContext('2d')!;
  const sizeTexture = new CanvasTexture(sizeMap);
  sizeTexture.minFilter = LinearFilter;
  sizeTexture.generateMipmaps = false;
  // Margin notes: colored, drawn in their own canvas and sampled with the text's distortion.
  const annotator = createAnnotator();
  const notesTexture = new CanvasTexture(annotator.canvas);
  notesTexture.minFilter = LinearFilter;
  notesTexture.generateMipmaps = false;

  const uniforms = {
    uInk: { value: texture }, uSizeMap: { value: sizeTexture }, uNotes: { value: notesTexture }, uSize: { value: new Vector2() }, uMouse: { value: mouse },
    uRadius: { value: tokens.pointerRadius }, uTime: { value: 0 }, uLiquid: { value: tokens.liquid }, uGrain: { value: tokens.grain },
    uChroma: { value: tokens.chroma }, uRingChroma: { value: 0 }, uBackground: { value: 0 }, uBgPointer: { value: tokens.bgPointer },
    uRingRadius: { value: tokens.ringRadius }, uRingGlow: { value: tokens.ringGlow }, uCaustics: { value: tokens.caustics },
    uPointer: { value: 1 }, uDissolve: { value: 1 }, uVelocity: { value: 0 }, uReading: { value: 1 },
  };
  const scene = new Scene(), camera = new Camera();
  const material = new ShaderMaterial({ uniforms, vertexShader, fragmentShader, depthTest: false, depthWrite: false });
  scene.add(new Mesh(new PlaneGeometry(2, 2), material));
  const grainScene = new Scene();
  const grainMaterial = new ShaderMaterial({
    uniforms: { uTime: uniforms.uTime, uGrain: uniforms.uGrain, uGrainSize: { value: 1 } },
    vertexShader, fragmentShader: grainFragmentShader, blending: NoBlending, depthTest: false, depthWrite: false,
  });
  grainScene.add(new Mesh(new PlaneGeometry(2, 2), grainMaterial));

  let blocks: InkBlock[] = [];
  function measure() {
    blocks = [...root.querySelectorAll<HTMLElement>('[data-ink]')].map((el) => {
      const r = el.getBoundingClientRect(), s = getComputedStyle(el);
      const font = `${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
      ctx.font = font;
      ctx.letterSpacing = s.letterSpacing === 'normal' ? '0px' : s.letterSpacing;
      // Explicit <br> breaks come from the DOM; the rest is wrapped to the element width.
      const parts = [''];
      el.childNodes.forEach((node) => {
        // Manual breaks hidden by CSS (narrow screens) let the text flow instead.
        if (node.nodeName === 'BR') {
          if (getComputedStyle(node as Element).display !== 'none') parts.push('');
        } else parts[parts.length - 1] += node.textContent ?? '';
      });
      const lines: string[] = [];
      for (const raw of parts) {
        const part = s.textTransform === 'uppercase' ? raw.toUpperCase() : raw;
        let line = '';
        for (const word of part.trim().split(/\s+/)) {
          const next = line ? `${line} ${word}` : word;
          if (ctx.measureText(next).width > r.width && line) { lines.push(line); line = word; } else line = next;
        }
        lines.push(line);
      }
      return {
        x: r.left, y: r.top + window.scrollY, width: r.width, height: r.height, font, letterSpacing: ctx.letterSpacing,
        size: parseFloat(s.fontSize), lineHeight: parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.2, lines,
      };
    });
    ctx.letterSpacing = '0px';
  }

  function resize() {
    w = innerWidth; h = innerHeight;
    const dpr = Math.min(devicePixelRatio, tokens.maxDpr);
    renderer.setPixelRatio(dpr); renderer.setSize(w, h);
    grainRenderer.setPixelRatio(dpr); grainRenderer.setSize(w, h);
    ink.width = Math.round(w * dpr); ink.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sizeMap.width = Math.ceil(w / 4); sizeMap.height = Math.ceil(h / 4); sctx.setTransform(0.25, 0, 0, 0.25, 0, 0);
    annotator.resize(w, h, dpr);
    // three.js allocates texture storage once at the first upload; a canvas of a new size (the
    // mobile address bar showing or hiding) must get fresh storage, or every upload fails and
    // the text freezes on screen.
    texture.dispose(); sizeTexture.dispose(); notesTexture.dispose();
    uniforms.uSize.value.set(w, h);
    measure();
  }

  // Pass 1 pads each block toward its trail (down/left) so the trail keeps the block's scale;
  // pass 2 paints the exact block areas on top, so neighbours' padding never overrides a glyph.
  function drawSizes() {
    sctx.fillStyle = '#fff'; sctx.fillRect(0, 0, w, h);
    for (const pass of [0, 1]) for (const b of blocks) {
      const y = b.y - window.scrollY;
      if (y > h + 100 || y + b.height < -100) continue;
      const v = Math.round(typeScale(b.size) * 255);
      sctx.fillStyle = `rgb(${v},${v},${v})`;
      if (pass === 0) sctx.fillRect(b.x - 24, y, b.width + 24, b.height + 64); else sctx.fillRect(b.x, y, b.width, b.height);
    }
  }

  /** Visibility of the section number over its lifetime: fades in, holds, fades out. */
  function countAlpha(now: number) {
    if (!count) return 0;
    const t = (now - count.start) / 1000 / tokens.duration;
    if (t >= 1) { count = null; return 0; }
    return smoothstep(0, 0.18, t) * (1 - smoothstep(0.7, 1, t));
  }

  /**
   * "02 / Manifesto": each digit rolls from `from` to `to` like a mechanical counter, and the
   * title sits beside it on the same baseline, its letters rising in one after another.
   */
  function drawCount(now: number, alpha: number) {
    if (!count || alpha <= 0) return;
    const t = (now - count.start) / 1000 / tokens.duration;
    const p = 1 - Math.pow(1 - clamp(t / 0.6), 3);
    const digits = Math.max(count.from.length, count.to.length);
    const from = count.from.padStart(digits, '0'), to = count.to.padStart(digits, '0');
    const title = `/ ${count.title}`;
    // Fit the whole group in 90% of the width.
    let size = Math.min(w * 0.19, 180);
    ctx.font = `400 ${size * 0.3}px Georgia`;
    const titleRatio = ctx.measureText(title).width / size;
    size = Math.min(size, (w * 0.9) / (digits * 0.6 + 0.12 + titleRatio));
    const height = size * 1.2, advance = size * 0.6, gap = size * 0.12, titleSize = size * 0.3;
    const groupWidth = digits * advance + gap + titleRatio * size;
    const left = w / 2 - groupWidth / 2, top = h / 2 - height * 0.45;

    ctx.font = `400 ${size}px Georgia`;
    ctx.textBaseline = 'top';
    // Georgia's old-style "0" sits on the baseline, so its bottom is the shared baseline.
    const baseline = top + ctx.measureText('0').actualBoundingBoxDescent;
    ctx.save(); ctx.beginPath(); ctx.rect(left, h / 2 - height * 0.55, digits * advance, height); ctx.clip();
    for (let c = 0; c < digits; c++) {
      const a = Number(from[c]) || 0, b = Number(to[c]) || 0;
      const value = a + (b - a) * p, digit = Math.floor(value), fraction = p >= 1 ? 0 : value - digit;
      for (let row = -1; row < 2; row++) {
        ctx.globalAlpha = alpha * clamp(1 - Math.abs(row - fraction) * 0.65);
        ctx.fillText(String((digit + row + 10) % 10), left + c * advance, top + (row - fraction) * height);
      }
    }
    ctx.restore();

    ctx.font = `400 ${titleSize}px Georgia`;
    ctx.textBaseline = 'alphabetic';
    let x = left + digits * advance + gap;
    [...title].forEach((char, i) => {
      const a = clamp((t - 0.12 - i * 0.025) / 0.2);
      ctx.globalAlpha = alpha * a;
      ctx.fillText(char, x, baseline + (1 - a) * titleSize * 0.5);
      x += ctx.measureText(char).width;
    });
    ctx.textBaseline = 'top'; ctx.globalAlpha = 1;
  }

  function drawText(now: number) {
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = 'white'; ctx.textBaseline = 'top';
    const numberAlpha = countAlpha(now);
    const textAlpha = 1 - numberAlpha * TEXT_DIM;
    const elapsed = (now - revealStart) / 1000;
    // Only glyphs on screen count toward the reveal stagger.
    let glyph = 0;
    for (const b of blocks) {
      ctx.font = b.font; ctx.letterSpacing = b.letterSpacing;
      for (let i = 0; i < b.lines.length; i++) {
        const y = b.y - window.scrollY + i * b.lineHeight;
        if (y < -100 || y > h + 100) continue;
        let x = b.x;
        for (const char of b.lines[i]) {
          const a = calm ? 1 : clamp((elapsed - 0.18 - Math.min(glyph * GLYPH_STAGGER, MAX_STAGGER)) / 0.65);
          ctx.globalAlpha = a * textAlpha;
          ctx.fillText(char, x, y + (1 - a) * 12);
          x += ctx.measureText(char).width;
          glyph++;
        }
      }
    }
    ctx.globalAlpha = 1; ctx.letterSpacing = '0px';
    drawCount(now, numberAlpha);
  }

  function tick(ms: number) {
    raf = requestAnimationFrame(tick);
    if (document.hidden) return;
    const dt = Math.min((ms - last) / 1000 || 0.016, 0.05); last = ms;
    mouse.lerp(target, 1 - Math.exp(-tokens.pointerLag * dt));
    velocity += (clamp((window.scrollY - scroll) / h * 15, -1, 1) - velocity) * (1 - Math.exp(-8 * dt));
    scroll = window.scrollY;
    uniforms.uTime.value += calm ? 0 : dt;
    const ease = 1 - Math.exp(-3 * dt);
    pointer += ((override?.pointer ?? tokens.pointer) - pointer) * ease;
    chroma += ((override?.chroma ?? tokens.chroma) - chroma) * ease;
    uniforms.uPointer.value = calm ? 0 : pointer;
    uniforms.uDissolve.value = calm ? 0 : tokens.dissolve;
    uniforms.uLiquid.value = calm ? 0 : tokens.liquid;
    uniforms.uChroma.value = chroma;
    uniforms.uBackground.value = tokens.background === 'ring' ? 1 : 0;
    ringGlow += ((override?.ringGlow ?? tokens.ringGlow) - ringGlow) * ease;
    ringRadius += ((override?.ringRadius ?? tokens.ringRadius) - ringRadius) * ease;
    ringChroma += ((override?.ringChroma ?? 0) - ringChroma) * ease;
    uniforms.uRingChroma.value = ringChroma;
    uniforms.uRingRadius.value = ringRadius;
    uniforms.uRingGlow.value = ringGlow;
    uniforms.uCaustics.value = tokens.caustics;
    uniforms.uBgPointer.value = calm ? 0 : tokens.bgPointer;
    uniforms.uVelocity.value = calm ? 0 : velocity;
    grain += ((override?.grain ?? tokens.grain) - grain) * ease;
    uniforms.uGrain.value = grain;
    grainMaterial.uniforms.uGrainSize.value = tokens.grainSize * grainRenderer.getPixelRatio();
    const now = performance.now();
    drawText(now); drawSizes();
    annotator.draw(tokens.annotations, now, calm);
    texture.needsUpdate = true; sizeTexture.needsUpdate = true; notesTexture.needsUpdate = true;
    renderer.render(scene, camera);
    grainRenderer.render(grainScene, camera);
  }

  const onPointerMove = (e: PointerEvent) => {
    if ((e.target as Element | null)?.closest?.('[data-motion-ignore]')) { target.set(-2, -2); return; }
    target.set(e.clientX / w, 1 - e.clientY / h);
  };
  const onPointerLeave = () => target.set(-2, -2);
  const observer = new ResizeObserver(() => measure());

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('pointerleave', onPointerLeave);
  window.addEventListener('resize', resize);
  observer.observe(root);
  resize();
  document.fonts.ready.then(measure);
  // Canvas only uses a web font once it is loaded; the notes' hand font is never used by the DOM.
  document.fonts.load("400 28px Caveat").catch(() => {});
  raf = requestAnimationFrame(tick);

  return {
    reveal() {
      revealStart = performance.now();
    },
    showSection(label, title, block) {
      const now = performance.now();
      const rolls = label !== section && section !== '' && !calm;
      // Notes wait for the number to clear, then the reading delay.
      annotator.setBlock(block, now, tokens.noteDelay + (rolls ? tokens.duration : 0));
      if (label === section) return;
      const from = section;
      section = label;
      // The first section is set silently; later changes roll the number (skipped under reduced motion).
      if (!rolls) return;
      count = { from, to: label, title, start: now };
    },
    resetSection() {
      section = '';
      count = null;
      annotator.setBlock(null, performance.now(), 0);
    },
    setSceneOverride(next) {
      override = next;
    },
    measure,
    setCalm(next) { calm = next; },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', resize);
      observer.disconnect();
      texture.dispose(); sizeTexture.dispose(); notesTexture.dispose(); material.dispose(); grainMaterial.dispose();
      renderer.dispose(); grainRenderer.dispose();
      stage.remove(); grainLayer.remove();
    },
  };
}
