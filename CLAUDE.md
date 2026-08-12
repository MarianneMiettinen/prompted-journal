# Morning Journal

A short morning ritual: check-in → journaling prompt → timed writing → 1-minute meditation → done.

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
  components/   CheckIn, ChoiceGroup, Journal, Meditation, Complete
  core/         timer.ts, persistence.ts, useTimer.ts — copied from the wizard-timer
                project. Treat as a shared library: fix bugs here, don't restyle it.
  data/         options.ts (check-in choices), prompts.ts (curated prompt bank + selector)
  hooks/        useSpeechRecognition
  utils/        gong.ts (Web Audio), storage.ts (session in localStorage)
  types.ts      Mood / Energy / Topic / Stage / Session
  App.tsx       owns Session state + stage routing + persistence
```

- **Single source of truth**: `App.tsx` holds one `Session` object and writes it to `localStorage`
  on every change. Refreshing the page mid-ritual restores stage and journal text.
- **Session is date-scoped.** A stored session from a previous day is discarded on load.
- **Timers are deadline-based** (`core/timer.ts` stores time-left-at-last-change plus the timestamp
  of that change, and subtracts against the wall clock) so they don't drift, survive background-tab
  throttling, and resume across a reload. Never count down by decrementing.
- **The two timers persist separately from the session**, under their own storage keys. Anything
  that starts a new ritual must call `clearTimers()`, or the next morning opens on a spent timer.
- **Prompt selection is local scoring** over `prompts.ts` — no API. Prompts declare which
  mood/energy/topic they suit; unmatched dimensions disqualify, matched dimensions score.
  At least one criteria-free prompt always exists as a fallback.
- **Voice input is optional and additive.** Final speech chunks are appended to the journal text;
  interim text is shown separately and never written into the field. If the browser has no
  Speech Recognition, the mic is hidden and everything else still works.
- **Audio only after a user gesture.** The `AudioContext` is created lazily on a button press.

## Durations

`JOURNAL_MINUTES` and `MEDITATION_MINUTES` in `src/App.tsx`. Change there, nowhere else.
