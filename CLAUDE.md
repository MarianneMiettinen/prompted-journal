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

## Launching it

The app is installable: `public/manifest.webmanifest` with `display: standalone`, plus PNG
icons generated as a one-off (rounded square, sun over a horizon). Installed via Chrome or
Edge it gets its own window with no tabs and no address bar — that *is* the desktop
"popup window", and the same manifest gives a full-screen app on a phone home screen.

`LaunchHelp` renders on the opening screen only, never mid-ritual, and disappears once it has
nothing to say. It hides when:

- the app is installed (`display-mode: standalone`, or `navigator.standalone` on iOS), or
- it is already the popped-out window — detected by `window.name === POPUP_NAME`, because
  Chrome reports `display-mode: browser` inside a popup, or
- the person pressed "Don't show this again" (a flag in localStorage).

Desktop vs mobile copy is chosen by `(hover: hover) and (pointer: fine)`, **not** by width —
a 460px-wide desktop popup must still get the desktop instructions.

If Chrome fires `beforeinstallprompt`, a one-click Install button replaces the written step.
Written instructions are the fallback and always work, since Chrome can install any page.

### Emoji

Every emotion emoji must be a **single codepoint, Unicode 11 or earlier**. Windows 10's
Segoe UI Emoji renders Unicode 13/14 emoji as empty boxes and splits ZWJ sequences like
😮‍💨 into two glyphs. This bit us once; check on Windows 10 before adding one.

## Durations

`JOURNAL_MINUTES` and `MEDITATION_MINUTES` in `src/App.tsx`. Change there, nowhere else.
