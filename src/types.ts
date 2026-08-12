/**
 * Emotions are grouped into branches. The branch decides which two follow-up
 * questions get asked, and is the main input to prompt selection — so several
 * emotions that need the same conversation can share one set of questions.
 */
export type BranchId =
  | 'activated' // anxious, overwhelmed, stressed, restless
  | 'low' // sad, tired, numb, lonely, hurt, disappointed
  | 'self-critical' // insecure, embarrassed, ashamed, guilty
  | 'outward' // angry, frustrated, jealous, envious, resentful
  | 'bright' // happy, excited, hopeful, proud, inspired
  | 'settled' // calm, content, grateful, loved, relieved
  | 'neutral'; // okay, confused

export type EmotionId = string;

export type Stage = 'emotion' | 'questions' | 'journal' | 'meditation' | 'complete';

export interface CheckIn {
  emotion: EmotionId;
  /** Answer ids for the two branch questions, in order. */
  q1: string;
  q2: string;
}

export interface Session {
  /** Local YYYY-MM-DD. A session from an earlier day is discarded on load. */
  date: string;
  checkIn: CheckIn | null;
  promptId: string | null;
  text: string;
  stage: Stage;
}
