import { useTimer } from '../core/useTimer';
import { MEDITATION_TIMER_KEY } from '../utils/storage';
import { playGong } from '../utils/gong';

interface Props {
  onFinish: () => void;
  durationMs: number;
}

export function Meditation({ onFinish, durationMs }: Props) {
  const timer = useTimer({
    storageKey: MEDITATION_TIMER_KEY,
    defaultDurationMs: durationMs,
    onFinish: playGong,
  });

  // The button press is the user gesture that lets the AudioContext start.
  // The gong opens the minute; resuming after a pause does not need a second one.
  const begin = () => {
    if (timer.status === 'idle') playGong();
    timer.start();
  };

  return (
    <div className="screen screen--meditation">
      <header className="screen-header">
        <h1 className="display">Take a moment before you begin your day.</h1>
        <p className="lede">
          {timer.isFinished
            ? 'Whenever you are ready.'
            : 'One minute. Let your eyes close if they want to.'}
        </p>
      </header>

      <div className="breath" aria-hidden="true">
        <span className={`breath-circle${timer.isRunning ? ' breath-circle--active' : ''}`} />
      </div>

      <div className="timer timer--large" role="timer" aria-label="Time left">
        {timer.display}
      </div>

      <div className="actions actions--stack">
        {!timer.isFinished &&
          (timer.isRunning ? (
            <button type="button" className="button button--quiet" onClick={timer.pause}>
              Pause
            </button>
          ) : (
            <button type="button" className="button button--primary" onClick={begin}>
              {timer.status === 'idle' ? 'Begin' : 'Resume'}
            </button>
          ))}

        <button
          type="button"
          className={`button ${timer.isFinished ? 'button--primary' : 'button--quiet'}`}
          onClick={onFinish}
        >
          {timer.isFinished ? 'Finish' : 'Skip meditation'}
        </button>
      </div>
    </div>
  );
}
