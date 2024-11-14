import { create } from "zustand";
import { createPersistMiddleware } from "./persistor";

interface SettingsState {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useSettingsStore = create<SettingsState>(
  createPersistMiddleware(
    (set) => ({
      theme: "zinc-light",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "settingsState",
      version: 1,
    }
  )
);
