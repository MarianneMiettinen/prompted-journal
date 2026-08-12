import { createTimerStorage } from '../core/persistence';
import type { Session } from '../types';

const KEY = 'morning-journal:session';

/**
 * Bump whenever the shape of Session changes. A stored session from an older schema is
 * discarded rather than half-adopted — version 1 held mood/energy/topic, which the
 * emotion-and-branch check-in replaced.
 */
const SCHEMA_VERSION = 2;

interface Envelope {
  v: number;
  session: Session;
}

export const JOURNAL_TIMER_KEY = 'morning-journal:journal';
export const MEDITATION_TIMER_KEY = 'morning-journal:meditation';

/**
 * The timers persist themselves independently of the session, so starting a new
 * ritual has to wipe them — otherwise tomorrow opens on a timer already at 0:00.
 */
export function clearTimers(): void {
  createTimerStorage(JOURNAL_TIMER_KEY).clear();
  createTimerStorage(MEDITATION_TIMER_KEY).clear();
}

/** Local calendar date, not UTC — the ritual is tied to the user's morning. */
export function todayKey(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function freshSession(): Session {
  return { date: todayKey(), checkIn: null, promptId: null, text: '', stage: 'emotion' };
}

/** Returns null if there is nothing stored, it is unreadable, from another schema, or another day. */
export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<Envelope>;
    if (!parsed || parsed.v !== SCHEMA_VERSION) return null;

    const session = parsed.session;
    if (!session || session.date !== todayKey()) return null;

    return {
      date: session.date,
      checkIn: session.checkIn ?? null,
      promptId: session.promptId ?? null,
      text: typeof session.text === 'string' ? session.text : '',
      stage: session.stage ?? 'emotion',
    };
  } catch {
    // Private mode, disabled storage, or corrupt JSON — start fresh rather than break.
    return null;
  }
}

export function saveSession(session: Session): void {
  try {
    const envelope: Envelope = { v: SCHEMA_VERSION, session };
    localStorage.setItem(KEY, JSON.stringify(envelope));
  } catch {
    // Writing is best-effort; the ritual still works without persistence.
  }
}
