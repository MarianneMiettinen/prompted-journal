import { useState } from 'react';
import { ENERGIES, MOODS, TOPICS } from '../data/options';
import type { CheckIn as CheckInAnswers, Energy, Mood, Topic } from '../types';
import { ChoiceGroup } from './ChoiceGroup';

export function CheckIn({ onComplete }: { onComplete: (answers: CheckInAnswers) => void }) {
  const [mood, setMood] = useState<Mood | null>(null);
  const [energy, setEnergy] = useState<Energy | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);

  const ready = mood !== null && energy !== null && topic !== null;

  return (
    <div className="screen">
      <header className="screen-header">
        <h1 className="display">Good morning.</h1>
        <p className="lede">Three quick questions, then one thing to write about.</p>
      </header>

      <ChoiceGroup
        name="mood"
        legend="How are you feeling?"
        choices={MOODS}
        value={mood}
        onChange={setMood}
      />
      <ChoiceGroup
        name="energy"
        legend="How is your energy?"
        choices={ENERGIES}
        value={energy}
        onChange={setEnergy}
        layout="row"
      />
      <ChoiceGroup
        name="topic"
        legend="What's taking up space in your mind?"
        choices={TOPICS}
        value={topic}
        onChange={setTopic}
      />

      <div className="actions">
        <button
          type="button"
          className="button button--primary"
          disabled={!ready}
          onClick={() => ready && onComplete({ mood, energy, topic })}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
