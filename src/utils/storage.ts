import { createTimerStorage } from '../core/persistence';
import type { Session } from '../types';

const KEY = 'morning-journal:session';

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
  return { date: todayKey(), checkIn: null, promptId: null, text: '', stage: 'checkin' };
}

/** Returns null if there is nothing stored, it is unreadable, or it is from another day. */
export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Session>;
    if (!parsed || parsed.date !== todayKey()) return null;
    return {
      date: parsed.date,
      checkIn: parsed.checkIn ?? null,
      promptId: parsed.promptId ?? null,
      text: typeof parsed.text === 'string' ? parsed.text : '',
      stage: parsed.stage ?? 'checkin',
    };
  } catch {
    // Private mode, disabled storage, or corrupt JSON — start fresh rather than break.
    return null;
  }
}

export function saveSession(session: Session): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    // Writing is best-effort; the ritual still works without persistence.
  }
}
