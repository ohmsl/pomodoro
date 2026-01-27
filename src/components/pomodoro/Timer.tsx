import {
  determineNextPhase,
  type Phase,
  useTimerStore,
} from "@/stores/timerStore";
import { useState } from "react";
import { TimerSelectorDialog } from "./TimerSelectorDialog";

const phaseLabels: Record<Phase, string> = {
  focus: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

export function Timer() {
  const timeLeft = useTimerStore((state) => state.timeLeft);
  const currentPhase = useTimerStore((state) => state.currentPhase);
  const completedFocusSessions = useTimerStore(
    (state) => state.completedFocusSessions
  );
  const cyclesBeforeLongBreak = useTimerStore(
    (state) => state.cyclesBeforeLongBreak
  );
  const [timeSelectDialogOpen, setTimeSelectDialogOpen] = useState(false);

  const upcomingPhase = determineNextPhase(
    currentPhase,
    currentPhase === "focus"
      ? completedFocusSessions + 1
      : completedFocusSessions,
    cyclesBeforeLongBreak
  );

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <>
      <TimerSelectorDialog
        open={timeSelectDialogOpen}
        onClose={() => setTimeSelectDialogOpen(false)}
      />
      <div className="text-center mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {phaseLabels[currentPhase]}
        </p>
        <p className="text-sm text-muted-foreground">
          Next: {phaseLabels[upcomingPhase]}
        </p>
      </div>
      <div
        className="text-8xl
        font-bold mb-6 cursor-pointer"
        onClick={() => setTimeSelectDialogOpen(true)}
      >
        {formatTime(timeLeft)}
      </div>
    </>
  );
}
