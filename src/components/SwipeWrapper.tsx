import { animated, useSpring } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { Settings2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PomodoroTimer from "./pomodoro/PomodoroTimer";
import Settings from "./settings/Settings";
import { Button } from "./ui/button";

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const useViewportWidth = () => {
  const getWidth = () =>
    typeof window !== "undefined" ? window.innerWidth : 375;
  const [width, setWidth] = useState(getWidth);

  useEffect(() => {
    const handleResize = () => setWidth(getWidth());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};

const SwipeWrapper = () => {
  const width = useViewportWidth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  useEffect(() => {
    api.start({
      x: isSettingsOpen ? -width : 0,
    });
  }, [api, isSettingsOpen, width]);

  useEffect(() => {
    // When the viewport changes, snap instantly without animation.
    api.start({
      x: isSettingsOpen ? -width : 0,
      immediate: true,
    });
  }, [api, width]);

  const bind = useGesture(
    {
      onDrag: ({
        down,
        movement: [mx],
        last,
        velocity: [vx],
        direction: [dx],
      }) => {
        const base = isSettingsOpen ? -width : 0;
        const clamped = clamp(base + mx, -width, 0);
        api.start({
          x: clamped,
          immediate: down,
        });

        if (last) {
          let shouldOpen = clamped < -width / 2;
          if (vx > 0.35) {
            shouldOpen = dx < 0;
          }
          setIsSettingsOpen(shouldOpen);
          api.start({ x: shouldOpen ? -width : 0 });
        }
      },
    },
    {
      drag: {
        filterTaps: true,
        axis: "x",
      },
    }
  );

  const scrimOpacity = useMemo(() => {
    return x.to((value) => {
      const openness = Math.abs(value) / width;
      return Math.max(0, Math.min(openness, 1));
    });
  }, [x, width]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background to-accent">
      {!isSettingsOpen && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-4 top-4 z-30"
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Open settings"
        >
          <Settings2 className="h-5 w-5" />
        </Button>
      )}
      <animated.div
        {...bind()}
        className="flex w-[200vw] max-w-none"
        style={{
          transform: x.to((value) => `translate3d(${value}px, 0, 0)`),
        }}
      >
        <div className="relative flex h-screen w-screen items-center justify-center">
          <PomodoroTimer />
          <animated.div
            style={{
              opacity: scrimOpacity,
              pointerEvents: isSettingsOpen ? "auto" : "none",
            }}
            className="absolute inset-0 z-20 bg-black/60"
            onClick={() => setIsSettingsOpen(false)}
          />
        </div>
        <div className="h-screen w-screen border-l bg-background/95 backdrop-blur">
          <Settings onClose={() => setIsSettingsOpen(false)} />
        </div>
      </animated.div>
    </div>
  );
};

export default SwipeWrapper;
