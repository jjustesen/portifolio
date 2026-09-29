import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { site } from '../content/portfolio';

interface SiteHeaderProps {
  sound: boolean;
  soundAvailable: boolean;
  onSoundToggle(): void;
}

export function SiteHeader({ sound, soundAvailable, onSoundToggle }: SiteHeaderProps) {
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
          <button type="button" className="sound-toggle" aria-pressed={sound} onClick={onSoundToggle}>
            <span className={sound ? 'sound-bars playing' : 'sound-bars'} aria-hidden="true">
              <i /><i /><i />
            </span>
            <span className="sound-label">{sound ? 'SOUND ON' : 'SOUND OFF'}</span>
          </button>
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
