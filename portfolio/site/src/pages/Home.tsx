import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Capabilities } from '../sections/Capabilities';
import { Contact } from '../sections/Contact';
import { Experience } from '../sections/Experience';
import { Hero } from '../sections/Hero';
import { Lab } from '../sections/Lab';
import { Manifesto } from '../sections/Manifesto';
import { Process } from '../sections/Process';
import { SelectedWork } from '../sections/SelectedWork';

export function Home() {
  // `key` changes on every navigation, so clicking the same anchor again still scrolls.
  const { hash, key } = useLocation();

  // Arriving with a section anchor (e.g. /#work from a project page) jumps to it once fonts have
  // settled the layout. The jump is instant: a long smooth scroll could pause mid-way and let the
  // magnet grab a section in between; from the anchor, the magnet does the short centering glide.
  useEffect(() => {
    if (!hash) return;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) document.querySelector(hash)?.scrollIntoView({ behavior: 'instant' });
    });
    return () => { cancelled = true; };
  }, [hash, key]);

  return (
    <>
      <Hero />
      <Manifesto />
      <SelectedWork />
      <Process />
      <Capabilities />
      <Experience />
      <Lab />
      <Contact />
    </>
  );
}
