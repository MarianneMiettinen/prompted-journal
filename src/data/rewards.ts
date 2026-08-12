export type RewardKind = 'spell' | 'orb';

export interface Reward {
  id: string;
  kind: RewardKind;
  name: string;
  /** Aldric's line when it appears. Second person, warm, never congratulatory-hollow. */
  description: string;
  colour: string;
}

/** Earned by journaling. Shelved on the left. */
export const SPELLS: Reward[] = [
  { id: 'clearveil', kind: 'spell', name: 'Clearveil', colour: '#E8B84B', description: 'Lifts the fog from a thought you had been circling.' },
  { id: 'lanternheart', kind: 'spell', name: 'Lanternheart', colour: '#FCD34D', description: 'Carries a small light into rooms you would rather not enter.' },
  { id: 'stillwater', kind: 'spell', name: 'Stillwater', colour: '#86EFAC', description: 'Settles what has been stirred up, so you can see the bottom again.' },
  { id: 'featherfall', kind: 'spell', name: 'Featherfall', colour: '#FDBA74', description: 'Slows a landing that was going to be hard.' },
  { id: 'emberwake', kind: 'spell', name: 'Emberwake', colour: '#FCA5A5', description: 'Keeps a fire alive without letting it burn the house down.' },
  { id: 'softglass', kind: 'spell', name: 'Softglass', colour: '#F0ABFC', description: 'Turns a sharp memory over until its edges dull.' },
  { id: 'nightbloom', kind: 'spell', name: 'Nightbloom', colour: '#C4B5FD', description: 'Opens only in the dark. Some things do.' },
  { id: 'openhand', kind: 'spell', name: 'Openhand', colour: '#93C5FD', description: 'Loosens a grip you did not know you were holding.' },
  { id: 'quietbell', kind: 'spell', name: 'Quietbell', colour: '#6EE7B7', description: 'Rings once, in a voice only you can hear, when something matters.' },
  { id: 'thawlight', kind: 'spell', name: 'Thawlight', colour: '#FDE68A', description: 'Warms what went numb, slowly enough that it does not hurt.' },
  { id: 'deeproot', kind: 'spell', name: 'Deeproot', colour: '#A3E635', description: 'Holds you steady when the weather above ground turns.' },
  { id: 'tidewalk', kind: 'spell', name: 'Tidewalk', colour: '#7DD3FC', description: 'Lets you cross a feeling without being pulled under by it.' },
  { id: 'warmstone', kind: 'spell', name: 'Warmstone', colour: '#FDBA74', description: 'Keeps its heat long after the fire has gone out.' },
  { id: 'farsight', kind: 'spell', name: 'Farsight', colour: '#818CF8', description: 'Shows today from a week away, where it is much smaller.' },
];

/** Earned by sitting with the gong. Shelved on the right. */
export const ORBS: Reward[] = [
  { id: 'resonite', kind: 'orb', name: 'Resonite', colour: '#7C6FF7', description: 'A minute of stillness, held in glass. Your breath gave it its power.' },
  { id: 'stillite', kind: 'orb', name: 'Stillite', colour: '#A78BFA', description: 'Presence, crystallised. It remembers that you stayed.' },
  { id: 'vibrastone', kind: 'orb', name: 'Vibrastone', colour: '#818CF8', description: 'The gong is still sounding inside this one. It always will be.' },
  { id: 'hushglass', kind: 'orb', name: 'Hushglass', colour: '#93C5FD', description: 'Holds the quiet you made, for a morning when you cannot find any.' },
  { id: 'bellcore', kind: 'orb', name: 'Bellcore', colour: '#C4B5FD', description: 'One clear note, kept whole.' },
  { id: 'slowlight', kind: 'orb', name: 'Slowlight', colour: '#F0ABFC', description: 'Light that takes its time. So did you.' },
  { id: 'breathstone', kind: 'orb', name: 'Breathstone', colour: '#7DD3FC', description: 'Counts nothing, measures nothing. It simply sat with you.' },
  { id: 'echopearl', kind: 'orb', name: 'Echopearl', colour: '#A5B4FC', description: 'The last of the sound, before the room went quiet.' },
];

export const ALL_REWARDS = [...SPELLS, ...ORBS];

export function findReward(id: string): Reward | null {
  return ALL_REWARDS.find((reward) => reward.id === id) ?? null;
}

/**
 * Picks the next reward of a kind: something not yet collected, so each session brings a
 * new one. Once the whole set is collected it starts round again rather than dead-ending.
 */
export function nextReward(kind: RewardKind, collected: string[]): Reward {
  const pool = kind === 'spell' ? SPELLS : ORBS;
  const fresh = pool.filter((reward) => !collected.includes(reward.id));
  const from = fresh.length > 0 ? fresh : pool;
  return from[Math.floor(Math.random() * from.length)];
}
