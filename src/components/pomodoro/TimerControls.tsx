import { useState } from "react";
import { Button } from "../ui/button";

export function TimerControls() {
  const [isRunning, setIsRunning] = useState(false);

  const handleStartPause = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setIsRunning(false);
    // Reset logic here
  };

  return (
    <div className="flex space-x-4">
      <Button onClick={handleStartPause}>
        {isRunning ? "Pause" : "Start"}
      </Button>
      <Button onClick={handleReset}>Reset</Button>
    </div>
  );
}
