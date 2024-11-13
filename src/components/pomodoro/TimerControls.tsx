import { useTimerStore } from "@/stores/timerStore";
import { Button } from "../ui/button";

export function TimerControls() {
  const { isRunning, startTimer, stopTimer, resetTimer } = useTimerStore();

  return (
    <div className="flex space-x-4">
      <Button onClick={isRunning ? stopTimer : startTimer}>
        {isRunning ? "Pause" : "Start"}
      </Button>
      <Button onClick={resetTimer} variant="secondary">
        Reset
      </Button>
    </div>
  );
}
