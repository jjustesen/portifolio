import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { site } from '../content/portfolio';
import { NOTE_COLOR, sketchArrow } from '../motion/annotations';

// Margin note under the sound toggle, in the same grease pencil as the section notes.
// The control point sits straight below the tip, so the arrow arrives pointing up at the button.
const NUDGE_ARROW = sketchArrow([118, 62], [150, 6], 7, -0.28);

function SoundNote() {
  return (
    <svg className="sound-note" viewBox="0 0 190 104" width="190" height="104" aria-hidden="true" style={{ color: NOTE_COLOR }}>
      <path className="sound-note-arrow" d={NUDGE_ARROW} pathLength={1} />
      <text className="sound-note-text" x="2" y="96" transform="rotate(-5 2 96)">
        too much? off here
      </text>
    </svg>
  );
}

interface SiteHeaderProps {
  sound: boolean;
  /** Highlight the toggle so a returning visitor can easily turn the sound off. */
  soundNudge: boolean;
  soundAvailable: boolean;
  onSoundToggle(): void;
}

export function SiteHeader({ sound, soundNudge, soundAvailable, onSoundToggle }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu on navigation and on Escape.
  useEffect(() => setOpen(false), [location.key]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={open ? 'site-header open' : 'site-header'} data-motion-ignore="">
      <Link to="/" className="site-name">
        {site.initials}
        <span className="site-name-full"> / {site.name.toUpperCase()}</span>
      </Link>
      <div className="header-actions">
        {soundAvailable && (
          <span className="sound-anchor">
            <button
              type="button"
              className={soundNudge ? 'sound-toggle nudge' : 'sound-toggle'}
              aria-pressed={sound}
              onClick={onSoundToggle}
            >
              <span className={sound ? 'sound-bars playing' : 'sound-bars'} aria-hidden="true">
                <i /><i /><i />
              </span>
              <span className="sound-label">{soundNudge ? 'TURN SOUND OFF' : sound ? 'SOUND ON' : 'SOUND OFF'}</span>
            </button>
            {soundNudge && <SoundNote />}
          </span>
        )}
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'CLOSE' : 'MENU'}
        </button>
      </div>
      <nav id="site-nav" aria-label="Sections">
        {site.nav.map((link) => (
          <Link key={link.href} to={link.href}>
            {link.label.toUpperCase()}
          </Link>
        ))}
      </nav>
    </header>
  );
}
