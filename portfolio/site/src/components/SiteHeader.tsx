import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { site } from '../content/portfolio';

export function SiteHeader() {
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
      <button
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'CLOSE' : 'MENU'}
      </button>
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
