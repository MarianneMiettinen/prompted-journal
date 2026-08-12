export function Complete({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="screen screen--complete">
      <header className="screen-header">
        <h1 className="display">You showed up for yourself.</h1>
        <p className="lede">That's the whole thing. Go have your day.</p>
      </header>

      <div className="actions">
        <button type="button" className="button button--quiet" onClick={onRestart}>
          Start again
        </button>
      </div>
    </div>
  );
}
