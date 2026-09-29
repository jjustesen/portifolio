import { useEffect, useRef } from 'react';

// Only for a real mouse: touch screens have no cursor to follow.
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
// How quickly the ring catches up with the pointer (higher = tighter).
const FOLLOW = 12;
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label';

/** A ring around the cursor that trails slightly behind it and grows over links and buttons. */
export function CursorRing() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ref.current;
    if (!ring || !finePointer.matches) return;
    let x = -100, y = -100, tx = -100, ty = -100, last = 0, raf = 0, seen = false;

    const tick = (ms: number) => {
      const dt = Math.min((ms - last) / 1000 || 0.016, 0.05);
      last = ms;
      const k = reducedMotion.matches ? 1 : 1 - Math.exp(-FOLLOW * dt);
      x += (tx - x) * k;
      y += (ty - y) * k;
      ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      // Rest once it has caught up; the next move wakes it again.
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => {
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY;
      // First move: appear under the pointer instead of flying in from the corner.
      if (!seen) { seen = true; x = tx; y = ty; }
      ring.classList.add('visible');
      ring.classList.toggle('hover', !!(e.target as Element | null)?.closest?.(INTERACTIVE));
      wake();
    };
    const onLeave = () => ring.classList.remove('visible');
    const onDown = () => ring.classList.add('pressed');
    const onUp = () => ring.classList.remove('pressed');

    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerdown', onDown, { passive: true });
    addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerdown', onDown);
      removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="cursor-ring" aria-hidden="true">
      <span />
    </div>
  );
}
