# TODO

## Auto Pomodoro Cycles
- [x] Extend timer store with multi-phase configuration and persistence
- [x] Auto-advance between focus, short break, and long break phases
- [x] Allow editing each phase duration from the selector dialog
- [x] Surface current and upcoming phase information in the timer UI
- [ ] Add a minimal manual skip control for cases when users want to bypass a phase
- [ ] Expose cycles-before-long-break as an adjustable setting without bloating the UI

## Background cues & resilience
- [x] Provide cross-platform notification + haptic fallbacks
- [x] Add background visibility/focus handling so ticking catches up immediately
- [x] Trigger discreet cues whenever a phase completes
- [ ] Surface an unobtrusive hint when notification permission is blocked
