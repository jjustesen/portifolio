import { useState } from 'react';
import type { AnnotationStyle } from '../motion/annotations';
import { SLIDERS, type Background, type MotionTokens } from '../motion/tokens';

interface ControlPanelProps {
  /** Live tokens read by the engine every frame. */
  tokens: MotionTokens;
  calm: boolean;
  onCalmChange(calm: boolean): void;
  onReplay(): void;
  onStatus(status: string): void;
}

/** Tuning panel: every value is visible and can be copied to become the new default. */
export function ControlPanel({ tokens, calm, onCalmChange, onReplay, onStatus }: ControlPanelProps) {
  const [values, setValues] = useState<MotionTokens>({ ...tokens });

  function update<K extends keyof MotionTokens>(key: K, value: MotionTokens[K]) {
    tokens[key] = value;
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function copyValues() {
    const keys = ['background', 'annotations', ...SLIDERS.map((s) => s.key)];
    const json = JSON.stringify(Object.fromEntries(keys.map((k) => [k, tokens[k as keyof MotionTokens]])));
    try {
      await navigator.clipboard.writeText(json);
      onStatus('VALORES COPIADOS');
    } catch {
      onStatus(json);
    }
  }

  return (
    <details className="controls" data-motion-ignore="">
      <summary>AJUSTAR SISTEMA ＋</summary>
      <label>
        Fundo
        <select value={values.background} onChange={(e) => update('background', e.target.value as Background)}>
          <option value="fog">Névoa</option>
          <option value="ring">Anel de luz</option>
        </select>
      </label>
      <label>
        Anotações
        <select value={values.annotations} onChange={(e) => update('annotations', e.target.value as AnnotationStyle)}>
          <option value="contact">Folha de contato</option>
          <option value="code">Code review</option>
          <option value="machine">Notas da máquina</option>
          <option value="off">Desligadas</option>
        </select>
      </label>
      {SLIDERS.filter((s) => !s.background || s.background === values.background).map((s) => (
        <label key={s.key}>
          {s.label}
          <span className="value">{values[s.key]}</span>
          <input
            type="range"
            min={s.min}
            max={s.max}
            step={s.step}
            value={values[s.key]}
            onChange={(e) => update(s.key, Number(e.target.value))}
          />
        </label>
      ))}
      <label>
        <input type="checkbox" checked={calm} onChange={(e) => onCalmChange(e.target.checked)} /> Movimento reduzido
      </label>
      <button type="button" onClick={onReplay}>
        REPETIR REVELAÇÃO ↻
      </button>
      <button type="button" onClick={copyValues}>
        COPIAR VALORES ⧉
      </button>
    </details>
  );
}
