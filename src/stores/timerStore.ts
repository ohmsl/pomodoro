import { create } from "zustand";
import { createPersistMiddleware } from "./persistor";

export type Phase = "focus" | "shortBreak" | "longBreak";

const defaultPhaseDurations: Record<Phase, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const determineNextPhase = (
  currentPhase: Phase,
  completedFocusSessions: number,
  cyclesBeforeLongBreak: number
): Phase => {
  if (currentPhase === "focus") {
    return completedFocusSessions % cyclesBeforeLongBreak === 0
      ? "longBreak"
      : "shortBreak";
  }

  return "focus";
};

interface TimerState {
  duration: number;
  timeLeft: number;
  isRunning: boolean;
  startTimestamp: number | null;
  currentPhase: Phase;
  phaseDurations: Record<Phase, number>;
  cyclesBeforeLongBreak: number;
  completedFocusSessions: number;
  autoStartNextPhase: boolean;
  notificationsEnabled: boolean;
  hapticsEnabled: boolean;
  setDuration: (minutes: number) => void;
  setPhaseDuration: (phase: Phase, minutes: number) => void;
  setCurrentPhase: (phase: Phase) => void;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  resumeTicking: () => void;
  completePhase: () => void;
  toggleNotifications: () => void;
  toggleHaptics: () => void;
}

export const useTimerStore = create<TimerState>(
  createPersistMiddleware(
    (set, get) => ({
      duration: defaultPhaseDurations.focus,
      timeLeft: defaultPhaseDurations.focus,
      isRunning: false,
      startTimestamp: null,
      currentPhase: "focus",
      phaseDurations: { ...defaultPhaseDurations },
      cyclesBeforeLongBreak: 4,
      completedFocusSessions: 0,
      autoStartNextPhase: true,
      notificationsEnabled: true,
      hapticsEnabled: true,

      setDuration: (minutes: number) => {
        const currentPhase = get().currentPhase;
        get().setPhaseDuration(currentPhase, minutes);
      },

      setPhaseDuration: (phase: Phase, minutes: number) => {
        const seconds = Math.max(minutes * 60, 0);
        set((state: TimerState) => {
          const updatedDurations = {
            ...state.phaseDurations,
            [phase]: seconds,
          };

          const shouldSyncCurrentPhase =
            phase === state.currentPhase && !state.isRunning;

          return {
            phaseDurations: updatedDurations,
            duration: shouldSyncCurrentPhase ? seconds : state.duration,
            timeLeft: shouldSyncCurrentPhase ? seconds : state.timeLeft,
            startTimestamp: shouldSyncCurrentPhase ? null : state.startTimestamp,
          };
        });
      },

      setCurrentPhase: (phase: Phase) => {
        const phaseDuration = get().phaseDurations[phase];
        set({
          currentPhase: phase,
          duration: phaseDuration,
          timeLeft: phaseDuration,
          isRunning: false,
          startTimestamp: null,
        });
      },

      startTimer: () => {
        const currentTimestamp = Date.now();
        const { duration } = get();

        if (duration === 0) {
          // Stopwatch mode
          set({
            isRunning: true,
            startTimestamp: currentTimestamp,
          });

          const tick = () => {
            if (get().isRunning) {
              set({
                timeLeft: Math.round(
                  (Date.now() - (get().startTimestamp ?? currentTimestamp)) / 1000
                ),
              });
              requestAnimationFrame(tick);
            }
          };

          requestAnimationFrame(tick);
        } else {
          // Countdown mode
          const endTime = currentTimestamp + get().timeLeft * 1000;
          set({
            isRunning: true,
            startTimestamp: currentTimestamp,
          });

          const tick = () => {
            const { isRunning } = get();

            if (isRunning) {
              const remainingTime = Math.max(
                0,
                Math.round((endTime - Date.now()) / 1000)
              );
              set({ timeLeft: remainingTime });

              if (remainingTime <= 0) {
                set({ isRunning: false });
                get().completePhase();
              } else {
                requestAnimationFrame(tick);
              }
            }
          };

          requestAnimationFrame(tick);
        }
      },

      stopTimer: () => {
        const { timeLeft, duration, startTimestamp } = get();
        if (duration === 0 && startTimestamp) {
          const elapsed = Math.round((Date.now() - startTimestamp) / 1000);
          set({
            timeLeft: elapsed,
            isRunning: false,
            startTimestamp: null,
          });
        } else {
          set({
            isRunning: false,
            startTimestamp: null,
            timeLeft: timeLeft,
          });
        }
      },

      resetTimer: () => {
        const { currentPhase, phaseDurations } = get();
        const phaseDuration = phaseDurations[currentPhase];
        set({
          timeLeft: phaseDuration,
          duration: phaseDuration,
          isRunning: false,
          startTimestamp: null,
        });
      },

      completePhase: () => {
        const {
          currentPhase,
          completedFocusSessions,
          cyclesBeforeLongBreak,
          phaseDurations,
          autoStartNextPhase,
        } = get();

        const updatedFocusSessions =
          currentPhase === "focus"
            ? completedFocusSessions + 1
            : completedFocusSessions;

        const nextPhase = determineNextPhase(
          currentPhase,
          currentPhase === "focus"
            ? updatedFocusSessions
            : completedFocusSessions,
          cyclesBeforeLongBreak
        );

        const nextDuration = phaseDurations[nextPhase];

        set({
          completedFocusSessions: updatedFocusSessions,
          currentPhase: nextPhase,
          duration: nextDuration,
          timeLeft: nextDuration,
          startTimestamp: null,
          isRunning: false,
        });

        if (autoStartNextPhase) {
          // Start the next phase automatically after state settles.
          requestAnimationFrame(() => {
            if (get().timeLeft === nextDuration) {
              get().startTimer();
            }
          });
        }
      },

      resumeTicking: () => {
        const { isRunning, startTimestamp, duration } = get();
        if (isRunning && startTimestamp) {
          const currentTime = Date.now();

          if (duration === 0) {
            // Stopwatch mode: calculate elapsed time and keep ticking
            const elapsed = Math.round((currentTime - startTimestamp) / 1000);
            set({ timeLeft: elapsed });

            const tick = () => {
              if (get().isRunning) {
                set({
                  timeLeft: Math.round(
                    (Date.now() - (get().startTimestamp ?? startTimestamp)) / 1000
                  ),
                });
                requestAnimationFrame(tick);
              }
            };

            requestAnimationFrame(tick);
          } else {
            // Countdown mode: calculate remaining time and keep ticking
            const endTime = startTimestamp + duration * 1000;
            const remainingTime = Math.max(
              0,
              Math.round((endTime - currentTime) / 1000)
            );
            set({ timeLeft: remainingTime });

            const tick = () => {
              const { isRunning } = get();

              if (isRunning) {
                const newRemainingTime = Math.max(
                  0,
                  Math.round((endTime - Date.now()) / 1000)
                );
                set({ timeLeft: newRemainingTime });

                if (newRemainingTime <= 0) {
                  set({ isRunning: false });
                  get().completePhase();
                } else {
                  requestAnimationFrame(tick);
                }
              }
            };

            requestAnimationFrame(tick);
          }
        }
      },
      toggleNotifications: () => {
        set((state: TimerState) => ({
          notificationsEnabled: !state.notificationsEnabled,
        }));
      },

      toggleHaptics: () => {
        set((state: TimerState) => ({
          hapticsEnabled: !state.hapticsEnabled,
        }));
      },
    }),
    {
      name: "timerState",
      version: 3,
      migrate: (persistedState: any, persistedVersion?: number) => {
        if (!persistedVersion || persistedVersion < 2) {
          const focusDuration =
            typeof persistedState?.duration === "number"
              ? persistedState.duration
              : defaultPhaseDurations.focus;

          const focusTimeLeft =
            typeof persistedState?.timeLeft === "number"
              ? persistedState.timeLeft
              : focusDuration;

          return {
            ...persistedState,
            duration: focusDuration,
            timeLeft: focusTimeLeft,
            currentPhase: "focus",
            phaseDurations: {
              focus: focusDuration,
              shortBreak: defaultPhaseDurations.shortBreak,
              longBreak: defaultPhaseDurations.longBreak,
            },
            completedFocusSessions: 0,
            autoStartNextPhase: true,
            cyclesBeforeLongBreak: 4,
          };
        }

        if (persistedVersion && persistedVersion < 3) {
          return {
            ...persistedState,
            notificationsEnabled: true,
            hapticsEnabled: true,
          };
        }

        return persistedState;
      },
      onRehydrate: (state, api) => {
        if (state.isRunning && api.getState().resumeTicking) {
          api.getState().resumeTicking();
        }
      },
    }
  )
);

export { determineNextPhase };
