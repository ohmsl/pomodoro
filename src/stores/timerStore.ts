import { create } from "zustand";

interface TimerState {
  duration: number;
  timeLeft: number;
  isRunning: boolean;
  setDuration: (minutes: number) => void;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  duration: 1500,
  timeLeft: 1500,
  isRunning: false,
  setDuration: (minutes) => {
    const seconds = minutes * 60;
    set({ duration: seconds, timeLeft: seconds });
  },
  startTimer: () => set({ isRunning: true }),
  stopTimer: () => set({ isRunning: false }),
  resetTimer: () =>
    set((state) => ({ timeLeft: state.duration, isRunning: false })),
  tick: () => {
    if (get().duration === 0) {
      set((state) => ({ timeLeft: state.timeLeft + 1 }));
    } else if (get().isRunning && get().timeLeft > 0) {
      set((state) => ({ timeLeft: state.timeLeft - 1 }));
    } else if (get().timeLeft === 0) {
      set({ isRunning: false });
    }
  },
}));
