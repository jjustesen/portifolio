// Public tokens: one vocabulary shared by the sequence, material and typography.
// Defaults were refined in the motion-system mockup (portfolio/mockups).

import type { AnnotationStyle } from './annotations';

export type Background = 'fog' | 'ring';

export interface MotionTokens {
  background: Background;
  /** Margin notes style (placeholders to compare directions). */
  annotations: AnnotationStyle;
  /** Seconds after a block settles before its notes start writing. */
  noteDelay: number;
  ringRadius: number;
  ringGlow: number;
  caustics: number;
  bgPointer: number;
  grain: number;
  grainSize: number;
  pointer: number;
  dissolve: number;
  chroma: number;
  duration: number;
  /** Liquid float of the text, in ~px of drift (0 = still). */
  liquid: number;
  /** Section magnet: scroll past this fraction of the viewport height to switch block (0 = off). */
  magnet: number;
  pointerRadius: number;
  pointerLag: number;
  maxDpr: number;
}

export const DEFAULT_TOKENS: MotionTokens = {
  background: 'ring',
  annotations: 'contact',
  noteDelay: 2.4,
  ringRadius: 0.7,
  ringGlow: 2,
  caustics: 0,
  bgPointer: 0.3,
  grain: 0.28,
  grainSize: 2.5,
  pointer: 4,
  dissolve: 0.9,
  chroma: 0.45,
  duration: 1.6,
  liquid: 1.5,
  magnet: 0.18,
  pointerRadius: 0.19,
  pointerLag: 7,
  maxDpr: 1.5,
};

export type SliderKey = Exclude<keyof MotionTokens, 'background' | 'annotations' | 'pointerRadius' | 'pointerLag' | 'maxDpr'>;

export interface SliderSpec {
  key: SliderKey;
  label: string;
  min: number;
  max: number;
  step: number;
  /** Only shown for this background. */
  background?: Background;
}

export const SLIDERS: SliderSpec[] = [
  { key: 'ringRadius', label: 'Anel / tamanho', min: 0.2, max: 1, step: 0.01, background: 'ring' },
  { key: 'ringGlow', label: 'Anel / brilho', min: 0, max: 3, step: 0.05, background: 'ring' },
  { key: 'caustics', label: 'Cáusticas', min: 0, max: 2, step: 0.05, background: 'ring' },
  { key: 'bgPointer', label: 'Mouse / fundo', min: 0, max: 3, step: 0.05 },
  { key: 'grain', label: 'Grão', min: 0, max: 1, step: 0.01 },
  { key: 'grainSize', label: 'Tamanho do grão', min: 1, max: 6, step: 0.25 },
  { key: 'pointer', label: 'Interferência do mouse', min: 0, max: 6, step: 0.05 },
  { key: 'dissolve', label: 'Dissolve / scroll', min: 0, max: 1.5, step: 0.05 },
  { key: 'chroma', label: 'Cromático / mouse', min: 0, max: 1, step: 0.05 },
  { key: 'liquid', label: 'Líquido', min: 0, max: 4, step: 0.05 },
  { key: 'magnet', label: 'Ímã / limiar de troca', min: 0, max: 0.5, step: 0.01 },
  { key: 'duration', label: 'Número da seção (s)', min: 0.6, max: 4, step: 0.1 },
  { key: 'noteDelay', label: 'Anotações / atraso (s)', min: 0, max: 8, step: 0.1 },
];
