import { useCallback, useEffect, useState } from 'react';
import { Complete } from './components/Complete';
import { EmotionPicker } from './components/EmotionPicker';
import { FollowUp } from './components/FollowUp';
import { Journal } from './components/Journal';
import { LaunchHelp } from './components/LaunchHelp';
import { Meditation } from './components/Meditation';
import { findEmotion } from './data/emotions';
import { getPromptText, selectPromptId } from './data/prompts';
import type { EmotionId, Session } from './types';
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

  const handleEmotion = (emotion: EmotionId) => {
    setSession((current) => ({
      ...current,
      // Keep the emotion, drop any answers that belonged to a different branch.
      checkIn: { emotion, q1: '', q2: '' },
      stage: 'questions',
    }));
  };

  const handleAnswers = (q1: string, q2: string) => {
    setSession((current) => {
      if (!current.checkIn) return current;
      const checkIn = { ...current.checkIn, q1, q2 };
      return { ...current, checkIn, promptId: selectPromptId(checkIn), stage: 'journal' };
    });
  };

  const goTo = (stage: Session['stage']) => setSession((current) => ({ ...current, stage }));

  const restart = () => {
    clearTimers();
    setSession(freshSession());
  };

  const emotion = findEmotion(session.checkIn?.emotion ?? null);

  // An emotion that no longer exists in the data (renamed between deploys) sends the
  // person back to the picker rather than into a screen with no questions.
  const stage = session.stage !== 'emotion' && emotion === null ? 'emotion' : session.stage;

  return (
    <main className="app">
      {stage === 'emotion' && (
        <>
          <EmotionPicker
            initial={session.checkIn?.emotion ?? null}
            onComplete={handleEmotion}
          />
          {/* Only on the opening screen — it must never interrupt the ritual itself. */}
          <LaunchHelp />
        </>
      )}

      {stage === 'questions' && emotion && (
        <FollowUp
          emotion={emotion}
          onBack={() => goTo('emotion')}
          onComplete={handleAnswers}
        />
      )}

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
        <Meditation onFinish={() => goTo('complete')} durationMs={MEDITATION_MINUTES * 60_000} />
      )}

      {stage === 'complete' && <Complete onRestart={restart} />}
    </main>
  );
}
