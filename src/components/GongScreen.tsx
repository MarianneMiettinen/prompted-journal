import { useTimer } from '../core/useTimer';
import { MEDITATION_TIMER_KEY } from '../utils/storage';
import { playGong } from '../utils/gong';
import { WizardSays } from './Wizard';

interface Props {
  onComplete: () => void;
  durationMs: number;
}

export function GongScreen({ onComplete, durationMs }: Props) {
  const timer = useTimer({
    storageKey: MEDITATION_TIMER_KEY,
    defaultDurationMs: durationMs,
    onFinish: playGong,
  });

  // The strike is the user gesture that unlocks audio, so the gong can sound at the end too.
  const strike = () => {
    playGong();
    timer.start();
  };

  const glowing = timer.isRunning || timer.isFinished;

  return (
    <div className={`screen screen--gong${glowing ? ' screen--gong-lit' : ''}`}>
      <div className="gong-head">
        <p className={`eyebrow${glowing ? ' eyebrow--violet' : ''}`}>
          {timer.isFinished
            ? 'Complete ✦'
            : timer.isRunning
              ? 'Hold the vibration'
              : 'Aldric needs your help'}
        </p>
        <p className="gong-time">{timer.display}</p>
      </div>

      <div className="gong-stage">
        <div className="gong-aura" aria-hidden="true" />
        {glowing && (
          <>
            <span className="gong-ripple gong-ripple--1" aria-hidden="true" />
            <span className="gong-ripple gong-ripple--2" aria-hidden="true" />
            <span className="gong-ripple gong-ripple--3" aria-hidden="true" />
          </>
        )}
        <img
          className="gong-image"
          src="/gong.png"
          alt="A great gong on a mountain of crystals, drawn in pencil"
        />
      </div>

      <div className="gong-foot">
        {timer.status === 'idle' && (
          <WizardSays>
            I am weaving a powerful spell, but I cannot hold the vibration alone. Sit with the
            gong a while — your stillness is the magic.
          </WizardSays>
        )}

        {timer.isRunning && <p className="gong-breathe">Breathe. Be still.</p>}

        {timer.isFinished ? (
          <button type="button" className="button button--primary button--wide" onClick={onComplete}>
            See what formed →
          </button>
        ) : timer.isRunning ? (
          <button type="button" className="button button--ghost button--wide" onClick={timer.pause}>
            Pause
          </button>
        ) : (
          <>
            <button type="button" className="button button--primary button--wide" onClick={strike}>
              {timer.status === 'idle' ? 'Strike the gong ✦' : 'Resume'}
            </button>
            {timer.status === 'idle' && (
              <button type="button" className="button button--ghost button--wide" onClick={onComplete}>
                Skip for today
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
