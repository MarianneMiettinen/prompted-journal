export type Mood = 'great' | 'good' | 'okay' | 'low' | 'overwhelmed';
export type Energy = 'low' | 'medium' | 'high';
export type Topic = 'work' | 'relationships' | 'health' | 'money' | 'growth' | 'nothing';
export type Stage = 'checkin' | 'journal' | 'meditation' | 'complete';

export interface CheckIn {
  mood: Mood;
  energy: Energy;
  topic: Topic;
}

export interface Session {
  /** Local YYYY-MM-DD. A session from an earlier day is discarded on load. */
  date: string;
  checkIn: CheckIn | null;
  promptId: string | null;
  text: string;
  stage: Stage;
}
