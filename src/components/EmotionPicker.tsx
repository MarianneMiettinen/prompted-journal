import { useState } from 'react';
import { EMOTION_GROUPS } from '../data/emotions';
import type { EmotionId } from '../types';
import { WizardSays } from './Wizard';

interface Props {
  initial: EmotionId | null;
  onComplete: (emotion: EmotionId) => void;
  onBack: () => void;
}

export function EmotionPicker({ initial, onComplete, onBack }: Props) {
  const [emotion, setEmotion] = useState<EmotionId | null>(initial);

  return (
    <div className="screen screen--split">
      <div className="screen-top">
        <button type="button" className="link-button" onClick={onBack}>
          ← Back
        </button>

        <WizardSays>
          Hello again. I am Aldric — I will be with you through today’s entry. ✦
        </WizardSays>

        <div className="stack">
          <h1 className="display">
            How are you feeling
            <br />
            right now?
          </h1>
          <p className="lede">Choose the word closest to you. The nearest one is fine.</p>
        </div>
      </div>

      <div className="screen-bottom">
        {EMOTION_GROUPS.map((group) => (
          <fieldset className="group" key={group.title}>
            <legend className="group-legend">
              {group.title}
              <span className="group-hint">{group.hint}</span>
            </legend>
            <div className="pill-grid">
              {group.emotions.map((option) => (
                <label
                  key={option.value}
                  className={`pill${emotion === option.value ? ' pill--on' : ''}`}
                >
                  <input
                    type="radio"
                    name="emotion"
                    value={option.value}
                    checked={emotion === option.value}
                    onChange={() => setEmotion(option.value)}
                  />
                  <span className="pill-emoji" aria-hidden="true">
                    {option.emoji}
                  </span>
                  <span className="pill-label">{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        <button
          type="button"
          className="button button--primary button--wide"
          disabled={emotion === null}
          onClick={() => emotion && onComplete(emotion)}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
