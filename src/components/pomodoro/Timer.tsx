import { useTimerStore } from "@/stores/timerStore";
import { useEffect, useState } from "react";
import { TimerSelectorDialog } from "./TimerSelectorDialog";

export function Timer() {
  const { timeLeft, isRunning, tick } = useTimerStore();
  const [timeSelectDialogOpen, setTimeSelectDialogOpen] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => tick(), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, tick]);

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
        className="text-7xl font-bold mb-6 cursor-pointer"
        onClick={() => setTimeSelectDialogOpen(true)}
      >
        {formatTime(timeLeft)}
      </div>
    </>
  );
}
