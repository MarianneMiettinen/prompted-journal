import type { CheckIn, Energy, Mood, Topic } from '../types';

export interface Prompt {
  id: string;
  text: string;
  /** Omitted dimension = suits any value. A listed dimension must match, or the prompt is out. */
  mood?: Mood[];
  energy?: Energy[];
  topic?: Topic[];
}

/**
 * Curated bank. Selection is a local score, never an API call.
 * Keep at least one prompt with no criteria at all — it is the guaranteed fallback.
 */
export const PROMPTS: Prompt[] = [
  // — Overwhelmed —
  {
    id: 'overwhelmed-work',
    text: 'What is actually important today, and what can safely wait?',
    mood: ['overwhelmed'],
    topic: ['work'],
  },
  {
    id: 'overwhelmed-relationships',
    text: 'Whose expectations are you carrying right now, and which of them did you actually agree to?',
    mood: ['overwhelmed'],
    topic: ['relationships'],
  },
  {
    id: 'overwhelmed-money',
    text: 'Which part of the money worry is a decision you could make this week, and which part is just weather?',
    mood: ['overwhelmed'],
    topic: ['money'],
  },
  {
    id: 'overwhelmed-health',
    text: 'What has your body been asking for that keeps getting postponed?',
    mood: ['overwhelmed'],
    topic: ['health'],
  },
  {
    id: 'overwhelmed-growth',
    text: 'You are trying to grow while holding a lot. What could you put down for a while without losing it?',
    mood: ['overwhelmed'],
    topic: ['growth'],
  },
  {
    id: 'overwhelmed-any',
    text: 'If you could only carry one of the things on your mind today, which one would you pick up?',
    mood: ['overwhelmed'],
  },
  {
    id: 'overwhelmed-low-energy',
    text: 'What would today look like if the aim were to move through it gently rather than get it all right?',
    mood: ['overwhelmed', 'low'],
    energy: ['low'],
  },

  // — Low —
  {
    id: 'low-low-energy',
    text: 'What would make today feel just 10% easier?',
    mood: ['low'],
    energy: ['low'],
  },
  {
    id: 'low-work',
    text: 'What part of today is genuinely yours to decide?',
    mood: ['low'],
    topic: ['work'],
  },
  {
    id: 'low-relationships',
    text: 'Who would you want to hear from today, and what would you want them to say?',
    mood: ['low'],
    topic: ['relationships'],
  },
  {
    id: 'low-health',
    text: 'What is the smallest kind thing you could do for your body today?',
    mood: ['low'],
    topic: ['health'],
  },
  {
    id: 'low-money',
    text: 'What would "enough" look like this week — not this year?',
    mood: ['low'],
    topic: ['money'],
  },
  {
    id: 'low-growth',
    text: "What have you already come through that today's version of you has forgotten about?",
    mood: ['low'],
    topic: ['growth'],
  },
  {
    id: 'low-any',
    text: 'What is heavy this morning? Describe it plainly, without solving it.',
    mood: ['low'],
  },

  // — Okay —
  {
    id: 'okay-nothing',
    text: "What's true this morning that you haven't said out loud to anyone yet?",
    mood: ['okay'],
    topic: ['nothing'],
  },
  {
    id: 'okay-work',
    text: 'What is sitting unfinished that keeps quietly pulling at your attention?',
    mood: ['okay'],
    topic: ['work'],
  },
  {
    id: 'okay-any',
    text: 'Is there a decision you have been leaving open? What makes it hard to close?',
    mood: ['okay'],
  },

  // — Good / Great —
  {
    id: 'good-high-work',
    text: 'If today went unusually well, what would have happened by the evening?',
    mood: ['good', 'great'],
    energy: ['high'],
    topic: ['work'],
  },
  {
    id: 'good-relationships',
    text: 'Who has been on your mind lately, and what would you want to tell them?',
    mood: ['good', 'great'],
    topic: ['relationships'],
  },
  {
    id: 'great-growth',
    text: 'What are you getting better at that nobody has noticed yet?',
    mood: ['great'],
    topic: ['growth'],
  },
  {
    id: 'good-health',
    text: 'What have you been doing lately that your body seems to like?',
    mood: ['good', 'great'],
    topic: ['health'],
  },
  {
    id: 'good-money',
    text: "What does money currently buy you that you'd protect first?",
    mood: ['good', 'great'],
    topic: ['money'],
  },
  {
    id: 'great-any',
    text: 'What is going quietly right, and what is keeping it going?',
    mood: ['great'],
  },

  // — Energy-led —
  {
    id: 'high-growth',
    text: 'What would be worth making meaningful progress on today?',
    energy: ['high'],
    topic: ['growth'],
  },
  {
    id: 'high-nothing',
    text: 'There is room this morning. What have you been meaning to think about properly?',
    energy: ['high'],
    topic: ['nothing'],
  },
  {
    id: 'high-health',
    text: 'What does your body have energy for today that it usually does not?',
    energy: ['high'],
    topic: ['health'],
  },
  {
    id: 'medium-work',
    text: 'What is the one thing on the list you would be most relieved to finish?',
    energy: ['medium'],
    topic: ['work'],
  },
  {
    id: 'low-energy-nothing',
    text: 'What would you like less of today?',
    energy: ['low'],
    topic: ['nothing'],
  },

  // — Topic-led —
  {
    id: 'topic-work',
    text: 'Where are you spending effort that nobody is actually asking for?',
    topic: ['work'],
  },
  {
    id: 'topic-relationships',
    text: 'What conversation are you rehearsing, and what do you actually want from it?',
    topic: ['relationships'],
  },
  {
    id: 'topic-money',
    text: 'What is the next small, boring thing that would make money feel less loud?',
    topic: ['money'],
  },
  {
    id: 'topic-health',
    text: 'What does taking care of yourself mean this week, concretely?',
    topic: ['health'],
  },
  {
    id: 'topic-growth',
    text: 'What would you attempt if you could stop halfway without it meaning anything about you?',
    topic: ['growth'],
  },

  // — Fallbacks (no criteria) —
  {
    id: 'open-anywhere',
    text: 'What is on your mind this morning? Start anywhere.',
  },
  {
    id: 'open-feel',
    text: 'What do you want today to feel like, and what is one thing that would make that likelier?',
  },
];

const WEIGHTS = { mood: 3, energy: 2, topic: 3 } as const;

/** Returns the id of the best-matching prompt. Ties are broken at random. */
export function selectPromptId(checkIn: CheckIn): string {
  let best: Prompt[] = [];
  let bestScore = -1;

  for (const prompt of PROMPTS) {
    let score = 0;
    let eligible = true;

    if (prompt.mood) {
      if (prompt.mood.includes(checkIn.mood)) score += WEIGHTS.mood;
      else eligible = false;
    }
    if (eligible && prompt.energy) {
      if (prompt.energy.includes(checkIn.energy)) score += WEIGHTS.energy;
      else eligible = false;
    }
    if (eligible && prompt.topic) {
      if (prompt.topic.includes(checkIn.topic)) score += WEIGHTS.topic;
      else eligible = false;
    }
    if (!eligible) continue;

    if (score > bestScore) {
      bestScore = score;
      best = [prompt];
    } else if (score === bestScore) {
      best.push(prompt);
    }
  }

  // The criteria-free fallbacks guarantee `best` is never empty.
  return best[Math.floor(Math.random() * best.length)].id;
}

export function getPromptText(id: string | null): string {
  return PROMPTS.find((p) => p.id === id)?.text ?? PROMPTS[PROMPTS.length - 1].text;
}
