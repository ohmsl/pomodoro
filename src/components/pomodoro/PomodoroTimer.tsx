import { TimerSelector } from "./TimerSelector";

const PomodoroTimer = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* <Timer /> */}
      {/* <TimerControls /> */}
      <TimerSelector onTimeChange={console.log} />
    </main>
  );
};

export default PomodoroTimer;
