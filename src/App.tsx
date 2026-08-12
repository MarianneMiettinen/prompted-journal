import { useCallback, useEffect, useState } from 'react';
import { CheckIn } from './components/CheckIn';
import { Complete } from './components/Complete';
import { Journal } from './components/Journal';
import { Meditation } from './components/Meditation';
import { getPromptText, selectPromptId } from './data/prompts';
import type { CheckIn as CheckInAnswers, Session } from './types';
import { clearTimers, freshSession, loadSession, saveSession } from './utils/storage';

/** The two durations of the ritual. Change them here and nowhere else. */
const JOURNAL_MINUTES = 10;
const MEDITATION_MINUTES = 1;

export default function App() {
  const [session, setSession] = useState<Session>(() => {
    const stored = loadSession();
    if (stored) return stored;
    // Nothing to resume (first visit, or a session from another day) — clear the
    // timers too, so a new ritual starts with full ones.
    clearTimers();
    return freshSession();
  });

  // Every change is written straight through, so a refresh mid-ritual loses nothing.
  useEffect(() => {
    saveSession(session);
  }, [session]);

  const updateText = useCallback((updater: (previous: string) => string) => {
    setSession((current) => ({ ...current, text: updater(current.text) }));
  }, []);

  const handleCheckIn = (answers: CheckInAnswers) => {
    setSession((current) => ({
      ...current,
      checkIn: answers,
      promptId: selectPromptId(answers),
      stage: 'journal',
    }));
  };

  const goTo = (stage: Session['stage']) => setSession((current) => ({ ...current, stage }));

  const restart = () => {
    clearTimers();
    setSession(freshSession());
  };

  // A stored stage without answers can only happen if storage was tampered with — recover quietly.
  const stage = session.stage !== 'checkin' && !session.checkIn ? 'checkin' : session.stage;

  return (
    <main className="app">
      {stage === 'checkin' && <CheckIn onComplete={handleCheckIn} />}

      {stage === 'journal' && (
        <Journal
          prompt={getPromptText(session.promptId)}
          text={session.text}
          updateText={updateText}
          onFinish={() => goTo('meditation')}
          durationMs={JOURNAL_MINUTES * 60_000}
        />
      )}

      {stage === 'meditation' && (
        <Meditation
          onFinish={() => goTo('complete')}
          durationMs={MEDITATION_MINUTES * 60_000}
        />
      )}

      {stage === 'complete' && <Complete onRestart={restart} />}
    </main>
  );
}
