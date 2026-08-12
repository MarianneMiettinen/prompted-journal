import { findReward, type Reward } from '../data/rewards';
import type { Collection } from '../utils/collection';
import { WizardSays } from './Wizard';

interface Props {
  collection: Collection;
  /** Ids earned in this session, highlighted so they can be found on a full shelf. */
  fresh: string[];
  onClose: () => void;
  closeLabel: string;
}

const PER_ROW = 2;
const MIN_ROWS = 3;

function toRows(ids: string[]): (Reward | null)[][] {
  const rewards = ids.map(findReward).filter((r): r is Reward => r !== null);
  const rowCount = Math.max(MIN_ROWS, Math.ceil(rewards.length / PER_ROW) || 1);
  return Array.from({ length: rowCount }, (_, row) =>
    Array.from({ length: PER_ROW }, (_, col) => rewards[row * PER_ROW + col] ?? null),
  );
}

function Shelf({
  title,
  ids,
  fresh,
  kind,
}: {
  title: string;
  ids: string[];
  fresh: string[];
  kind: 'spell' | 'orb';
}) {
  return (
    <section className={`shelf shelf--${kind}`}>
      <h2 className="shelf-title">{title}</h2>
      <p className="shelf-count">
        {ids.length} {ids.length === 1 ? 'collected' : 'collected'}
      </p>

      <div className="shelf-rows">
        {toRows(ids).map((row, rowIndex) => (
          <div className="shelf-row" key={rowIndex}>
            <div className="shelf-items">
              {row.map((reward, col) =>
                reward ? (
                  <div
                    key={`${reward.id}-${col}`}
                    className={`token${fresh.includes(reward.id) ? ' token--new' : ''}`}
                  >
                    <span
                      className="token-body"
                      style={{
                        // Each reward carries its own colour through to the shelf.
                        background: `radial-gradient(circle at 34% 30%, #fff 0%, ${reward.colour} 100%)`,
                        boxShadow: fresh.includes(reward.id)
                          ? `0 0 18px ${reward.colour}, 0 0 34px ${reward.colour}66`
                          : undefined,
                      }}
                      aria-hidden="true"
                    >
                      {kind === 'spell' ? '✦' : '✨'}
                    </span>
                    <span className="token-name">{reward.name}</span>
                  </div>
                ) : (
                  <div className="token token--empty" key={`empty-${col}`}>
                    <span className="token-body token-body--empty" aria-hidden="true" />
                  </div>
                ),
              )}
            </div>
            <div className="plank" aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function Cupboard({ collection, fresh, onClose, closeLabel }: Props) {
  const total = collection.spells.length + collection.orbs.length;

  return (
    <div className="screen">
      <header className="stack">
        <p className="eyebrow">Aldric’s cupboard</p>
        <h1 className="display">Your collection</h1>
        <p className="lede">
          {total === 0
            ? 'Empty for now. Write an entry and Aldric will put the first one on a shelf.'
            : 'Spells on the left, from your writing. Crystal balls on the right, from your stillness.'}
        </p>
      </header>

      <div className="cupboard">
        <div className="cupboard-lintel" aria-hidden="true">
          <span>✦ collection ✦</span>
        </div>

        {/* The cupboard is magic: it keeps getting taller, so the inside scrolls. */}
        <div className="cupboard-inside">
          <Shelf title="Spells" ids={collection.spells} fresh={fresh} kind="spell" />
          <div className="cupboard-divider" aria-hidden="true" />
          <Shelf title="Crystal balls" ids={collection.orbs} fresh={fresh} kind="orb" />
        </div>

        <div className="cupboard-base" aria-hidden="true">
          <span className="knob" />
          <span className="rail" />
          <span className="knob" />
        </div>
      </div>

      <WizardSays>
        {total === 0
          ? 'Nothing here yet. That is only a matter of time.'
          : 'Your collection grows. Come back tomorrow — both shelves are waiting. ✦'}
      </WizardSays>

      <div className="actions actions--stack">
        <button type="button" className="button button--primary" onClick={onClose}>
          {closeLabel}
        </button>
      </div>
    </div>
  );
}
