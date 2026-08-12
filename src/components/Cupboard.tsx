import { ORBS, SPELLS, findReward, type Reward, type RewardKind } from '../data/rewards';
import {
  formatEarnedDate,
  groupByMonth,
  type Collection,
  type Earned,
} from '../utils/collection';
import { WizardSays } from './Wizard';

interface Props {
  collection: Collection;
  /** Ids earned in this sitting, highlighted so they can be found on a full shelf. */
  fresh: string[];
  onClose: () => void;
  closeLabel: string;
}

function Token({ entry, kind, isNew }: { entry: Earned; kind: RewardKind; isNew: boolean }) {
  const reward = findReward(entry.id);
  if (!reward) return null;

  return (
    <div className={`token${isNew ? ' token--new' : ''}`}>
      <span
        className="token-body"
        style={{
          background: `radial-gradient(circle at 34% 30%, #fff 0%, ${reward.colour} 100%)`,
          boxShadow: isNew
            ? `0 0 18px ${reward.colour}, 0 0 34px ${reward.colour}66`
            : undefined,
        }}
        aria-hidden="true"
      >
        {kind === 'spell' ? '✦' : '✨'}
      </span>
      <span className="token-name">{reward.name}</span>
      {/* The golden sign: when this one was received. */}
      <span className="token-date">{formatEarnedDate(entry.at)}</span>
    </div>
  );
}

/** A shape only — what is still out there to find, without giving away its name. */
function Locked({ kind }: { kind: RewardKind }) {
  return (
    <div className="token token--locked">
      <span className="token-body token-body--locked" aria-hidden="true">
        {kind === 'spell' ? '✦' : '✨'}
      </span>
      <span className="token-name token-name--locked">?</span>
    </div>
  );
}

function Column({
  title,
  entries,
  kind,
  fresh,
}: {
  title: string;
  entries: Earned[];
  kind: RewardKind;
  fresh: string[];
}) {
  return (
    <div className={`column column--${kind}`}>
      <h3 className="column-title">{title}</h3>
      {entries.length === 0 ? (
        <p className="column-empty">None yet</p>
      ) : (
        <div className="column-items">
          {entries.map((entry, index) => (
            <Token
              key={`${entry.id}-${index}`}
              entry={entry}
              kind={kind}
              isNew={fresh.includes(entry.id)}
            />
          ))}
        </div>
      )}
      <div className="plank" aria-hidden="true" />
    </div>
  );
}

/** Rewards of a kind that have never been collected, as shapes. */
function stillToFind(pool: Reward[], entries: Earned[]): number {
  const owned = new Set(entries.map((entry) => entry.id));
  return pool.filter((reward) => !owned.has(reward.id)).length;
}

export function Cupboard({ collection, fresh, onClose, closeLabel }: Props) {
  const months = groupByMonth(collection);
  const total = collection.spells.length + collection.orbs.length;

  const spellsLeft = stillToFind(SPELLS, collection.spells);
  const orbsLeft = stillToFind(ORBS, collection.orbs);

  return (
    <div className="screen">
      <header className="stack">
        <p className="eyebrow">Aldric’s cupboard</p>
        <h1 className="display">Your collection</h1>
        <p className="lede">
          {total === 0
            ? 'Empty for now. Write an entry and Aldric will put the first one on a shelf.'
            : `${total} in all — spells on the left, from your writing. Crystal balls on the right, from your stillness.`}
        </p>
      </header>

      <div className="cupboard">
        <div className="cupboard-lintel" aria-hidden="true">
          <span>✦ collection ✦</span>
        </div>

        {/* A magic cupboard: it keeps getting taller, so the inside scrolls. */}
        <div className="cupboard-inside">
          {months.map((month) => (
            <section className="month" key={month.key || 'earlier'}>
              <header className="month-head">
                <h2 className="month-name">{month.label}</h2>
                <span className="month-total">
                  {month.total} {month.total === 1 ? 'reward' : 'rewards'}
                </span>
              </header>

              <div className="month-columns">
                <Column title="Spells" entries={month.spells} kind="spell" fresh={fresh} />
                <div className="column-divider" aria-hidden="true" />
                <Column title="Crystal balls" entries={month.orbs} kind="orb" fresh={fresh} />
              </div>
            </section>
          ))}

          {(spellsLeft > 0 || orbsLeft > 0) && (
            <section className="month month--locked">
              <header className="month-head">
                <h2 className="month-name">Still to find</h2>
                <span className="month-total">{spellsLeft + orbsLeft} left</span>
              </header>

              <div className="month-columns">
                <div className="column">
                  <h3 className="column-title">Spells</h3>
                  <div className="column-items">
                    {Array.from({ length: spellsLeft }, (_, i) => (
                      <Locked key={i} kind="spell" />
                    ))}
                  </div>
                  <div className="plank" aria-hidden="true" />
                </div>
                <div className="column-divider" aria-hidden="true" />
                <div className="column column--orb">
                  <h3 className="column-title">Crystal balls</h3>
                  <div className="column-items">
                    {Array.from({ length: orbsLeft }, (_, i) => (
                      <Locked key={i} kind="orb" />
                    ))}
                  </div>
                  <div className="plank" aria-hidden="true" />
                </div>
              </div>
            </section>
          )}

          {total === 0 && spellsLeft === 0 && orbsLeft === 0 && (
            <p className="cupboard-empty">Nothing on the shelves yet.</p>
          )}
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
