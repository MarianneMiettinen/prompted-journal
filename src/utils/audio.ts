type AudioContextCtor = typeof AudioContext;

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

/**
 * One AudioContext for the whole app, created lazily so it is only ever constructed inside a
 * user gesture — browsers block (or immediately suspend) one made on page load.
 */
export function getAudioContext(): AudioContext | null {
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

/** Two seconds of white noise, made once and reused — the basis of every non-tonal sound. */
export function getNoise(ac: AudioContext): AudioBuffer {
  if (noise && noise.sampleRate === ac.sampleRate) return noise;
  const frames = Math.floor(ac.sampleRate * 2);
  const buffer = ac.createBuffer(1, frames, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i += 1) data[i] = Math.random() * 2 - 1;
  noise = buffer;
  return buffer;
}

/**
 * Runs `play` with a live context. A suspended context is resumed first, which is what
 * happens on the very first sound of a session.
 */
export function withAudio(play: (ac: AudioContext) => void): void {
  const ac = getAudioContext();
  if (!ac) return;
  if (ac.state === 'suspended') {
    ac.resume()
      .then(() => play(ac))
      .catch(() => undefined);
    return;
  }
  try {
    play(ac);
  } catch {
    // A sound is never worth breaking the ritual over.
  }
}
