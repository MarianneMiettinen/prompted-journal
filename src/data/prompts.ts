import { findEmotion } from './emotions';
import type { BranchId, CheckIn, EmotionId } from '../types';

export interface Prompt {
  id: string;
  text: string;
  /** Any dimension that is listed must match, or the prompt is out of the running. */
  emotion?: EmotionId[];
  branch?: BranchId[];
  q1?: string[];
  q2?: string[];
}

/**
 * The bank. Selection is a local score — no API, no model, no network.
 *
 * Every branch needs at least one branch-only prompt so that any combination of answers
 * resolves to something, and there is one criteria-free prompt as the final backstop.
 */
export const PROMPTS: Prompt[] = [
  // ——————————————————————————— activated ———————————————————————————
  {
    id: 'act-base-size',
    text: 'What is the actual size of this, if you measure it instead of feeling it?',
    branch: ['activated'],
  },
  {
    id: 'act-base-list',
    text: 'Write down everything pulling at you. Then mark the ones that are genuinely today’s.',
    branch: ['activated'],
  },
  {
    id: 'act-body',
    text: 'Your body noticed before you did. What has it been trying to tell you?',
    branch: ['activated'],
    q1: ['act-body'],
  },
  {
    id: 'act-thoughts',
    text: 'Which thought keeps coming back? Write it down word for word, then answer it.',
    branch: ['activated'],
    q1: ['act-thoughts'],
  },
  {
    id: 'act-doing',
    text: 'You’re moving faster than the day requires. What are you moving away from?',
    branch: ['activated'],
    q1: ['act-doing'],
  },
  {
    id: 'act-everywhere',
    text: 'If you had to put this feeling in one room of your life, which room would it be?',
    branch: ['activated'],
    q1: ['act-everywhere'],
  },
  {
    id: 'act-today',
    text: 'What is the first, smallest thing today actually asks of you?',
    branch: ['activated'],
    q2: ['act-today'],
  },
  {
    id: 'act-ahead',
    text: 'What are you rehearsing for, and how much of the rehearsal is any use?',
    branch: ['activated'],
    q2: ['act-ahead'],
  },
  {
    id: 'act-unresolved',
    text: 'What is still open, and what would closing it actually require?',
    branch: ['activated'],
    q2: ['act-unresolved'],
  },
  {
    id: 'act-all',
    text: 'You can’t carry all of it this morning. Which one thing gets today?',
    branch: ['activated'],
    q2: ['act-all'],
  },
  {
    id: 'overwhelmed-priority',
    text: 'What is genuinely important today, and what can safely wait until it isn’t?',
    emotion: ['overwhelmed'],
  },
  {
    id: 'anxious-all-the-way',
    text: 'What are you afraid will happen — said plainly, all the way to the end?',
    emotion: ['anxious'],
    q1: ['act-thoughts'],
  },
  {
    id: 'stressed-deadline',
    text: 'What’s the deadline underneath this, and who set it?',
    emotion: ['stressed'],
  },
  {
    id: 'restless-body',
    text: 'What does your body want to do that you haven’t let it?',
    emotion: ['restless'],
  },

  // ——————————————————————————— low ———————————————————————————
  {
    id: 'low-base-easier',
    text: 'What would make today feel ten percent easier?',
    branch: ['low'],
  },
  {
    id: 'low-base-describe',
    text: 'Describe how this actually feels, without fixing it or explaining it away.',
    branch: ['low'],
  },
  {
    id: 'low-today',
    text: 'Something shifted since yesterday. When did you last feel like yourself?',
    branch: ['low'],
    q1: ['low-today'],
  },
  {
    id: 'low-days',
    text: 'A few days is long enough to see a pattern. What has been repeating?',
    branch: ['low'],
    q1: ['low-days'],
  },
  {
    id: 'low-weeks',
    text: 'Weeks is a while to carry something. What has it cost you so far?',
    branch: ['low'],
    q1: ['low-weeks'],
  },
  {
    id: 'low-longer',
    text: 'This has been with you a long time. What would change if you stopped treating it as temporary?',
    branch: ['low'],
    q1: ['low-longer'],
  },
  {
    id: 'low-understood',
    text: 'If one person understood this completely, what exactly would you want them to get?',
    branch: ['low'],
    q2: ['low-understood'],
  },
  {
    id: 'low-alone',
    text: 'What does being alone give you right now that nothing else does?',
    branch: ['low'],
    q2: ['low-alone'],
  },
  {
    id: 'low-said',
    text: 'Say it here first. What is the sentence you haven’t said out loud?',
    branch: ['low'],
    q2: ['low-said'],
  },
  {
    id: 'low-unknown',
    text: 'You don’t have to know. What do you notice, without deciding what it means?',
    branch: ['low'],
    q2: ['low-unknown'],
  },
  {
    id: 'lonely-reach',
    text: 'Who would you reach for if reaching out cost you nothing? What stops you?',
    emotion: ['lonely'],
  },
  {
    id: 'tired-cost',
    text: 'What has been taking more from you than it gives back?',
    emotion: ['tired'],
  },
  {
    id: 'numb-last-felt',
    text: 'When did you last feel something clearly? What was it?',
    emotion: ['numb'],
  },
  {
    id: 'hurt-two-things',
    text: 'What happened, and what did it mean to you? Those are two different things — write both.',
    emotion: ['hurt'],
  },
  {
    id: 'disappointed-expectation',
    text: 'What were you expecting? And whose expectation was it originally?',
    emotion: ['disappointed'],
  },
  {
    id: 'sad-grief',
    text: 'What are you grieving that you haven’t called grief?',
    emotion: ['sad'],
    q1: ['low-longer', 'low-weeks'],
  },

  // ——————————————————————— self-critical ———————————————————————
  {
    id: 'self-base-friend',
    text: 'Write what you’re telling yourself. Then write what you’d say to a friend in exactly this position.',
    branch: ['self-critical'],
  },
  {
    id: 'self-base-responsible',
    text: 'What are you holding yourself responsible for that was never fully yours?',
    branch: ['self-critical'],
  },
  {
    id: 'self-did',
    text: 'What actually happened, and what have you added to it since?',
    branch: ['self-critical'],
    q1: ['self-did'],
  },
  {
    id: 'self-didnt',
    text: 'What stopped you? Not the reason you’d give someone else — the real one.',
    branch: ['self-critical'],
    q1: ['self-didnt'],
  },
  {
    id: 'self-seemed',
    text: 'How you came across and who you are aren’t the same thing. Which one are you judging?',
    branch: ['self-critical'],
    q1: ['self-seemed'],
  },
  {
    id: 'self-me',
    text: 'This feeling is speaking in general terms. Make it specific: what exactly is it accusing you of?',
    branch: ['self-critical'],
    q1: ['self-me'],
  },
  {
    id: 'self-mine',
    text: 'How long have you spoken to yourself this way? Where did you learn it?',
    branch: ['self-critical'],
    q2: ['self-mine'],
  },
  {
    id: 'self-someone',
    text: 'Whose voice is it? What would you say back to them if you could?',
    branch: ['self-critical'],
    q2: ['self-someone'],
  },
  {
    id: 'self-everyone',
    text: '"Everyone" isn’t a real audience. Who specifically are you picturing — and do they even have a view?',
    branch: ['self-critical'],
    q2: ['self-everyone'],
  },
  {
    id: 'self-unclear',
    text: 'You can’t place the voice. What does it want from you?',
    branch: ['self-critical'],
    q2: ['self-unclear'],
  },
  {
    id: 'insecure-enough',
    text: 'What do you think you’d have to be, to be enough here? And who decided that?',
    emotion: ['insecure'],
  },
  {
    id: 'guilty-repair',
    text: 'Guilt says you did something wrong. Is that true — and if it is, what would repair look like?',
    emotion: ['guilty'],
  },
  {
    id: 'ashamed-difference',
    text: 'Shame says the problem is you, not the thing you did. Write out the difference, carefully.',
    emotion: ['ashamed'],
  },
  {
    id: 'embarrassed-week',
    text: 'Who saw, and what will it actually cost you a week from now?',
    emotion: ['embarrassed'],
  },

  // ————————————————————————— outward —————————————————————————
  {
    id: 'out-base-unedited',
    text: 'Write the unedited version. Nobody is reading this.',
    branch: ['outward'],
  },
  {
    id: 'out-base-boundary',
    text: 'What boundary was crossed, or what need went unmet? Name it precisely.',
    branch: ['outward'],
  },
  {
    id: 'out-person',
    text: 'What did they do, and what did you need from them instead?',
    branch: ['outward'],
    q1: ['out-person'],
  },
  {
    id: 'out-situation',
    text: 'What part of this situation is actually within your reach?',
    branch: ['outward'],
    q1: ['out-situation'],
  },
  {
    id: 'out-self',
    text: 'What are you angry at yourself for, and what would you need to hear to set it down?',
    branch: ['outward'],
    q1: ['out-self'],
  },
  {
    id: 'out-unfair',
    text: 'What rule about fairness is being broken here? Where did you learn it?',
    branch: ['outward'],
    q1: ['out-unfair'],
  },
  {
    id: 'out-silent',
    text: 'What does saying nothing cost you? What would saying it cost?',
    branch: ['outward'],
    q2: ['out-silent'],
  },
  {
    id: 'out-head',
    text: 'You’ve already had this argument internally. What did you say — and what did they say back?',
    branch: ['outward'],
    q2: ['out-head'],
  },
  {
    id: 'out-third',
    text: 'You told someone else. What made them easier to tell than the person involved?',
    branch: ['outward'],
    q2: ['out-third'],
  },
  {
    id: 'out-direct',
    text: 'You said it. What happened, and what still feels unfinished?',
    branch: ['outward'],
    q2: ['out-direct'],
  },
  {
    id: 'jealous-losing',
    text: 'What are you afraid of losing? And how likely is that, honestly?',
    emotion: ['jealous'],
  },
  {
    id: 'envious-signal',
    text: 'What does that person have that you want? Envy usually points at something — what?',
    emotion: ['envious'],
  },
  {
    id: 'resentful-unnoticed',
    text: 'What have you been giving that hasn’t been noticed? What would asking directly sound like?',
    emotion: ['resentful'],
  },
  {
    id: 'frustrated-immovable',
    text: 'Where are you pushing against something that won’t move? What else could that energy do?',
    emotion: ['frustrated'],
  },

  // ————————————————————————— bright —————————————————————————
  {
    id: 'bright-base-repeat',
    text: 'What’s going right, and what’s keeping it going? Be specific enough to repeat it.',
    branch: ['bright'],
  },
  {
    id: 'bright-base-progress',
    text: 'What would be worth making meaningful progress on today?',
    branch: ['bright'],
  },
  {
    id: 'bright-happened',
    text: 'Write it down properly, while it’s fresh. What happened, and why did it land?',
    branch: ['bright'],
    q1: ['bright-happened'],
  },
  {
    id: 'bright-coming',
    text: 'What are you looking forward to — and what would make it better than you’re picturing?',
    branch: ['bright'],
    q1: ['bright-coming'],
  },
  {
    id: 'bright-change',
    text: 'Something in you has shifted. What can you do now that you couldn’t six months ago?',
    branch: ['bright'],
    q1: ['bright-change'],
  },
  {
    id: 'bright-nothing',
    text: 'It arrived without a reason. What does that tell you about where you are?',
    branch: ['bright'],
    q1: ['bright-nothing'],
  },
  {
    id: 'bright-solid',
    text: 'What would you like to build on this, while it’s steady?',
    branch: ['bright'],
    q2: ['bright-solid'],
  },
  {
    id: 'bright-mostly',
    text: 'What would take the wobble out of it?',
    branch: ['bright'],
    q2: ['bright-mostly'],
  },
  {
    id: 'bright-braced',
    text: 'You’re waiting for it to drop. Where did you learn to hold good things that lightly?',
    branch: ['bright'],
    q2: ['bright-braced'],
  },
  {
    id: 'bright-fragile',
    text: 'What would it mean to let yourself have this, even if it doesn’t last?',
    branch: ['bright'],
    q2: ['bright-fragile'],
  },
  {
    id: 'proud-full-account',
    text: 'What did this actually take from you? Give yourself the full account, not the modest one.',
    emotion: ['proud'],
  },
  {
    id: 'excited-most-of-it',
    text: 'What’s the version of today that makes the most of this?',
    emotion: ['excited'],
  },
  {
    id: 'hopeful-first-step',
    text: 'What are you hoping for, and what’s the first honest step toward it?',
    emotion: ['hopeful'],
  },
  {
    id: 'inspired-catch-it',
    text: 'Catch it before it fades. What do you want to make, and what’s the first move?',
    emotion: ['inspired'],
  },

  // ————————————————————————— settled —————————————————————————
  {
    id: 'set-base-record',
    text: 'What is quietly right at the moment? Write it down so you can find it again on a harder day.',
    branch: ['settled'],
  },
  {
    id: 'set-base-good-day',
    text: 'What does a good day look like from here?',
    branch: ['settled'],
  },
  {
    id: 'set-rest',
    text: 'What did rest give back to you? What would it take to have this more often?',
    branch: ['settled'],
    q1: ['set-rest'],
  },
  {
    id: 'set-resolved',
    text: 'Something closed. Now that you can see it from outside, what was it costing you?',
    branch: ['settled'],
    q1: ['set-resolved'],
  },
  {
    id: 'set-someone',
    text: 'Who is this? And do they know what they do for you?',
    branch: ['settled'],
    q1: ['set-someone'],
  },
  {
    id: 'set-unsure',
    text: 'Nothing obvious caused this. What conditions have you quietly been getting right?',
    branch: ['settled'],
    q1: ['set-unsure'],
  },
  {
    id: 'set-less',
    text: 'What would you take out of today to keep this feeling?',
    branch: ['settled'],
    q2: ['set-less'],
  },
  {
    id: 'set-no',
    text: 'What are you going to say no to today — and what words will you use?',
    branch: ['settled'],
    q2: ['set-no'],
  },
  {
    id: 'set-people',
    text: 'Who do you want to be around today, and what for?',
    branch: ['settled'],
    q2: ['set-people'],
  },
  {
    id: 'set-quiet',
    text: 'What do you want to keep private about this, and why?',
    branch: ['settled'],
    q2: ['set-quiet'],
  },
  {
    id: 'grateful-as-if-sending',
    text: 'Who or what are you grateful for? Write it as though you were going to send it.',
    emotion: ['grateful'],
  },
  {
    id: 'loved-how-you-know',
    text: 'How do you know you’re loved? Which specific moments told you?',
    emotion: ['loved'],
  },
  {
    id: 'relieved-what-ended',
    text: 'What has ended? And what were you carrying the whole time it was open?',
    emotion: ['relieved'],
  },
  {
    id: 'calm-makes-possible',
    text: 'What does calm make possible today that anxiety wouldn’t?',
    emotion: ['calm'],
  },

  // ————————————————————————— neutral —————————————————————————
  {
    id: 'neu-base-unsaid',
    text: 'What’s true this morning that you haven’t said out loud yet?',
    branch: ['neutral'],
  },
  {
    id: 'neu-base-24h',
    text: 'Start with the last twenty-four hours. What happened, and what did you make of it?',
    branch: ['neutral'],
  },
  {
    id: 'neu-genuine',
    text: 'Steady is worth something. What’s holding you steady at the moment?',
    branch: ['neutral'],
    q1: ['neu-genuine'],
  },
  {
    id: 'neu-easiest',
    text: '"Okay" is the word that ends conversations. What word were you avoiding?',
    branch: ['neutral'],
    q1: ['neu-easiest'],
  },
  {
    id: 'neu-unchecked',
    text: 'You haven’t looked yet. Look now, and write the first honest thing.',
    branch: ['neutral'],
    q1: ['neu-unchecked'],
  },
  {
    id: 'neu-under',
    text: 'Something’s underneath. Describe it before you try to name it.',
    branch: ['neutral'],
    q1: ['neu-under'],
  },
  {
    id: 'neu-write',
    text: 'Write without stopping, and don’t decide where it’s going.',
    branch: ['neutral'],
    q2: ['neu-write'],
  },
  {
    id: 'neu-name',
    text: 'Name one thing that’s true right now. Then one more. Keep going.',
    branch: ['neutral'],
    q2: ['neu-name'],
  },
  {
    id: 'neu-still',
    text: 'What comes up when nothing is distracting you?',
    branch: ['neutral'],
    q2: ['neu-still'],
  },
  {
    id: 'neu-move',
    text: 'What has your body been asking for lately?',
    branch: ['neutral'],
    q2: ['neu-move'],
  },
  {
    id: 'confused-two-directions',
    text: 'What are the two things pulling in different directions? Give each one its own paragraph.',
    emotion: ['confused'],
  },

  // ————————————————————————— backstop —————————————————————————
  {
    id: 'open-anywhere',
    text: 'What’s on your mind this morning? Start anywhere.',
  },
];

/**
 * Tuned so that a named-emotion prompt (5) ties with a branch-plus-answer prompt (3 + 2).
 * Ties break at random, so someone who picks "jealous" gets either the jealousy question or
 * one keyed to their answers — rather than the emotion always winning, or never winning.
 * A prompt that matches the emotion *and* an answer (7) beats both, as it should.
 */
const WEIGHTS = { emotion: 5, branch: 3, q1: 2, q2: 2 } as const;

/** Returns the id of the best-matching prompt. Ties break at random, which keeps
 *  an identical check-in on two mornings from always producing the same question. */
export function selectPromptId(checkIn: CheckIn): string {
  const branch = findEmotion(checkIn.emotion)?.branch ?? null;

  let best: Prompt[] = [];
  let bestScore = -1;

  for (const prompt of PROMPTS) {
    let score = 0;
    let eligible = true;

    if (prompt.emotion) {
      if (prompt.emotion.includes(checkIn.emotion)) score += WEIGHTS.emotion;
      else eligible = false;
    }
    if (eligible && prompt.branch) {
      if (branch !== null && prompt.branch.includes(branch)) score += WEIGHTS.branch;
      else eligible = false;
    }
    if (eligible && prompt.q1) {
      if (prompt.q1.includes(checkIn.q1)) score += WEIGHTS.q1;
      else eligible = false;
    }
    if (eligible && prompt.q2) {
      if (prompt.q2.includes(checkIn.q2)) score += WEIGHTS.q2;
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

  // The criteria-free backstop guarantees `best` is never empty.
  return best[Math.floor(Math.random() * best.length)].id;
}

export function getPromptText(id: string | null): string {
  return PROMPTS.find((prompt) => prompt.id === id)?.text ?? PROMPTS[PROMPTS.length - 1].text;
}
