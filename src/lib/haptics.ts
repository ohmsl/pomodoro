import {
  impactFeedback as tauriImpactFeedback,
  selectionFeedback as tauriSelectionFeedback,
  type ImpactFeedbackStyle,
} from "@tauri-apps/plugin-haptics";
import { isTauriEnvironment, supportsVibration } from "./platform";

const vibrateFallback = (pattern: number | number[] = 20) => {
  if (supportsVibration()) {
    navigator.vibrate(pattern);
  }
};

export const triggerImpactFeedback = async (
  style: ImpactFeedbackStyle = "medium"
) => {
  if (isTauriEnvironment()) {
    try {
      await tauriImpactFeedback(style);
      return;
    } catch (error) {
      console.warn("Impact feedback failed, falling back to vibration", error);
    }
  }

  const fallbackPattern =
    style === "heavy" ? 50 : style === "light" ? 15 : 30;
  vibrateFallback(fallbackPattern);
};

export const triggerSelectionFeedback = async () => {
  if (isTauriEnvironment()) {
    try {
      await tauriSelectionFeedback();
      return;
    } catch (error) {
      console.warn("Selection feedback failed, falling back to vibration", error);
    }
  }

  vibrateFallback(10);
};
