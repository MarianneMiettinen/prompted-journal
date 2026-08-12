import type { Energy, Mood, Topic } from '../types';

export const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: 'great', emoji: '😊', label: 'Great' },
  { value: 'good', emoji: '🙂', label: 'Good' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'low', emoji: '😔', label: 'Low' },
  { value: 'overwhelmed', emoji: '😣', label: 'Overwhelmed' },
];

export const ENERGIES: { value: Energy; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const TOPICS: { value: Topic; label: string }[] = [
  { value: 'work', label: 'Work' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'health', label: 'Health' },
  { value: 'money', label: 'Money' },
  { value: 'growth', label: 'Personal growth' },
  { value: 'nothing', label: 'Nothing specific' },
];
