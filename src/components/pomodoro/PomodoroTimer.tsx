import { Timer } from "./Timer";
import { TimerControls } from "./TimerControls";

const PomodoroTimer = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <Timer />
      <TimerControls />
    </main>
  );
};

export default PomodoroTimer;
