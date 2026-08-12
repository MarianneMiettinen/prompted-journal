import type { ReactNode } from 'react';

type Size = 'avatar' | 'small' | 'hero';

// Lives in public/, so it is referenced by URL rather than imported as a module.
const WIZARD_SRC = '/wizard.png';

/**
 * Aldric. The scan is drawn on paper, so `mix-blend-mode: multiply` (in the stylesheet)
 * drops the white page and leaves only the pencil on our own notebook background.
 */
export function Wizard({ size = 'small', floating = false }: { size?: Size; floating?: boolean }) {
  return (
    <img
      src={WIZARD_SRC}
      alt="Aldric, a wizard drawn in pencil"
      className={`wizard wizard--${size}${floating ? ' wizard--floating' : ''}`}
    />
  );
}

/** Aldric with something to say. The label is spoken aloud by the design, so keep it. */
export function WizardSays({
  label,
  children,
  tone = 'light',
}: {
  label?: string;
  children: ReactNode;
  tone?: 'light' | 'dark';
}) {
  return (
    <div className={`says says--${tone}`}>
      <Wizard size="avatar" floating />
      <div className="says-bubble">
        {label && <p className="says-label">{label}</p>}
        <p className="says-text">{children}</p>
      </div>
    </div>
  );
}
