const KEY = 'prompted-journal:collection';
const SCHEMA_VERSION = 1;

export interface Collection {
  /** Reward ids, oldest first. Duplicates are allowed once a set has been completed. */
  spells: string[];
  orbs: string[];
}

interface Envelope {
  v: number;
  collection: Collection;
}

export const EMPTY_COLLECTION: Collection = { spells: [], orbs: [] };

export function loadCollection(): Collection {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY_COLLECTION;
    const parsed = JSON.parse(raw) as Partial<Envelope>;
    if (parsed?.v !== SCHEMA_VERSION) return EMPTY_COLLECTION;
    return {
      spells: Array.isArray(parsed.collection?.spells) ? parsed.collection.spells : [],
      orbs: Array.isArray(parsed.collection?.orbs) ? parsed.collection.orbs : [],
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
 * Best effort — it is granted silently in Chrome for installed apps and ignored elsewhere.
 */
export function requestDurableStorage(): void {
  void navigator.storage?.persist?.().catch(() => undefined);
}
