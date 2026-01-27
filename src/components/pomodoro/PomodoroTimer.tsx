import { Timer } from "./Timer";
import { TimerControls } from "./TimerControls";
import { TimerSideEffects } from "./TimerSideEffects";

const PomodoroTimer = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <TimerSideEffects />
      <Timer />
      <TimerControls />
    </main>
  );
};

export default PomodoroTimer;
