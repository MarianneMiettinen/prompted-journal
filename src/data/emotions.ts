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

export interface EmotionGroup {
  /** Shown as a visible heading — the groups are labelled, never left to be inferred. */
  title: string;
  hint: string;
  emotions: Emotion[];
}

/**
 * Three visible groups rather than one long list. The first is the fast path; the other
 * two exist because "sad" and "insecure" are not the same morning, and the prompt is only
 * as good as the word the person picked.
 */
export const EMOTION_GROUPS: EmotionGroup[] = [
  {
    title: 'Start here',
    hint: 'The nearest word is fine.',
    emotions: [
      { value: 'happy', emoji: '😊', label: 'Happy', branch: 'bright' },
      { value: 'calm', emoji: '😌', label: 'Calm', branch: 'settled' },
      { value: 'okay', emoji: '😐', label: 'Okay', branch: 'neutral' },
      { value: 'sad', emoji: '😔', label: 'Sad', branch: 'low' },
      { value: 'anxious', emoji: '😰', label: 'Anxious', branch: 'activated' },
      { value: 'angry', emoji: '😠', label: 'Angry', branch: 'outward' },
      { value: 'tired', emoji: '😪', label: 'Tired', branch: 'low' },
    ],
  },
  {
    title: 'Or something lighter',
    hint: 'Good mornings deserve a precise word too.',
    emotions: [
      { value: 'excited', emoji: '🤩', label: 'Excited', branch: 'bright' },
      { value: 'hopeful', emoji: '🌱', label: 'Hopeful', branch: 'bright' },
      { value: 'proud', emoji: '🌟', label: 'Proud', branch: 'bright' },
      { value: 'inspired', emoji: '✨', label: 'Inspired', branch: 'bright' },
      { value: 'grateful', emoji: '🙏', label: 'Grateful', branch: 'settled' },
      { value: 'content', emoji: '🍃', label: 'Content', branch: 'settled' },
      { value: 'loved', emoji: '🥰', label: 'Loved', branch: 'settled' },
      { value: 'relieved', emoji: '😅', label: 'Relieved', branch: 'settled' },
    ],
  },
  {
    title: 'Or something heavier',
    hint: 'Naming it precisely tends to make it smaller.',
    emotions: [
      { value: 'overwhelmed', emoji: '😣', label: 'Overwhelmed', branch: 'activated' },
      { value: 'stressed', emoji: '😖', label: 'Stressed', branch: 'activated' },
      { value: 'restless', emoji: '😬', label: 'Restless', branch: 'activated' },
      { value: 'lonely', emoji: '🥺', label: 'Lonely', branch: 'low' },
      { value: 'numb', emoji: '😶', label: 'Numb', branch: 'low' },
      { value: 'hurt', emoji: '💔', label: 'Hurt', branch: 'low' },
      { value: 'disappointed', emoji: '😞', label: 'Disappointed', branch: 'low' },
      { value: 'insecure', emoji: '🙃', label: 'Insecure', branch: 'self-critical' },
      { value: 'embarrassed', emoji: '😳', label: 'Embarrassed', branch: 'self-critical' },
      { value: 'ashamed', emoji: '😓', label: 'Ashamed', branch: 'self-critical' },
      { value: 'guilty', emoji: '😟', label: 'Guilty', branch: 'self-critical' },
      { value: 'jealous', emoji: '😒', label: 'Jealous', branch: 'outward' },
      { value: 'envious', emoji: '👀', label: 'Envious', branch: 'outward' },
      { value: 'frustrated', emoji: '😑', label: 'Frustrated', branch: 'outward' },
      { value: 'resentful', emoji: '😤', label: 'Resentful', branch: 'outward' },
      { value: 'confused', emoji: '😕', label: 'Confused', branch: 'neutral' },
    ],
  },
];

export const ALL_EMOTIONS: Emotion[] = EMOTION_GROUPS.flatMap((group) => group.emotions);

export function findEmotion(id: EmotionId | null): Emotion | null {
  if (!id) return null;
  return ALL_EMOTIONS.find((emotion) => emotion.value === id) ?? null;
}
