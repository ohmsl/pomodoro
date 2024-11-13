import { useTimerStore } from "@/stores/timerStore";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { TimerSelector } from "./TimerSelector";

export function TimerSelectorDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const setDuration = useTimerStore((state) => state.setDuration);

  const handleTimeChange = (minutes: number) => {
    setDuration(minutes);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="fixed inset-0 flex flex-col items-center justify-center text-foreground bg-background pt-40">
        <TimerSelector onTimeChange={handleTimeChange} />
        <Button onClick={onClose} className="mt-16" size="xl">
          Done
        </Button>
      </DialogContent>
    </Dialog>
  );
}
