interface Choice<T extends string> {
  value: T;
  label: string;
  emoji?: string;
}

interface Props<T extends string> {
  name: string;
  legend: string;
  choices: readonly Choice<T>[];
  value: T | null;
  onChange: (value: T) => void;
  /** 'grid' wraps into columns; 'row' keeps three-or-fewer choices on one line. */
  layout?: 'grid' | 'row';
}

/**
 * Real radio inputs, visually hidden. That gives arrow-key navigation, focus handling and
 * screen-reader grouping for free — none of which a div-with-onClick would have.
 */
export function ChoiceGroup<T extends string>({
  name,
  legend,
  choices,
  value,
  onChange,
  layout = 'grid',
}: Props<T>) {
  return (
    <fieldset className="choice-group">
      <legend className="choice-legend">{legend}</legend>
      <div className={`choice-options choice-options--${layout}`}>
        {choices.map((choice) => (
          <label
            key={choice.value}
            className={`choice${value === choice.value ? ' choice--selected' : ''}`}
          >
            <input
              type="radio"
              name={name}
              value={choice.value}
              checked={value === choice.value}
              onChange={() => onChange(choice.value)}
            />
            {choice.emoji && (
              <span className="choice-emoji" aria-hidden="true">
                {choice.emoji}
              </span>
            )}
            <span className="choice-label">{choice.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
