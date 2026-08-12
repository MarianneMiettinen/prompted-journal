import { getNoise, withAudio } from './audio';

/**
 * Small interface sounds, synthesised rather than loaded — no files, no requests.
 * Everything here is deliberately quiet: this is a calm morning app, and a sound that
 * makes someone flinch at 7am is worse than no sound at all.
 */

/** Shapes a burst of noise through a filter with a short envelope. The basis of all three. */
function burst(
  ac: AudioContext,
  {
    type,
    frequency,
    q = 1,
    gain,
    attack,
    duration,
    sweepTo,
  }: {
    type: BiquadFilterType;
    frequency: number;
    q?: number;
    gain: number;
    attack: number;
    duration: number;
    sweepTo?: number;
  },
): void {
  const now = ac.currentTime;

  const source = ac.createBufferSource();
  source.buffer = getNoise(ac);
  // Start somewhere random in the buffer so repeated sounds don't phase into a tone.
  const offset = Math.random() * (source.buffer.duration - duration - 0.05);

  const filter = ac.createBiquadFilter();
  filter.type = type;
  filter.Q.setValueAtTime(q, now);
  filter.frequency.setValueAtTime(frequency, now);
  if (sweepTo !== undefined) {
    filter.frequency.exponentialRampToValueAtTime(sweepTo, now + duration);
  }

  const envelope = ac.createGain();
  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.exponentialRampToValueAtTime(gain, now + attack);
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  source.connect(filter);
  filter.connect(envelope);
  envelope.connect(ac.destination);

  source.start(now, Math.max(0, offset), duration + 0.05);
  source.stop(now + duration + 0.05);
}

let lastTap = 0;

/** A soft tap for buttons. Throttled, so a fast double-click doesn't stack. */
export function playTap(): void {
  const now = performance.now();
  if (now - lastTap < 60) return;
  lastTap = now;

  withAudio((ac) => {
    burst(ac, { type: 'bandpass', frequency: 1700, q: 1.1, gain: 0.05, attack: 0.002, duration: 0.05 });
  });
}

/** A page turning, for finishing a piece of writing. */
export function playPageTurn(): void {
  withAudio((ac) => {
    // Two overlapping sweeps: the lift of the page, then it settling down.
    burst(ac, {
      type: 'bandpass',
      frequency: 900,
      q: 0.7,
      gain: 0.07,
      attack: 0.05,
      duration: 0.26,
      sweepTo: 3200,
    });
    window.setTimeout(() => {
      withAudio((inner) => {
        burst(inner, {
          type: 'bandpass',
          frequency: 2600,
          q: 0.6,
          gain: 0.05,
          attack: 0.02,
          duration: 0.22,
          sweepTo: 700,
        });
      });
    }, 150);
  });
}

let lastStroke = 0;

/** A pen on paper, per keystroke. Very quiet, and varied so it doesn't become a rattle. */
export function playPenStroke(): void {
  const now = performance.now();
  if (now - lastStroke < 45) return;
  lastStroke = now;

  withAudio((ac) => {
    burst(ac, {
      type: 'highpass',
      frequency: 2200 + Math.random() * 1400,
      q: 0.5,
      gain: 0.016 + Math.random() * 0.012,
      attack: 0.003,
      duration: 0.03 + Math.random() * 0.025,
    });
  });
}
