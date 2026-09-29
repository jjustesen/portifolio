import type { MotionTokens } from './tokens';

interface MagnetOptions {
  /** Live tokens; `magnet` is the switch threshold as a fraction of the viewport height (0 = off). */
  tokens: MotionTokens;
  /** The magnet only pulls while this returns true (motion allowed). */
  isActive(): boolean;
  /** Called with the block's data-magnet number, data-magnet-title and element whenever the current block changes. */
  onSection(label: string, title: string, block: Element): void;
}

/** Scroll positions where a block sits in place: one for short blocks, a free range for tall ones. */
interface Stop {
  /** The blocks of one section: consecutive [data-magnet] elements sharing a label (e.g. the projects). */
  els: HTMLElement[];
  label: string;
  title: string;
  min: number;
  max: number;
}

// Where a short block's center lands: slightly above the middle, clear of the bottom dissolve.
const ANCHOR = 0.46;
// Blocks taller than this share of the viewport can be read freely between their edges.
const TALL = 0.9;
const EDGE_TOP = 0.08;
const EDGE_BOTTOM = 0.92;
const IDLE_MS = 110;
// Touch scrolling coasts on momentum with sparse scroll events: wait longer before settling.
const IDLE_TOUCH_MS = 220;

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * Paged magnet over the [data-magnet] blocks. There is always a current block: when scrolling
 * settles within the threshold of it, it pulls back; past the threshold, the next block in that
 * direction is pulled into place. Tall blocks are free to read between their edges. Any user
 * input cancels a pull in progress.
 */
export function createMagnet({ tokens, isActive, onSection }: MagnetOptions) {
  let idle = 0;
  let raf = 0;
  let animating = false;
  let current = -1;
  let focus: Element | null = null;
  // Scroll position where the current block was last settled (or established): stepping to the
  // neighbour needs the reader to have actually scrolled that far away from it.
  let settledY = 0;
  // A finger is on the screen: the reader is still steering, so never pull under it.
  let touching = false;
  // The last scroll came from a touch gesture (or its momentum).
  let touchScroll = false;

  function stops(): Stop[] {
    const vh = innerHeight, maxScroll = document.documentElement.scrollHeight - vh;
    const fit = (y: number) => Math.max(0, Math.min(maxScroll, y));
    // The magnet moves between whole sections: blocks that share a label form one stop.
    const groups: HTMLElement[][] = [];
    for (const el of document.querySelectorAll<HTMLElement>('[data-magnet]')) {
      const group = groups[groups.length - 1];
      if (group && group[0].dataset.magnet === el.dataset.magnet) group.push(el);
      else groups.push([el]);
    }
    return groups.map((els) => {
      const el = els[0], end = els[els.length - 1];
      const first = el.firstElementChild ?? el, last = end.lastElementChild ?? end;
      const top = first.getBoundingClientRect().top + scrollY, bottom = last.getBoundingClientRect().bottom + scrollY;
      const label = el.dataset.magnet ?? '', title = el.dataset.magnetTitle ?? '';
      if (bottom - top <= vh * TALL) {
        const y = fit((top + bottom) / 2 - vh * ANCHOR);
        return { els, label, title, min: y, max: y };
      }
      return { els, label, title, min: fit(top - vh * EDGE_TOP), max: fit(bottom - vh * EDGE_BOTTOM) };
    });
  }

  /** Signed distance from a stop to the scroll position (0 inside a tall block's range). */
  const offset = (stop: Stop, y: number) => (y < stop.min ? y - stop.min : y > stop.max ? y - stop.max : 0);

  function nearest(list: Stop[], y: number) {
    let best = 0;
    list.forEach((stop, i) => { if (Math.abs(offset(stop, y)) < Math.abs(offset(list[best], y))) best = i; });
    return best;
  }

  /** The block of a stop the reader is looking at (for its margin notes), at scroll position y. */
  function focusOf(stop: Stop, y: number) {
    const anchor = y + innerHeight * ANCHOR;
    let best = stop.els[0], bestDistance = Infinity;
    for (const el of stop.els) {
      const r = el.getBoundingClientRect(), top = r.top + scrollY, bottom = r.bottom + scrollY;
      const distance = anchor < top ? top - anchor : anchor > bottom ? anchor - bottom : 0;
      if (distance < bestDistance) { best = el; bestDistance = distance; }
    }
    return best;
  }

  function setCurrent(index: number, list: Stop[], y: number) {
    const stop = list[index], block = focusOf(stop, y);
    if (index === current && block === focus) return;
    current = index;
    focus = block;
    onSection(stop.label, stop.title, block);
  }

  function cancel() {
    if (!animating) return;
    cancelAnimationFrame(raf);
    animating = false;
  }

  function pull(to: number) {
    const from = scrollY, delta = to - from;
    if (Math.abs(delta) < 2) return;
    const duration = Math.min(950, Math.max(500, Math.abs(delta) * 1.1));
    const t0 = performance.now();
    animating = true;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      window.scrollTo({ top: from + delta * easeOutQuart(t), behavior: 'instant' });
      if (t < 1 && animating) raf = requestAnimationFrame(step);
      else animating = false;
    };
    raf = requestAnimationFrame(step);
  }

  function settle() {
    const list = stops();
    if (list.length === 0) return;
    const y = scrollY;
    if (current < 0 || current >= list.length) { current = nearest(list, y); focus = null; settledY = y; }
    const off = offset(list[current], y);
    const threshold = tokens.magnet * innerHeight;
    const found = nearest(list, y);
    let next = current;
    if (off === 0 || (Math.abs(off) <= threshold && isActive() && threshold > 0)) {
      next = current; // Within the threshold: stay (and pull back).
    } else if (found !== current || !isActive() || threshold <= 0) {
      next = found;
    } else if (Math.abs(y - settledY) > threshold) {
      // Still nearest to the current block, but the reader scrolled past the threshold: step on.
      next = Math.max(0, Math.min(list.length - 1, current + Math.sign(off)));
    }
    const stop = list[next];
    const target = y < stop.min ? stop.min : y > stop.max ? stop.max : y;
    setCurrent(next, list, target);
    settledY = target;
    if (!isActive() || threshold <= 0) return;
    pull(target);
  }

  /** Settle only once scrolling is really at rest: momentum can still be moving between events. */
  function settleWhenStill() {
    if (touching) return;
    const y = scrollY;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (touching || animating) return;
      if (Math.abs(scrollY - y) > 0.5) schedule();
      else settle();
    }));
  }

  function schedule() {
    clearTimeout(idle);
    idle = window.setTimeout(settleWhenStill, touchScroll ? IDLE_TOUCH_MS : IDLE_MS);
  }

  const onScroll = () => {
    if (animating || touching) return;
    schedule();
  };
  const onInput = (e: Event) => {
    cancel();
    clearTimeout(idle);
    if (e.type === 'touchstart' || e.type === 'touchmove') { touching = true; touchScroll = true; }
    else if (e.type === 'wheel' || e.type === 'keydown') touchScroll = false;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (e.touches.length > 0) return;
    touching = false;
    schedule();
  };
  const inputs = ['wheel', 'touchstart', 'touchmove', 'keydown', 'pointerdown'] as const;
  const touchEnds = ['touchend', 'touchcancel'] as const;

  // A hidden tab stops animation frames; drop the pull instead of leaving it stuck.
  const onVisibility = () => {
    if (!document.hidden) return;
    cancel();
    clearTimeout(idle);
    touching = false;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  for (const type of inputs) window.addEventListener(type, onInput, { passive: true });
  for (const type of touchEnds) window.addEventListener(type, onTouchEnd, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  // Establish the starting block without pulling.
  function establish() {
    requestAnimationFrame(() => {
      const list = stops();
      if (!list.length) return;
      setCurrent(nearest(list, scrollY), list, scrollY);
      settledY = scrollY;
    });
  }
  establish();

  return {
    /** New page: forget the current block and pick the one in view. */
    reset() {
      cancel();
      clearTimeout(idle);
      current = -1;
      focus = null;
      establish();
    },
    dispose() {
      cancel();
      clearTimeout(idle);
      window.removeEventListener('scroll', onScroll);
      for (const type of inputs) window.removeEventListener(type, onInput);
      for (const type of touchEnds) window.removeEventListener(type, onTouchEnd);
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}
