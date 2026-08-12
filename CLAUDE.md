# Morning Journal

A short morning ritual: name the feeling → two follow-up questions → a journaling prompt →
timed writing → 1-minute meditation → done.

## Rules

- No backend, no auth, no database, no AI API, no subscriptions. `localStorage` only.
- Web app on Vercel. Not Electron, not Tauri, not a native app.
- React + TypeScript + Vite. Minimal dependencies — nothing new without a reason.
- Two primary viewports: phone portrait, and a narrow desktop window (400–600px). Never assume full screen.
- Calm by default. No streaks, no stats, no social, no urgency mechanics, no shame-based copy.
- Product decision rule: "Does this make the morning ritual better?" If no, don't build it.

## Architecture

```
src/
  components/   EmotionPicker, FollowUp, ChoiceGroup, Journal, Meditation, Complete
  core/         timer.ts, persistence.ts, useTimer.ts — copied from the wizard-timer
                project. Treat as a shared library: fix bugs here, don't restyle it.
  data/         emotions.ts (31 emotions in 3 groups), questions.ts (two questions per
                branch), prompts.ts (prompt bank + selector)
  hooks/        useSpeechRecognition
  utils/        gong.ts (Web Audio), storage.ts (session in localStorage)
  types.ts      BranchId / EmotionId / Stage / CheckIn / Session
  App.tsx       owns Session state + stage routing + persistence
```

### The check-in

Each emotion belongs to a **branch** (`activated`, `low`, `self-critical`, `outward`, `bright`,
`settled`, `neutral`). The branch decides which two follow-up questions get asked, so the
questions change with the feeling. Adding an emotion means assigning it a branch — never
inventing a new branch unless it earns its own pair of questions.

Answer ids are globally unique (`out-person`, `low-weeks`) so a prompt can name one directly.

- **Single source of truth**: `App.tsx` holds one `Session` object and writes it to `localStorage`
  on every change. Refreshing the page mid-ritual restores stage and journal text.
- **Session is date-scoped.** A stored session from a previous day is discarded on load.
- **Timers are deadline-based** (`core/timer.ts` stores time-left-at-last-change plus the timestamp
  of that change, and subtracts against the wall clock) so they don't drift, survive background-tab
  throttling, and resume across a reload. Never count down by decrementing.
- **The two timers persist separately from the session**, under their own storage keys. Anything
  that starts a new ritual must call `clearTimers()`, or the next morning opens on a spent timer.
- **Session storage is versioned** (`SCHEMA_VERSION` in `storage.ts`). Change the `Session`
  shape, bump the version — old stored sessions are discarded, never half-adopted.
- **Prompt selection is local scoring** over `prompts.ts` — no API. A prompt lists the emotions,
  branches and answers it suits; any listed dimension that doesn't match disqualifies it, and
  matches add weight. Weights are set so a named-emotion prompt ties with a branch-plus-answer
  prompt and ties break at random, which is what gives the same check-in some variety.
  The branch-only prompts sit below that tie and act as insurance: they only surface if an
  answer option ever exists with no prompt keyed to it.
- **Voice input is optional and additive.** Final speech chunks are appended to the journal text;
  interim text is shown separately and never written into the field. If the browser has no
  Speech Recognition, the mic is hidden and everything else still works.
- **Recognition language is pinned to `en-US`**, not `navigator.language`. On a Finnish machine
  the browser default made the recogniser expect Finnish, and English speech produced no text
  at all. If the app ever gets Finnish copy, this has to become a choice, not a constant.
- **Audio only after a user gesture.** The `AudioContext` is created lazily on a button press.

## Durations

`JOURNAL_MINUTES` and `MEDITATION_MINUTES` in `src/App.tsx`. Change there, nowhere else.
