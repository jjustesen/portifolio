import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { ControlPanel } from './components/ControlPanel';
import { SiteHeader } from './components/SiteHeader';
import { MotionContext } from './motion/context';
import { createMotionEngine, type MotionEngine, type SceneOverride } from './motion/engine';
import { createMagnet } from './motion/magnet';
import { DEFAULT_TOKENS, type MotionTokens } from './motion/tokens';
import { Home } from './pages/Home';
import { ProjectPage } from './pages/ProjectPage';

// Tuning panel in development, or in production with ?controls.
const SHOW_CONTROLS = import.meta.env.DEV || new URLSearchParams(location.search).has('controls');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const PROJECT_SCENE: SceneOverride = { ringGlow: 0, ringRadius: 1, chroma: 0.15, pointer: 1, grain: 0.05 };
// Home sections that shift the scene while current, keyed by data-magnet number; others use the tokens.
const SECTION_SCENES: Record<string, SceneOverride> = {
  '01': { ringRadius: 0.7, ringGlow: 2 },
  '02': { ringRadius: 0.8, ringGlow: 3 },
  '03': { ringRadius: 0.6, ringGlow: 0.5 },
  '04': { ringRadius: 0.7, ringGlow: 2 },
  '05': { ringRadius: 0.75, ringGlow: 0.5 },
  '06': { ringRadius: 0.2, ringGlow: 0.2 },
  '07': { ringGlow: 0.75, ringChroma: 1 },
};

export function App() {
  const mainRef = useRef<HTMLElement>(null);
  const engineRef = useRef<MotionEngine | null>(null);
  const magnetRef = useRef<ReturnType<typeof createMagnet> | null>(null);
  const tokensRef = useRef<MotionTokens>({ ...DEFAULT_TOKENS });
  const calmRef = useRef(reducedMotion.matches);
  const [webgl, setWebgl] = useState(true);
  const [status, setStatus] = useState('SCROLL PARA LER / MOUSE PARA INTERFERIR');
  const [calm, setCalm] = useState(reducedMotion.matches);
  const { pathname, hash } = useLocation();
  calmRef.current = calm;

  useEffect(() => {
    const engine = createMotionEngine({ root: mainRef.current!, tokens: tokensRef.current, calm: calmRef.current });
    if (!engine) {
      setWebgl(false);
      setStatus('MODO DE LEITURA / WEBGL INDISPONÍVEL');
    }
    engineRef.current = engine;
    // Section magnet; each change of block label rolls the section number on screen.
    const magnet = createMagnet({
      tokens: tokensRef.current,
      isActive: () => !calmRef.current,
      onSection: (label, title, block) => {
        engineRef.current?.showSection(label, title, block);
        // Only home blocks carry data-magnet, so this never overrides the project-page scene.
        engineRef.current?.setSceneOverride(SECTION_SCENES[label] ?? null);
      },
    });
    magnetRef.current = magnet;
    const onReducedChange = (e: MediaQueryListEvent) => setCalm(e.matches);
    reducedMotion.addEventListener('change', onReducedChange);
    return () => {
      reducedMotion.removeEventListener('change', onReducedChange);
      magnet.dispose();
      engine?.dispose();
      engineRef.current = null;
      magnetRef.current = null;
    };
  }, []);

  useEffect(() => engineRef.current?.setCalm(calm), [calm]);

  // Project pages are the practical view: no magnet or section numbers (their blocks carry no
  // data-magnet), the ring fades out while expanding, and pointer interference and chroma soften.
  const isProjectPage = pathname.startsWith('/work/');
  useEffect(() => {
    engineRef.current?.setSceneOverride(isProjectPage ? PROJECT_SCENE : null);
  }, [isProjectPage]);

  // New page: start at the top (unless heading to an anchor), re-read the text and reveal it.
  const firstRender = useRef(true);
  useLayoutEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' });
    engineRef.current?.resetSection();
    engineRef.current?.measure();
    engineRef.current?.reveal();
    magnetRef.current?.reset();
  }, [pathname]);

  return (
    <MotionContext.Provider value={{ calm }}>
      <div className={webgl ? 'app webgl' : 'app'}>
        <SiteHeader />
        <main ref={mainRef}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work/:slug" element={<ProjectPage />} />
            <Route path="*" element={<ProjectPage />} />
          </Routes>
        </main>
        {SHOW_CONTROLS && webgl && (
          <ControlPanel
            tokens={tokensRef.current}
            calm={calm}
            onCalmChange={setCalm}
            onReplay={() => engineRef.current?.reveal()}
            onStatus={setStatus}
          />
        )}
        {/* Tuning feedback (Portuguese, like the panel): development/tuning only, never for visitors. */}
        {SHOW_CONTROLS && (
          <output className="status" aria-live="polite">
            {status}
          </output>
        )}
      </div>
    </MotionContext.Provider>
  );
}
