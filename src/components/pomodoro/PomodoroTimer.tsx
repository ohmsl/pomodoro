import { Timer } from "./Timer";
import { TimerControls } from "./TimerControls";

const PomodoroTimer = () => {
  return (
    <main className="fixed w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <Timer />
      <TimerControls />
    </main>
  );
};

export default PomodoroTimer;
