import { useTimerStore } from "@/stores/timerStore";
import { useState } from "react";
import { TimerSelectorDialog } from "./TimerSelectorDialog";

export function Timer() {
  const { timeLeft } = useTimerStore();
  const [timeSelectDialogOpen, setTimeSelectDialogOpen] = useState(false);

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
