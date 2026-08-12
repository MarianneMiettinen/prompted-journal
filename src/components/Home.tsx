import { Wizard } from './Wizard';

interface Props {
  spellCount: number;
  orbCount: number;
  onBegin: () => void;
  onOpenCupboard: () => void;
}

export function Home({ spellCount, orbCount, onBegin, onOpenCupboard }: Props) {
  const total = spellCount + orbCount;

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

      <div className="stack">
        <p className="eyebrow">Good morning</p>
        <h1 className="display">
          Aldric is waiting
          <br />
          by the desk.
        </h1>
        <p className="lede">
          Name what you are feeling, write for a while, and sit with the gong. He will make
          something of it.
        </p>
      </div>

      <div className="actions actions--stack">
        <button type="button" className="button button--primary" onClick={onBegin}>
          Begin today’s entry →
        </button>
        <button type="button" className="button button--ghost" onClick={onOpenCupboard}>
          {total > 0
            ? `Open the cupboard · ${total} ${total === 1 ? 'thing' : 'things'} on the shelves`
            : 'Open the cupboard'}
        </button>
      </div>
    </div>
  );
}
