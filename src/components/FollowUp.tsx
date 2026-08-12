import { useState } from 'react';
import { BRANCH_QUESTIONS } from '../data/questions';
import type { Emotion } from '../data/emotions';
import { Wizard } from './Wizard';

interface Props {
  emotion: Emotion;
  onBack: () => void;
  onComplete: (q1: string, q2: string) => void;
}

const LETTERS = ['A', 'B', 'C', 'D'];

/** The two questions come from the emotion's branch, so they change with the feeling. */
export function FollowUp({ emotion, onBack, onComplete }: Props) {
  const [first, second] = BRANCH_QUESTIONS[emotion.branch];
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [page, setPage] = useState<0 | 1>(0);

  const question = page === 0 ? first : second;
  const value = page === 0 ? q1 : q2;
  const setValue = page === 0 ? setQ1 : setQ2;

  const back = () => (page === 0 ? onBack() : setPage(0));
  const forward = () => {
    if (page === 0) setPage(1);
    else if (q1 && q2) onComplete(q1, q2);
  };

  return (
    <div className="screen screen--split">
      <div className="screen-top">
        <button type="button" className="link-button" onClick={back}>
          ← Back
        </button>

        <p className="chip">
          <span className="chip-emoji" aria-hidden="true">
            {emotion.emoji}
          </span>
          {emotion.label}
          <span className="chip-step">Question {page + 1} of 2</span>
        </p>

        <div className="asks">
          <Wizard size="small" floating />
          <div className="stack">
            <p className="eyebrow">Aldric asks</p>
            <h1 className="display display--small">{question.legend}</h1>
          </div>
        </div>
      </div>

      <div className="screen-bottom">
        <fieldset className="group">
          <legend className="visually-hidden">{question.legend}</legend>
          <div className="option-list">
            {question.options.map((option, index) => (
              <label
                key={option.value}
                className={`option${value === option.value ? ' option--on' : ''}`}
              >
                <input
                  type="radio"
                  name={`q${page}`}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => setValue(option.value)}
                />
                <span className="option-letter" aria-hidden="true">
                  {LETTERS[index]}
                </span>
                <span className="option-label">{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          className="button button--primary button--wide"
          disabled={value === null}
          onClick={forward}
        >
          {page === 0 ? 'Continue →' : 'Start writing →'}
        </button>
      </div>
    </div>
  );
}
