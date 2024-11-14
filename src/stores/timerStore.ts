import { create } from "zustand";
import { createPersistMiddleware } from "./persistor";

interface TimerState {
  duration: number;
  timeLeft: number;
  isRunning: boolean;
  startTimestamp: number | null;
  setDuration: (minutes: number) => void;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  resumeTicking: () => void;
}

export const useTimerStore = create<TimerState>(
  createPersistMiddleware(
    (set, get) => ({
      duration: 1500,
      timeLeft: 1500,
      isRunning: false,
      startTimestamp: null,

      setDuration: (minutes) => {
        const seconds = minutes * 60;
        set({ duration: seconds, timeLeft: seconds, startTimestamp: null });
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
                  (Date.now() - get().startTimestamp!) / 1000
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
        const { duration } = get();
        set({
          timeLeft: duration,
          isRunning: false,
          startTimestamp: null,
        });
      },

      resumeTicking: () => {
        const { isRunning, startTimestamp, duration } = get();
        console.log("Resuming ticking...", get());
        if (isRunning && startTimestamp) {
          const currentTime = Date.now();

          if (duration === 0) {
            // Stopwatch mode: calculate elapsed time and keep ticking
            const elapsed = Math.round((currentTime - startTimestamp) / 1000);
            set({ timeLeft: elapsed });

            const tick = () => {
              if (get().isRunning) {
                set({
                  timeLeft: Math.round((Date.now() - startTimestamp) / 1000),
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
                const remainingTime = Math.max(
                  0,
                  Math.round((endTime - Date.now()) / 1000)
                );
                set({ timeLeft: remainingTime });

                if (remainingTime <= 0) {
                  set({ isRunning: false });
                } else {
                  requestAnimationFrame(tick);
                }
              }
            };

            requestAnimationFrame(tick);
          }
        }
      },
    }),
    {
      name: "timerState",
      version: 1,
      onRehydrate: (state, api) => {
        if (state.isRunning && api.getState().resumeTicking) {
          api.getState().resumeTicking();
        }
      },
    }
  )
);
