import { useEffect, useState } from 'react';
import type { Reward } from '../data/rewards';
import { OrbArt, SpellArt } from './RewardArt';
import { Wizard, WizardSays } from './Wizard';

interface Props {
  reward: Reward;
  onNext: () => void;
}

/** How long Aldric is seen working before the reward appears. */
const CONJURING_MS = 2200;

export function RewardReveal({ reward, onNext }: Props) {
  const [conjuring, setConjuring] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => setConjuring(false), CONJURING_MS);
    return () => window.clearTimeout(id);
  }, []);

  const isSpell = reward.kind === 'spell';

  if (conjuring) {
    return (
      <div className="screen screen--centred">
        <div className="sparkles" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={`sparkle sparkle--${i}`}>
              ✦
            </span>
          ))}
        </div>
        <Wizard size="hero" floating />
        <div className="stack stack--centre">
          <p className="eyebrow">Aldric is working</p>
          <h1 className="display display--small">
            {isSpell ? (
              <>
                Weaving your words
                <br />
                into something.
              </>
            ) : (
              <>
                Catching the sound
                <br />
                before it fades.
              </>
            )}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="screen screen--centred">
      <div
        className="reward-glow"
        style={{ background: reward.colour }}
        aria-hidden="true"
      />

      <div className="reward-art">
        {isSpell ? <SpellArt colour={reward.colour} /> : <OrbArt colour={reward.colour} />}
      </div>

      <div className="stack stack--centre">
        <p className="eyebrow">{isSpell ? 'New spell written' : 'New crystal ball formed'}</p>
        <h1 className="display">{reward.name}</h1>
        <p className="lede lede--wide">{reward.description}</p>
      </div>

      <WizardSays>
        {isSpell
          ? 'Onto the left-hand shelf it goes. It is yours now.'
          : 'The spell is complete. Thank you for holding it with me.'}
      </WizardSays>

      <div className="actions actions--stack">
        <button type="button" className="button button--primary" onClick={onNext}>
          Put it in the cupboard →
        </button>
      </div>
    </div>
  );
}
