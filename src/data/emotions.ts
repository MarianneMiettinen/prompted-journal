import type { BranchId, EmotionId } from '../types';

export interface Emotion {
  value: EmotionId;
  /**
   * Single codepoint, Unicode 11 or earlier. Windows 10's Segoe UI Emoji has no glyphs for
   * Unicode 13/14 emoji (they render as empty boxes) and does not compose ZWJ sequences like
   * 😮‍💨 (they split into two glyphs). Check any new emoji on Windows 10 before adding it.
   */
  emoji: string;
  label: string;
  branch: BranchId;
}

/**
 * The nine shown in the picker. Thirty-one was too much to face first thing in the morning;
 * these nine still reach all seven branches, so every follow-up question pair stays in play.
 *
 * If you add one, give it a branch that already exists. If you replace one, keep the branch
 * coverage complete — an unreachable branch means a set of questions nobody can ever see.
 */
export const PICKER_EMOTIONS: Emotion[] = [
  { value: 'happy', emoji: '😊', label: 'Happy', branch: 'bright' },
  { value: 'excited', emoji: '🤩', label: 'Excited', branch: 'bright' },
  { value: 'calm', emoji: '😌', label: 'Calm', branch: 'settled' },
  { value: 'okay', emoji: '😐', label: 'Okay', branch: 'neutral' },
  { value: 'sad', emoji: '😔', label: 'Sad', branch: 'low' },
  { value: 'anxious', emoji: '😰', label: 'Anxious', branch: 'activated' },
  { value: 'overwhelmed', emoji: '😣', label: 'Overwhelmed', branch: 'activated' },
  { value: 'angry', emoji: '😠', label: 'Angry', branch: 'outward' },
  { value: 'insecure', emoji: '🙃', label: 'Insecure', branch: 'self-critical' },
];

/**
 * Not offered in the picker, but still defined: the prompt bank keys several of its most
 * specific questions to these, and a session saved before the picker shrank must still
 * resolve to a real emotion rather than dumping the person back to the start.
 */
export const OTHER_EMOTIONS: Emotion[] = [
  { value: 'hopeful', emoji: '🌱', label: 'Hopeful', branch: 'bright' },
  { value: 'proud', emoji: '🌟', label: 'Proud', branch: 'bright' },
  { value: 'inspired', emoji: '✨', label: 'Inspired', branch: 'bright' },
  { value: 'grateful', emoji: '🙏', label: 'Grateful', branch: 'settled' },
  { value: 'content', emoji: '🍃', label: 'Content', branch: 'settled' },
  { value: 'loved', emoji: '🥰', label: 'Loved', branch: 'settled' },
  { value: 'relieved', emoji: '😅', label: 'Relieved', branch: 'settled' },
  { value: 'tired', emoji: '😪', label: 'Tired', branch: 'low' },
  { value: 'stressed', emoji: '😖', label: 'Stressed', branch: 'activated' },
  { value: 'restless', emoji: '😬', label: 'Restless', branch: 'activated' },
  { value: 'lonely', emoji: '🥺', label: 'Lonely', branch: 'low' },
  { value: 'numb', emoji: '😶', label: 'Numb', branch: 'low' },
  { value: 'hurt', emoji: '💔', label: 'Hurt', branch: 'low' },
  { value: 'disappointed', emoji: '😞', label: 'Disappointed', branch: 'low' },
  { value: 'embarrassed', emoji: '😳', label: 'Embarrassed', branch: 'self-critical' },
  { value: 'ashamed', emoji: '😓', label: 'Ashamed', branch: 'self-critical' },
  { value: 'guilty', emoji: '😟', label: 'Guilty', branch: 'self-critical' },
  { value: 'jealous', emoji: '😒', label: 'Jealous', branch: 'outward' },
  { value: 'envious', emoji: '👀', label: 'Envious', branch: 'outward' },
  { value: 'frustrated', emoji: '😑', label: 'Frustrated', branch: 'outward' },
  { value: 'resentful', emoji: '😤', label: 'Resentful', branch: 'outward' },
  { value: 'confused', emoji: '😕', label: 'Confused', branch: 'neutral' },
];

export const ALL_EMOTIONS: Emotion[] = [...PICKER_EMOTIONS, ...OTHER_EMOTIONS];

export function findEmotion(id: EmotionId | null): Emotion | null {
  if (!id) return null;
  return ALL_EMOTIONS.find((emotion) => emotion.value === id) ?? null;
}
