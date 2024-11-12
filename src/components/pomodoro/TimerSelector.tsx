import { impactFeedback } from "@tauri-apps/plugin-haptics";
import { InfinityIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import type SwiperType from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

type TimerSelectorProps = {
  onTimeChange: (minutes: number) => void;
  defaultMinutes?: number;
};

export const TimerSelector: React.FC<TimerSelectorProps> = ({
  onTimeChange,
  defaultMinutes = 25,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState(defaultMinutes);
  const swiperRef = useRef<SwiperType | null>(null);
  const NUM_MARKERS = 25;
  const [lastHapticInterval, setLastHapticInterval] = useState<number | null>(
    null
  );

  const handleSwiperInit = (swiper: SwiperType) => {
    swiperRef.current = swiper;
    swiper.on("slideChange", () => {
      const index = swiper.activeIndex;
      const minutes = index * 5;
      setSelectedMinutes(minutes);
      onTimeChange(minutes);
    });
  };

  const handleNotchHapticFeedback = (progress: number) => {
    const interval = Math.round(progress * 100);
    if (interval !== lastHapticInterval) {
      setLastHapticInterval(interval);
      impactFeedback("light");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md h-24 overflow-hidden">
        {/* Center pin indicator */}
        <div className="absolute inset-y-0 left-1/2 w-2.5 h-10 mt-12 rounded-full bg-primary transform -translate-x-1/2 z-10"></div>

        <Swiper
          slidesPerView="auto"
          centeredSlides={true}
          spaceBetween={-12}
          initialSlide={defaultMinutes / 5}
          onSwiper={handleSwiperInit}
          watchSlidesProgress={true}
          onProgress={(swiper, progress) => {
            handleNotchHapticFeedback(progress);
            if (Math.abs(progress) % 1 === 0) {
              impactFeedback("rigid");
            }
            swiper.slides.forEach((slide) => {
              const progress = (slide as any).progress;

              const numberScale = 1.2 - Math.abs(progress) * 0.3;
              const numberOpacity = 1 - Math.abs(progress) * 1;

              const numberElement = slide.querySelector(
                ".main-number"
              ) as HTMLElement;
              if (numberElement) {
                numberElement.style.transform = `scale(${Math.max(
                  numberScale,
                  0.8
                )})`;
                numberElement.style.opacity = `${Math.max(numberOpacity, 0.5)}`;
              }
            });
          }}
          slideToClickedSlide={true}
          resistanceRatio={0.7}
          //   freeMode={{
          //     enabled: true,
          //     minimumVelocity: 0.02,
          //     momentum: true,
          //     momentumBounce: true,
          //     momentumBounceRatio: 1,
          //     momentumRatio: 1,
          //     momentumVelocityRatio: 1,
          //     sticky: false,
          //   }}
        >
          {[...Array(NUM_MARKERS)].map((_, index) => {
            const time = index * 5;
            return (
              <SwiperSlide
                key={time}
                style={{ width: "100px", flexShrink: 0 }}
                className="flex flex-col items-center justify-center"
              >
                {/* Scalable Number */}
                <div className="flex items-center justify-center w-full mb-2">
                  <span
                    className="main-number text-4xl font-semibold select-none"
                    style={{
                      color: "hsl(var(--foreground))",
                      transition: "transform 0.05s, opacity 0.05s",
                    }}
                  >
                    {index > 0 ? (
                      time
                    ) : (
                      <InfinityIcon size={40} strokeWidth={3} />
                    )}
                  </span>
                </div>

                <div className="flex items-start justify-evenly w-full h-full">
                  <div
                    className={`w-1.5 h-6 bg-border rounded-full ${
                      index === 0 ? "invisible" : "visible"
                    }`}
                  ></div>
                  <div
                    className={`w-1.5 h-6 bg-border rounded-full ${
                      index === 0 ? "invisible" : "visible"
                    }`}
                  ></div>

                  {/* Main marker */}
                  <div
                    className="w-1.5 h-10 bg-border rounded-full"
                    style={{
                      backgroundColor:
                        selectedMinutes === time
                          ? "hsl(var(--accent))"
                          : "hsl(var(--border))",
                    }}
                  ></div>

                  <div
                    className={`w-1.5 h-6 bg-border rounded-full ${
                      index === NUM_MARKERS - 1 ? "invisible" : "visible"
                    }`}
                  ></div>
                  <div
                    className={`w-1.5 h-6 bg-border rounded-full ${
                      index === NUM_MARKERS - 1 ? "invisible" : "visible"
                    }`}
                  ></div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};
