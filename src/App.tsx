import { useCallback, useEffect, useState } from 'react';
import { Cupboard } from './components/Cupboard';
import { EmotionPicker } from './components/EmotionPicker';
import { FollowUp } from './components/FollowUp';
import { GongScreen } from './components/GongScreen';
import { Home } from './components/Home';
import { Journal } from './components/Journal';
import { LaunchHelp } from './components/LaunchHelp';
import { RewardReveal } from './components/RewardReveal';
import { findEmotion } from './data/emotions';
import { getPromptText, selectPromptId } from './data/prompts';
import { findReward, nextReward, type RewardKind } from './data/rewards';
import type { EmotionId, Session, Stage } from './types';
import {
  loadCollection,
  requestDurableStorage,
  saveCollection,
  today,
  type Collection,
} from './utils/collection';
import { playTap } from './utils/sounds';
import { clearTimers, freshSession, loadSession, saveSession } from './utils/storage';

/** The two durations of the ritual. Change them here and nowhere else. */
const JOURNAL_MINUTES = 10;
const MEDITATION_MINUTES = 1;

export default function App() {
  const [session, setSession] = useState<Session>(() => {
    const stored = loadSession();
    if (stored) return stored;
    clearTimers();
    return freshSession();
  });
  const [collection, setCollection] = useState<Collection>(loadCollection);
  /** Earned in this sitting — highlighted on the shelf so they can be picked out. */
  const [fresh, setFresh] = useState<string[]>([]);
  /** Where the cupboard was opened from, so its button can say the right thing. */
  const [cameFromHome, setCameFromHome] = useState(false);

  useEffect(() => {
    saveSession(session);
  }, [session]);

  useEffect(() => {
    saveCollection(collection);
  }, [collection]);

  useEffect(() => {
    requestDurableStorage();
  }, []);

  // One listener rather than a handler on every control. Covers the choice pills too, since
  // they behave like buttons even though they are labels wrapping a radio.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('button, .pill, .option')) playTap();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const updateText = useCallback((updater: (previous: string) => string) => {
    setSession((current) => ({ ...current, text: updater(current.text) }));
  }, []);

  const goTo = (stage: Stage) => setSession((current) => ({ ...current, stage }));

  const handleEmotion = (emotion: EmotionId) => {
    setSession((current) => ({
      ...current,
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

  /** Conjures the next reward of a kind and moves to its reveal. */
  const award = (kind: RewardKind, stage: Stage) => {
    const collected = (kind === 'spell' ? collection.spells : collection.orbs).map((e) => e.id);
    const reward = nextReward(kind, collected);
    setSession((current) => ({ ...current, pendingRewardId: reward.id, stage }));
  };

  /** Shelves whatever is currently being revealed, stamped with today's date. */
  const shelve = (next: Stage) => {
    const reward = findReward(session.pendingRewardId ?? '');
    if (reward) {
      const earned = { id: reward.id, at: today() };
      setCollection((current) =>
        reward.kind === 'spell'
          ? { ...current, spells: [...current.spells, earned] }
          : { ...current, orbs: [...current.orbs, earned] },
      );
      setFresh((current) => [...current, reward.id]);
    }
    setSession((current) => ({ ...current, pendingRewardId: null, stage: next }));
  };

  const startOver = () => {
    clearTimers();
    setFresh([]);
    setSession(freshSession());
  };

  const emotion = findEmotion(session.checkIn?.emotion ?? null);
  const pending = findReward(session.pendingRewardId ?? '');

  // Recover from any state that can't be rendered — a stage needing an emotion that isn't
  // there, or a reveal with no reward — rather than showing a blank screen.
  let stage = session.stage;
  if (['questions', 'journal'].includes(stage) && !emotion) stage = 'emotion';
  if ((stage === 'spell' || stage === 'orb') && !pending) stage = 'cupboard';

  return (
    <main className="app">
      {stage === 'home' && (
        <>
          <Home
            spellCount={collection.spells.length}
            orbCount={collection.orbs.length}
            onBegin={() => goTo('emotion')}
            onOpenCupboard={() => {
              setCameFromHome(true);
              goTo('cupboard');
            }}
          />
          <LaunchHelp />
        </>
      )}

      {stage === 'emotion' && (
        <EmotionPicker
          initial={session.checkIn?.emotion ?? null}
          onComplete={handleEmotion}
          onBack={() => goTo('home')}
        />
      )}

      {stage === 'questions' && emotion && (
        <FollowUp
          emotion={emotion}
          onBack={() => goTo('emotion')}
          onComplete={handleAnswers}
        />
      )}

      {stage === 'journal' && emotion && (
        <Journal
          emotion={emotion}
          prompt={getPromptText(session.promptId)}
          text={session.text}
          updateText={updateText}
          onFinish={() => award('spell', 'spell')}
          durationMs={JOURNAL_MINUTES * 60_000}
        />
      )}

      {stage === 'spell' && pending && (
        <RewardReveal reward={pending} onNext={() => shelve('gong')} />
      )}

      {stage === 'gong' && (
        <GongScreen
          onComplete={() => award('orb', 'orb')}
          durationMs={MEDITATION_MINUTES * 60_000}
        />
      )}

      {stage === 'orb' && pending && (
        <RewardReveal reward={pending} onNext={() => shelve('cupboard')} />
      )}

      {stage === 'cupboard' && (
        <Cupboard
          collection={collection}
          fresh={fresh}
          closeLabel={cameFromHome ? '← Back to the desk' : 'Done for today ✦'}
          onClose={() => {
            if (cameFromHome) {
              setCameFromHome(false);
              goTo('home');
            } else {
              startOver();
            }
          }}
        />
      )}
    </main>
  );
}
