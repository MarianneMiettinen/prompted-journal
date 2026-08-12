import { useCallback } from 'react';
import { useTimer } from '../core/useTimer';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { JOURNAL_TIMER_KEY } from '../utils/storage';
import { playGong } from '../utils/gong';

interface Props {
  prompt: string;
  text: string;
  updateText: (updater: (previous: string) => string) => void;
  onFinish: () => void;
  durationMs: number;
}

/** Joins a spoken chunk onto what is already written without eating the existing text. */
function appendSpoken(previous: string, chunk: string): string {
  if (!previous) return chunk;
  if (/\s$/.test(previous)) return previous + chunk;
  return `${previous} ${chunk}`;
}

export function Journal({ prompt, text, updateText, onFinish, durationMs }: Props) {
  const timer = useTimer({
    storageKey: JOURNAL_TIMER_KEY,
    defaultDurationMs: durationMs,
    onFinish: playGong,
  });

  const speech = useSpeechRecognition(
    useCallback(
      (chunk: string) => updateText((previous) => appendSpoken(previous, chunk)),
      [updateText],
    ),
  );

  const toggleVoice = () => (speech.listening ? speech.stop() : speech.start());

  const finish = () => {
    speech.stop();
    onFinish();
  };

  return (
    <div className="screen screen--journal">
      <header className="prompt-block">
        <p className="eyebrow">A question for you</p>
        <h1 className="prompt">{prompt}</h1>
      </header>

      <div className="writing">
        <label className="visually-hidden" htmlFor="journal-text">
          Your writing
        </label>
        <textarea
          id="journal-text"
          className="journal-field"
          value={text}
          placeholder="Start wherever you like…"
          onChange={(event) => {
            const { value } = event.target;
            updateText(() => value);
          }}
          autoComplete="off"
          spellCheck
        />
        {speech.interim && (
          <p className="interim" aria-live="polite">
            {speech.interim}
          </p>
        )}
      </div>

      {timer.isFinished && (
        <p className="notice" role="status">
          That's your time. Finish when you're ready — nothing is lost.
        </p>
      )}
      {speech.error && (
        <p className="notice notice--quiet" role="status">
          {speech.error}
        </p>
      )}
      {speech.hint && (
        <p className="notice notice--quiet" role="status">
          {speech.hint}
        </p>
      )}

      <div className="toolbar">
        <div className="timer" role="timer" aria-label="Time left">
          {timer.display}
        </div>

        <div className="toolbar-buttons">
          {speech.supported ? (
            <button
              type="button"
              className={`button button--quiet${speech.listening ? ' button--listening' : ''}`}
              onClick={toggleVoice}
              aria-pressed={speech.listening}
            >
              <span aria-hidden="true">🎙</span>
              {speech.status === 'requesting'
                ? 'Starting…'
                : speech.status === 'listening'
                  ? 'Listening…'
                  : 'Speak'}
            </button>
          ) : (
            <p className="unsupported">Voice input isn't available in this browser.</p>
          )}

          {timer.isRunning ? (
            <button type="button" className="button button--quiet" onClick={timer.pause}>
              Pause
            </button>
          ) : (
            <button
              type="button"
              className="button button--quiet"
              onClick={timer.start}
              disabled={timer.isFinished}
            >
              {timer.status === 'idle' ? 'Start timer' : 'Resume'}
            </button>
          )}

          <button type="button" className="button button--primary" onClick={finish}>
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}
