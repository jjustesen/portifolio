// Generative ambient soundtrack (Web Audio, no files): a slow low pad, a soft tape hiss and
// sparse echoing notes. The chord drifts with the current section and scrolling briefly
// lifts the hiss, echoing the visual grain and scroll trails.

// Chords per home section as semitone offsets from D2; unknown sections keep the current one.
const ROOT = 73.42; // D2
const CHORDS: Record<string, number[]> = {
  '01': [0, 7, 12, 16],
  '02': [0, 7, 14, 19],
  '03': [-2, 5, 12, 17],
  '04': [0, 7, 12, 16],
  '05': [-4, 3, 10, 15],
  '06': [-5, 2, 9, 14],
  '07': [0, 7, 14, 21],
  '08': [0, 7, 12, 19],
};
const DEFAULT_CHORD = CHORDS['01'];
// Pentatonic degrees (semitones above D4) for the sparse notes.
const BELL_NOTES = [0, 2, 4, 7, 9, 12, 14];
const BELL_ROOT = ROOT * 4;

const VOLUME = 0.32;
const FADE_IN = 3;
const FADE_OUT = 1.2;
const HISS = 0.028;

const hz = (base: number, semitones: number) => base * Math.pow(2, semitones / 12);

export interface Ambient {
  /** Starts (or resumes) playback with a fade in. Must follow a user gesture the first time. */
  play(): Promise<void>;
  /** Fades out and suspends the audio context. */
  pause(): void;
  /** True once the browser actually lets audio play. */
  isRunning(): boolean;
  /** Moves the pad to the chord of a home section. */
  setSection(label: string): void;
  dispose(): void;
}

export function createAmbient(): Ambient | null {
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;

  let ctx: AudioContext | null = null;
  let master: GainNode;
  let hiss: GainNode;
  let bellBus: GainNode;
  let voices: OscillatorNode[][] = [];
  let playing = false;
  let chord = DEFAULT_CHORD;
  let bellTimer = 0;
  let suspendTimer = 0;
  let lastScroll = scrollY;
  let lastTime = performance.now();

  function build() {
    ctx = new Ctx();
    const now = ctx.currentTime;
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // Pad: two slightly detuned oscillators per chord tone into a slowly breathing lowpass.
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 700;
    padFilter.Q.value = 0.4;
    const padGain = ctx.createGain();
    padGain.gain.value = 0.11;
    padFilter.connect(padGain).connect(master);
    const filterLfo = ctx.createOscillator();
    const filterDepth = ctx.createGain();
    filterLfo.frequency.value = 0.035;
    filterDepth.gain.value = 260;
    filterLfo.connect(filterDepth).connect(padFilter.frequency);
    filterLfo.start(now);

    voices = chord.map((step, i) => {
      const tone = ctx!.createGain();
      tone.gain.value = i === 0 ? 0.9 : 0.55;
      // Each tone swells on its own slow cycle so the chord never sits still.
      const swell = ctx!.createOscillator();
      const swellDepth = ctx!.createGain();
      swell.frequency.value = 0.05 + i * 0.017;
      swellDepth.gain.value = 0.3;
      swell.connect(swellDepth).connect(tone.gain);
      swell.start(now);
      tone.connect(padFilter);
      return [-4, 4].map((cents, j) => {
        const osc = ctx!.createOscillator();
        osc.type = j === 0 ? 'sine' : 'triangle';
        osc.frequency.value = hz(ROOT, step);
        osc.detune.value = cents;
        osc.connect(tone);
        osc.start(now);
        return osc;
      });
    });

    // Echo shared by the notes: a dark feedback delay.
    const delay = ctx.createDelay(2);
    delay.delayTime.value = 0.62;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.45;
    const damp = ctx.createBiquadFilter();
    damp.type = 'lowpass';
    damp.frequency.value = 1800;
    delay.connect(damp).connect(feedback).connect(delay);
    const wet = ctx.createGain();
    wet.gain.value = 0.5;
    damp.connect(wet).connect(master);
    bellBus = ctx.createGain();
    bellBus.connect(master);
    bellBus.connect(delay);

    // Hiss: looped pink noise, band-limited like old tape.
    const length = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.099046;
      b1 = 0.963 * b1 + white * 0.2965164;
      b2 = 0.57 * b2 + white * 1.0526913;
      data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.2;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 2400;
    band.Q.value = 0.5;
    const shelf = ctx.createBiquadFilter();
    shelf.type = 'highpass';
    shelf.frequency.value = 300;
    hiss = ctx.createGain();
    hiss.gain.value = HISS;
    noise.connect(shelf).connect(band).connect(hiss).connect(master);
    noise.start(now);
  }

  function bell() {
    if (!ctx || !playing) return;
    const now = ctx.currentTime;
    const note = BELL_NOTES[Math.floor(Math.random() * BELL_NOTES.length)];
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = hz(BELL_ROOT, note + chord[0]);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(0.05, now + 0.04);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 4);
    osc.connect(env).connect(bellBus);
    osc.start(now);
    osc.stop(now + 4.2);
    scheduleBell();
  }

  function scheduleBell() {
    clearTimeout(bellTimer);
    bellTimer = window.setTimeout(bell, 5000 + Math.random() * 9000);
  }

  // Scrolling lifts the hiss for a moment, like the trails in the text.
  const onScroll = () => {
    if (!ctx || !playing) return;
    const t = performance.now();
    const speed = Math.abs(scrollY - lastScroll) / Math.max(16, t - lastTime) / innerHeight * 1000;
    lastScroll = scrollY;
    lastTime = t;
    const lift = Math.min(1, speed * 0.6);
    const now = ctx.currentTime;
    hiss.gain.cancelScheduledValues(now);
    hiss.gain.setTargetAtTime(HISS * (1 + lift * 2.5), now, 0.08);
    hiss.gain.setTargetAtTime(HISS, now + 0.25, 0.6);
  };

  // Playback continues in a hidden tab; some browsers (iOS) still interrupt it, so pick it
  // back up when the page is visible again.
  const onVisibility = () => {
    if (ctx && playing && !document.hidden && ctx.state !== 'running') void ctx.resume();
  };

  addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);

  return {
    async play() {
      if (!ctx) build();
      clearTimeout(suspendTimer);
      playing = true;
      await ctx!.resume();
      const now = ctx!.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(VOLUME, now + FADE_IN);
      scheduleBell();
    },
    pause() {
      if (!ctx || !playing) return;
      playing = false;
      clearTimeout(bellTimer);
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + FADE_OUT);
      suspendTimer = window.setTimeout(() => { if (!playing) void ctx?.suspend(); }, FADE_OUT * 1000 + 100);
    },
    isRunning: () => playing && ctx?.state === 'running',
    setSection(label) {
      const next = CHORDS[label];
      if (!next || next === chord) return;
      chord = next;
      if (!ctx) return;
      // Glide slowly into the new chord.
      const now = ctx.currentTime;
      voices.forEach((pair, i) => pair.forEach((osc) => {
        osc.frequency.cancelScheduledValues(now);
        osc.frequency.setValueAtTime(osc.frequency.value, now);
        osc.frequency.setTargetAtTime(hz(ROOT, chord[i]), now, 1.4);
      }));
    },
    dispose() {
      clearTimeout(bellTimer);
      clearTimeout(suspendTimer);
      removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      void ctx?.close();
      ctx = null;
    },
  };
}
