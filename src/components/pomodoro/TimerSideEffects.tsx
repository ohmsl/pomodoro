import { useNotification } from "@/hooks/useNotification";
import { triggerImpactFeedback } from "@/lib/haptics";
import { useEffect, useRef } from "react";
import { useTimerStore } from "@/stores/timerStore";

export function TimerSideEffects() {
  const timeLeft = useTimerStore((state) => state.timeLeft);
  const isRunning = useTimerStore((state) => state.isRunning);
  const currentPhase = useTimerStore((state) => state.currentPhase);
  const resumeTicking = useTimerStore((state) => state.resumeTicking);
  const notificationsEnabled = useTimerStore(
    (state) => state.notificationsEnabled
  );
  const hapticsEnabled = useTimerStore((state) => state.hapticsEnabled);
  const { sendNotificationMessage } = useNotification();

  const prevTimeLeftRef = useRef(timeLeft);
  const prevPhaseRef = useRef(currentPhase);

  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") {
      return;
    }

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        resumeTicking();
      }
    };

    const handleFocus = () => {
      resumeTicking();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
    };
  }, [resumeTicking]);

  useEffect(() => {
    const previousTimeLeft = prevTimeLeftRef.current;
    const finishedPhase = prevPhaseRef.current;

    if (
      previousTimeLeft > 0 &&
      timeLeft === 0 &&
      !isRunning &&
      finishedPhase !== currentPhase
    ) {
      if (notificationsEnabled) {
        void sendNotificationMessage({
          title:
            finishedPhase === "focus"
              ? "Focus complete"
              : "Break complete",
          body:
            finishedPhase === "focus"
              ? "Take a breather. Your break just started."
              : "Break finished. Time to focus.",
        });
      }

      if (hapticsEnabled) {
        void triggerImpactFeedback("medium");
      }
    }

    prevTimeLeftRef.current = timeLeft;
    prevPhaseRef.current = currentPhase;
  }, [
    currentPhase,
    hapticsEnabled,
    isRunning,
    notificationsEnabled,
    sendNotificationMessage,
    timeLeft,
  ]);

  return null;
}
