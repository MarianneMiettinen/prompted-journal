const KEY = 'prompted-journal:collection';
const SCHEMA_VERSION = 2;

export interface Earned {
  id: string;
  /** Local YYYY-MM-DD it was received. Empty for entries saved before dates were kept. */
  at: string;
}

export interface Collection {
  spells: Earned[];
  orbs: Earned[];
}

interface Envelope {
  v: number;
  collection: Collection;
}

export const EMPTY_COLLECTION: Collection = { spells: [], orbs: [] };

/** Local calendar date — the shelf should agree with the morning it happened. */
export function today(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function readEarned(value: unknown): Earned[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry): Earned | null => {
      // Version 1 stored bare ids with no date. Keep the reward, admit the date is unknown.
      if (typeof entry === 'string') return { id: entry, at: '' };
      if (entry && typeof entry === 'object') {
        const record = entry as Partial<Earned>;
        if (typeof record.id === 'string') {
          return { id: record.id, at: typeof record.at === 'string' ? record.at : '' };
        }
      }
      return null;
    })
    .filter((entry): entry is Earned => entry !== null);
}

export function loadCollection(): Collection {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY_COLLECTION;
    const parsed = JSON.parse(raw) as Partial<Envelope>;
    // Version 1 is readable rather than discarded — losing the shelf would be the worst
    // possible outcome of a schema change.
    if (parsed?.v !== 1 && parsed?.v !== SCHEMA_VERSION) return EMPTY_COLLECTION;
    return {
      spells: readEarned(parsed.collection?.spells),
      orbs: readEarned(parsed.collection?.orbs),
    };
  } catch {
    return EMPTY_COLLECTION;
  }
}

export function saveCollection(collection: Collection): void {
  try {
    const envelope: Envelope = { v: SCHEMA_VERSION, collection };
    localStorage.setItem(KEY, JSON.stringify(envelope));
  } catch {
    // Storage unavailable. The ritual still works; the shelf just won't remember.
  }
}

/**
 * Asks the browser to keep this origin's storage rather than evicting it under pressure.
 * Best effort — granted silently for installed apps, ignored elsewhere.
 */
export function requestDurableStorage(): void {
  void navigator.storage?.persist?.().catch(() => undefined);
}

/* ── Grouping for the cupboard ─────────────────────────────────────────── */

export interface MonthGroup {
  /** 'YYYY-MM', or '' for entries whose date was never recorded. */
  key: string;
  label: string;
  spells: Earned[];
  orbs: Earned[];
  total: number;
}

const MONTH_FORMAT = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });

function monthKeyOf(entry: Earned): string {
  return entry.at ? entry.at.slice(0, 7) : '';
}

function monthLabel(key: string): string {
  if (!key) return 'Earlier';
  const [year, month] = key.split('-').map(Number);
  return MONTH_FORMAT.format(new Date(year, month - 1, 1));
}

/** Newest month first, so this month is what you see when the cupboard opens. */
export function groupByMonth(collection: Collection): MonthGroup[] {
  const keys = new Set<string>();
  for (const entry of [...collection.spells, ...collection.orbs]) keys.add(monthKeyOf(entry));

  return [...keys]
    .sort((a, b) => {
      if (a === '') return 1;
      if (b === '') return -1;
      return b.localeCompare(a);
    })
    .map((key) => {
      const spells = collection.spells.filter((entry) => monthKeyOf(entry) === key);
      const orbs = collection.orbs.filter((entry) => monthKeyOf(entry) === key);
      return { key, label: monthLabel(key), spells, orbs, total: spells.length + orbs.length };
    });
}

const DAY_FORMAT = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });

export function formatEarnedDate(at: string): string {
  if (!at) return 'earlier';
  const [year, month, day] = at.split('-').map(Number);
  return DAY_FORMAT.format(new Date(year, month - 1, day));
}
