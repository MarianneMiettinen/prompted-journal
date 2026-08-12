import { useCallback } from 'react';
import { useTimer } from '../core/useTimer';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { JOURNAL_TIMER_KEY } from '../utils/storage';
import { playGong } from '../utils/gong';
import type { Emotion } from '../data/emotions';
import { Wizard } from './Wizard';

interface Props {
  emotion: Emotion;
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

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function Journal({ emotion, prompt, text, updateText, onFinish, durationMs }: Props) {
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

  const words = countWords(text);

  const finish = () => {
    speech.stop();
    onFinish();
  };

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="screen screen--journal">
      <header className="journal-bar">
        <span className="journal-emoji" aria-hidden="true">
          {emotion.emoji}
        </span>
        <div className="journal-bar-text">
          <p className="journal-eyebrow">Your journal</p>
          <p className="journal-date">
            {emotion.label} — {today}
          </p>
        </div>
        <button
          type="button"
          className={`journal-timer${timer.isRunning ? ' journal-timer--running' : ''}`}
          onClick={timer.isRunning ? timer.pause : timer.start}
          disabled={timer.isFinished}
        >
          <span className="visually-hidden">
            {timer.isRunning ? 'Pause the timer' : 'Start the timer'}
          </span>
          <span aria-hidden="true">{timer.display}</span>
        </button>
      </header>

      <div className="paper">
        <p className="paper-prompt">{prompt}</p>

        <label className="visually-hidden" htmlFor="journal-text">
          Your writing
        </label>
        <textarea
          id="journal-text"
          className="paper-field"
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
          <p className="paper-interim" aria-live="polite">
            {speech.interim}
          </p>
        )}
        {timer.isFinished && (
          <p className="paper-note" role="status">
            That’s your time. Finish when you’re ready — nothing is lost.
          </p>
        )}
        {(speech.error ?? speech.hint) && (
          <p className="paper-note paper-note--quiet" role="status">
            {speech.error ?? speech.hint}
          </p>
        )}

        <div className="paper-foot">
          <span className="paper-count">
            {words > 0 ? `${words} ${words === 1 ? 'word' : 'words'}` : 'Start writing…'}
          </span>

          <div className="paper-tools">
            {speech.supported && (
              <button
                type="button"
                className={`chip-button${speech.listening ? ' chip-button--on' : ''}`}
                onClick={() => (speech.listening ? speech.stop() : speech.start())}
                aria-pressed={speech.listening}
              >
                <span aria-hidden="true">🎙</span>
                {speech.status === 'requesting'
                  ? 'Starting…'
                  : speech.status === 'listening'
                    ? 'Listening…'
                    : 'Speak'}
              </button>
            )}
            <button
              type="button"
              className="button button--primary button--small"
              onClick={finish}
              disabled={words === 0}
            >
              Done →
            </button>
          </div>
        </div>
      </div>

      <footer className="whisper">
        <Wizard size="avatar" floating />
        <div>
          <p className="whisper-label">Aldric whispers</p>
          <p className="whisper-text">
            Take your time. Every word you write is a small act of courage.
          </p>
        </div>
      </footer>
    </div>
  );
}
