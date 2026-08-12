import { useState } from 'react';
import { ChoiceGroup } from './ChoiceGroup';
import { BRANCH_QUESTIONS } from '../data/questions';
import type { Emotion } from '../data/emotions';

interface Props {
  emotion: Emotion;
  onBack: () => void;
  onComplete: (q1: string, q2: string) => void;
}

/** The two questions are chosen by the emotion's branch, so they change with the feeling. */
export function FollowUp({ emotion, onBack, onComplete }: Props) {
  const [first, second] = BRANCH_QUESTIONS[emotion.branch];
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);

  const ready = q1 !== null && q2 !== null;

  return (
    <div className="screen">
      <header className="screen-header">
        <p className="step">Step 2 of 2 · last one</p>
        <h1 className="display">
          <span aria-hidden="true">{emotion.emoji}</span> {emotion.label}.
        </h1>
        <button type="button" className="link-button" onClick={onBack}>
          Choose a different word
        </button>
      </header>

      <ChoiceGroup
        name="q1"
        legend={first.legend}
        choices={first.options}
        value={q1}
        onChange={setQ1}
      />
      <ChoiceGroup
        name="q2"
        legend={second.legend}
        choices={second.options}
        value={q2}
        onChange={setQ2}
      />

      <div className="actions">
        <button
          type="button"
          className="button button--primary"
          disabled={!ready}
          onClick={() => ready && onComplete(q1, q2)}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
