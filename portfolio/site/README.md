# Johannes Justesen — portfolio

React + Vite + TypeScript. The motion system from `../mockups/motion-system.html` runs as a
full-screen WebGL layer that redraws the page text through a shader.

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build in dist/
```

## Where things live

- `src/content/portfolio.ts` — all copy (follows `../docs/ideia-base.md`). Items marked `TODO` need real CV data.
- `src/pages/` — `Home` (the sections) and `ProjectPage` (`/work/:slug`, one per Selected work project).
  Hosting needs an SPA fallback (serve `index.html` for unknown paths) so `/work/...` URLs load directly.
- `src/sections/` — one component per home section, in the order of the idea doc.
- `src/components/FlagPreview.tsx` — hover preview for Selected work projects: a WebGL cloth that follows the
  cursor and trails/ripples with its motion. Images come from each project's `preview` (placeholders in
  `public/previews/`, replace with real square screenshots).
- `public/demos/auramind/` — animated English recreation of the Auramind screens (chat, app editor, app
  gallery), embedded as iframes on `/work/auramind` via each project's `page.media` (`kind: 'demo'`).
  Open `/demos/auramind/index.html` for the player with controls; `?clean#chat|editor|gallery` shows one
  scene without controls (used by the page, and handy for recording).
- `public/demos/vocabnode/` — the same for Vocab Node (`#call`, `#lesson`, `#task`), embedded on `/work/vocab-node`.
- `public/demos/moita/` — the same for Moita (`#record`, `#speakers`, `#tasks`), embedded on `/work/moita`.
- `src/components/Ink.tsx` — wrap text in `<Ink>` to have the shader draw it (dissolve, trails, pointer
  interference). Plain text only; `"\n"` becomes a line break. Links and buttons stay regular DOM.
- `src/motion/tokens.ts` — motion defaults and the tuning-panel sliders.
- `src/motion/shaders.ts` — background (fog / light ring), text effects and grain.
- `src/motion/engine.ts` — WebGL setup, text measuring and the intro sequence.
- `src/motion/magnet.ts` — paged magnet over `[data-magnet]` blocks: scroll less than the threshold and
  the current block pulls back; past it, the next one is pulled into place. The attribute value is the
  section number (`data-magnet="03"`) and `data-magnet-title` its name; when the number changes,
  "03 / Selected work" rolls on screen. Blocks sharing a
  number (the three projects) snap individually without repeating the number.

- `src/motion/annotations.ts` — margin notes that write themselves onto a block after the reader settles
  there. Three styles to compare (contact sheet, code review, machine notes); each block picks its notes
  by `data-notes`. The strokes are generated placeholders until real hand-drawn SVGs replace them.

## Tuning

The "Ajustar sistema" panel shows in development, or in production with `?controls` in the URL.
"Copiar valores" copies the current values as JSON — paste them into `DEFAULT_TOKENS` to make them the default.
