import { useNotification } from "@/hooks/useNotification";
import { useTimerStore } from "@/stores/timerStore";
import { Bell, BellOff, Vibrate } from "lucide-react";
import { Button } from "../ui/button";

export function TimerControls() {
  const isRunning = useTimerStore((state) => state.isRunning);
  const startTimer = useTimerStore((state) => state.startTimer);
  const stopTimer = useTimerStore((state) => state.stopTimer);
  const resetTimer = useTimerStore((state) => state.resetTimer);
  const notificationsEnabled = useTimerStore(
    (state) => state.notificationsEnabled
  );
  const toggleNotifications = useTimerStore(
    (state) => state.toggleNotifications
  );
  const hapticsEnabled = useTimerStore((state) => state.hapticsEnabled);
  const toggleHaptics = useTimerStore((state) => state.toggleHaptics);
  const skipPhase = useTimerStore((state) => state.skipPhase);
  const { requestNotificationPermission } = useNotification();

  const handleNotificationsToggle = async () => {
    if (notificationsEnabled) {
      toggleNotifications();
      return;
    }

    const granted = await requestNotificationPermission();
    if (granted) {
      toggleNotifications();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex space-x-4">
        <Button onClick={isRunning ? stopTimer : startTimer}>
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button onClick={resetTimer} variant="secondary">
          Reset
        </Button>
        <Button onClick={skipPhase} variant="ghost">
          Skip
        </Button>
      </div>
      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
        <Button
          size="icon"
          variant={notificationsEnabled ? "secondary" : "ghost"}
          aria-pressed={notificationsEnabled}
          onClick={() => {
            void handleNotificationsToggle();
          }}
          title={
            notificationsEnabled
              ? "Disable notifications"
              : "Enable notifications"
          }
        >
          {notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff />}
        </Button>
        <Button
          size="icon"
          variant={hapticsEnabled ? "secondary" : "ghost"}
          aria-pressed={hapticsEnabled}
          onClick={toggleHaptics}
          title={hapticsEnabled ? "Disable haptics" : "Enable haptics"}
        >
          <Vibrate className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
