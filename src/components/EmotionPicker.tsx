import { useState } from 'react';
import { EMOTION_GROUPS } from '../data/emotions';
import type { EmotionId } from '../types';

interface Props {
  initial: EmotionId | null;
  onComplete: (emotion: EmotionId) => void;
}

export function EmotionPicker({ initial, onComplete }: Props) {
  const [emotion, setEmotion] = useState<EmotionId | null>(initial);

  return (
    <div className="screen">
      <header className="screen-header">
        <p className="step">Step 1 of 2 · one more after this</p>
        <h1 className="display">Good morning.</h1>
        <p className="lede">What are you feeling right now?</p>
      </header>

      {EMOTION_GROUPS.map((group) => (
        <fieldset className="choice-group" key={group.title}>
          <legend className="choice-legend">
            {group.title}
            <span className="choice-hint">{group.hint}</span>
          </legend>
          <div className="choice-options">
            {group.emotions.map((option) => (
              <label
                key={option.value}
                className={`choice${emotion === option.value ? ' choice--selected' : ''}`}
              >
                <input
                  type="radio"
                  name="emotion"
                  value={option.value}
                  checked={emotion === option.value}
                  onChange={() => setEmotion(option.value)}
                />
                <span className="choice-emoji" aria-hidden="true">
                  {option.emoji}
                </span>
                <span className="choice-label">{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      <div className="actions">
        <button
          type="button"
          className="button button--primary"
          disabled={emotion === null}
          onClick={() => emotion && onComplete(emotion)}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
