import type { BranchId } from '../types';

export interface AnswerOption {
  /** Globally unique across all branches, so a prompt can name an answer directly. */
  value: string;
  label: string;
}

export interface Question {
  legend: string;
  options: AnswerOption[];
}

/**
 * Two questions per branch. They are deliberately about the *shape* of the feeling —
 * where it sits, what it points at, how long it has been there — rather than about
 * causes. Cause is what the journaling is for.
 */
export const BRANCH_QUESTIONS: Record<BranchId, [Question, Question]> = {
  activated: [
    {
      legend: 'Where do you notice it most?',
      options: [
        { value: 'act-body', label: 'In my body' },
        { value: 'act-thoughts', label: 'In my thoughts' },
        { value: 'act-doing', label: 'In how I’m moving around' },
        { value: 'act-everywhere', label: 'Everywhere at once' },
      ],
    },
    {
      legend: 'What is it circling?',
      options: [
        { value: 'act-today', label: 'Something today' },
        { value: 'act-ahead', label: 'Something further ahead' },
        { value: 'act-unresolved', label: 'Something unresolved' },
        { value: 'act-all', label: 'Everything, honestly' },
      ],
    },
  ],

  low: [
    {
      legend: 'How long has this been with you?',
      options: [
        { value: 'low-today', label: 'Just this morning' },
        { value: 'low-days', label: 'A few days' },
        { value: 'low-weeks', label: 'A few weeks' },
        { value: 'low-longer', label: 'Longer than that' },
      ],
    },
    {
      legend: 'What would help most right now?',
      options: [
        { value: 'low-understood', label: 'Being understood' },
        { value: 'low-alone', label: 'Being left alone' },
        { value: 'low-said', label: 'Saying it out loud' },
        { value: 'low-unknown', label: 'I don’t know yet' },
      ],
    },
  ],

  'self-critical': [
    {
      legend: 'What is it about?',
      options: [
        { value: 'self-did', label: 'Something I did' },
        { value: 'self-didnt', label: 'Something I didn’t do' },
        { value: 'self-seemed', label: 'How I came across' },
        { value: 'self-me', label: 'Just me, generally' },
      ],
    },
    {
      legend: 'Whose voice does it sound like?',
      options: [
        { value: 'self-mine', label: 'My own' },
        { value: 'self-someone', label: 'Someone specific' },
        { value: 'self-everyone', label: 'People in general' },
        { value: 'self-unclear', label: 'I can’t tell' },
      ],
    },
  ],

  outward: [
    {
      legend: 'Where is it pointed?',
      options: [
        { value: 'out-person', label: 'At a person' },
        { value: 'out-situation', label: 'At a situation' },
        { value: 'out-self', label: 'At myself' },
        { value: 'out-unfair', label: 'At something unfair' },
      ],
    },
    {
      legend: 'Has any of it been said?',
      options: [
        { value: 'out-silent', label: 'Not at all' },
        { value: 'out-head', label: 'Only in my head' },
        { value: 'out-third', label: 'To someone else' },
        { value: 'out-direct', label: 'To the person involved' },
      ],
    },
  ],

  bright: [
    {
      legend: 'What’s underneath it?',
      options: [
        { value: 'bright-happened', label: 'Something that happened' },
        { value: 'bright-coming', label: 'Something coming up' },
        { value: 'bright-change', label: 'A change in me' },
        { value: 'bright-nothing', label: 'Nothing in particular' },
      ],
    },
    {
      legend: 'How steady does it feel?',
      options: [
        { value: 'bright-solid', label: 'Solid' },
        { value: 'bright-mostly', label: 'Mostly steady' },
        { value: 'bright-braced', label: 'I’m braced for it to go' },
        { value: 'bright-fragile', label: 'Fragile' },
      ],
    },
  ],

  settled: [
    {
      legend: 'What made room for this?',
      options: [
        { value: 'set-rest', label: 'Rest' },
        { value: 'set-resolved', label: 'Something resolved' },
        { value: 'set-someone', label: 'Someone' },
        { value: 'set-unsure', label: 'I’m not sure' },
      ],
    },
    {
      legend: 'What would protect it today?',
      options: [
        { value: 'set-less', label: 'Doing less' },
        { value: 'set-no', label: 'Saying no to something' },
        { value: 'set-people', label: 'Being around people' },
        { value: 'set-quiet', label: 'Keeping it to myself' },
      ],
    },
  ],

  neutral: [
    {
      legend: 'Is that the honest word?',
      options: [
        { value: 'neu-genuine', label: 'Yes, genuinely' },
        { value: 'neu-easiest', label: 'It’s the easiest word' },
        { value: 'neu-unchecked', label: 'I haven’t checked' },
        { value: 'neu-under', label: 'Something’s under it' },
      ],
    },
    {
      legend: 'What would help you find out?',
      options: [
        { value: 'neu-write', label: 'Writing it down' },
        { value: 'neu-name', label: 'Naming one thing' },
        { value: 'neu-still', label: 'Sitting still' },
        { value: 'neu-move', label: 'Moving my body' },
      ],
    },
  ],
};
