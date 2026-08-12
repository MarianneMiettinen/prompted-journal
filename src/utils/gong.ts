type AudioContextCtor = typeof AudioContext;

let ctx: AudioContext | null = null;

/**
 * Created lazily so it is only ever constructed inside a user gesture — browsers
 * block (or immediately suspend) an AudioContext made on page load.
 */
function getContext(): AudioContext | null {
  if (ctx) return ctx;
  const w = window as unknown as {
    AudioContext?: AudioContextCtor;
    webkitAudioContext?: AudioContextCtor;
  };
  const Ctor = w.AudioContext ?? w.webkitAudioContext;
  if (!Ctor) return null;
  try {
    ctx = new Ctor();
  } catch {
    return null;
  }
  return ctx;
}

/** Inharmonic partials with unequal decay times — that unevenness is what reads as "gong". */
const PARTIALS = [
  { ratio: 1, gain: 0.5, decay: 7 },
  { ratio: 2.01, gain: 0.26, decay: 5.2 },
  { ratio: 2.97, gain: 0.16, decay: 4 },
  { ratio: 4.19, gain: 0.1, decay: 2.6 },
  { ratio: 5.43, gain: 0.06, decay: 1.8 },
  { ratio: 7.08, gain: 0.035, decay: 1.2 },
];

const BASE_HZ = 110;

/** Soft, slow-decaying gong. Safe to call when audio is unavailable — it just does nothing. */
export function playGong(): void {
  const ac = getContext();
  if (!ac) return;

  const strike = () => {
    const now = ac.currentTime;

    const master = ac.createGain();
    master.gain.setValueAtTime(0.28, now);

    // Sweeping the lowpass down over the tail takes the edge off without muffling the attack.
    const tone = ac.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.setValueAtTime(2600, now);
    tone.frequency.exponentialRampToValueAtTime(420, now + 6);

    tone.connect(master);
    master.connect(ac.destination);

    for (const p of PARTIALS) {
      const osc = ac.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(BASE_HZ * p.ratio, now);
      osc.detune.setValueAtTime(Math.random() * 8 - 4, now);

      const env = ac.createGain();
      env.gain.setValueAtTime(0.0001, now);
      env.gain.exponentialRampToValueAtTime(p.gain, now + 0.015);
      env.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

      osc.connect(env);
      env.connect(tone);
      osc.start(now);
      osc.stop(now + p.decay + 0.1);
    }
  };

  if (ac.state === 'suspended') {
    ac.resume().then(strike).catch(() => undefined);
  } else {
    strike();
  }
}
