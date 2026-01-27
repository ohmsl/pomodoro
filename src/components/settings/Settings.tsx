import { useNotification } from "@/hooks/useNotification";
import { useTimerStore } from "@/stores/timerStore";
import { Bell, Settings2, Vibrate } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme, type Theme } from "../ThemeProvider";

const themeModes: Theme[] = ["light", "dark", "system"];

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-3 text-sm font-semibold text-muted-foreground">
    {children}
  </p>
);

const ToggleRow = ({
  label,
  description,
  active,
  onToggle,
  icon,
}: {
  label: string;
  description: string;
  active: boolean;
  onToggle: () => void;
  icon?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-border">
    <div className="flex items-start space-x-3">
      {icon && <div className="mt-1 text-sm text-muted-foreground">{icon}</div>}
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
    <Button
      size="sm"
      variant={active ? "secondary" : "ghost"}
      aria-pressed={active}
      onClick={onToggle}
    >
      {active ? "On" : "Off"}
    </Button>
  </div>
);

const Settings = ({ onClose }: { onClose: () => void }) => {
  const { theme, setTheme } = useTheme();
  const notificationsEnabled = useTimerStore(
    (state) => state.notificationsEnabled
  );
  const toggleNotifications = useTimerStore(
    (state) => state.toggleNotifications
  );
  const hapticsEnabled = useTimerStore((state) => state.hapticsEnabled);
  const toggleHaptics = useTimerStore((state) => state.toggleHaptics);
  const { requestNotificationPermission } = useNotification();

  const handleThemeChange = (mode: Theme) => {
    setTheme(mode);
  };

  const handleNotificationToggle = async () => {
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
    <div className="flex h-full flex-col justify-between p-6">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm font-semibold text-muted-foreground">
            <Settings2 className="h-4 w-4" />
            <span>Settings</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <section>
          <SectionLabel>Theme</SectionLabel>
          <div className="flex space-x-2">
            {themeModes.map((mode) => (
              <Button
                key={mode}
                variant={theme === mode ? "secondary" : "ghost"}
                onClick={() => handleThemeChange(mode)}
                aria-pressed={theme === mode}
                className="flex-1 capitalize"
              >
                {mode}
              </Button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <SectionLabel>Signals</SectionLabel>
          <ToggleRow
            label="Notifications"
            description="Desktop or device alerts when a phase ends."
            active={notificationsEnabled}
            onToggle={() => {
              void handleNotificationToggle();
            }}
            icon={<Bell className="h-4 w-4" />}
          />
          <ToggleRow
            label="Haptics"
            description="Subtle taps for scrubbing and completion."
            active={hapticsEnabled}
            onToggle={toggleHaptics}
            icon={<Vibrate className="h-4 w-4" />}
          />
        </section>
      </div>
      <p className="text-xs text-muted-foreground">
        Swipe left to return or tap outside this panel.
      </p>
    </div>
  );
};

export default Settings;
