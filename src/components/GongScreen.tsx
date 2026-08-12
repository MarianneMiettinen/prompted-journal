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
          {timer.isFinished ? 'Complete ✦' : timer.isRunning ? 'Meditating' : 'Meditate'}
        </p>
        <p className="gong-time">{timer.display}</p>
        {timer.status === 'idle' && (
          <p className="gong-instruction">
            Focus your attention on your breath. If you notice you have got distracted, just
            bring your attention back to the breath.
          </p>
        )}
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
            One minute of meditation. Strike the gong, close your eyes if you like, and follow
            your breath — the stillness is the magic.
          </WizardSays>
        )}

        {timer.isRunning && <p className="gong-breathe">Back to the breath.</p>}

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
              {timer.status === 'idle' ? 'Strike the gong to begin ✦' : 'Resume'}
            </button>
            {timer.status === 'idle' && (
              <button type="button" className="button button--ghost button--wide" onClick={onComplete}>
                Skip the meditation today
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
