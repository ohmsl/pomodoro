import { cn } from "@/lib/utils";
import { useTimerStore, type Phase } from "@/stores/timerStore";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { TimerSelector } from "./TimerSelector";

const phaseOptions: Array<{ id: Phase; label: string }> = [
  { id: "focus", label: "Focus" },
  { id: "shortBreak", label: "Short Break" },
  { id: "longBreak", label: "Long Break" },
];

export function TimerSelectorDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const setPhaseDuration = useTimerStore((state) => state.setPhaseDuration);
  const phaseDurations = useTimerStore((state) => state.phaseDurations);
  const currentPhase = useTimerStore((state) => state.currentPhase);
  const [selectedPhase, setSelectedPhase] = useState<Phase>(currentPhase);

  useEffect(() => {
    if (open) {
      setSelectedPhase(currentPhase);
    }
  }, [open, currentPhase]);

  const handleTimeChange = (minutes: number) => {
    setPhaseDuration(selectedPhase, minutes);
  };

  const activeMinutes = Math.round((phaseDurations[selectedPhase] || 0) / 60);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-background" />
        <DialogPrimitive.Content className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background pt-40">
          <div className="mb-6 flex space-x-2">
            {phaseOptions.map((phase) => (
              <button
                key={phase.id}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  selectedPhase === phase.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-foreground/70"
                )}
                onClick={() => setSelectedPhase(phase.id)}
              >
                {phase.label}
              </button>
            ))}
          </div>
          <TimerSelector
            onTimeChange={handleTimeChange}
            defaultMinutes={activeMinutes}
          />
          <Button onClick={onClose} className="mt-16" size="xl">
            Done
          </Button>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
