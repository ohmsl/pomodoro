import { triggerImpactFeedback } from "@/lib/haptics";
import { InfinityIcon } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type SwiperType from "swiper";
import "swiper/css";
import { FreeMode } from "swiper/modules";
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
  const notchOffsetsRef = useRef<number[]>([]);
  const prevCenterRef = useRef<number | null>(null);

  const buildNotchOffsets = useCallback((swiper: SwiperType) => {
    const wrapper = swiper.wrapperEl as HTMLElement | null;
    if (!wrapper) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const notches = Array.from(
      wrapper.querySelectorAll<HTMLElement>("[data-timer-notch='true']")
    );
    const rawOffsets = notches
      .map((notch) => {
        const rect = notch.getBoundingClientRect();
        return rect.left - wrapperRect.left + rect.width / 2;
      })
      .sort((a, b) => a - b);

    const deduped: number[] = [];
    const epsilon = 0.5;
    rawOffsets.forEach((offset) => {
      if (
        deduped.length === 0 ||
        Math.abs(offset - deduped[deduped.length - 1]) > epsilon
      ) {
        deduped.push(offset);
      }
    });

    notchOffsetsRef.current = deduped;
    prevCenterRef.current = null;
  }, []);

  useEffect(() => {
    setSelectedMinutes(defaultMinutes);
    if (swiperRef.current) {
      prevCenterRef.current = null;
      swiperRef.current.slideTo(defaultMinutes / 5, 0);
    }
  }, [defaultMinutes]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      if (swiperRef.current) {
        buildNotchOffsets(swiperRef.current);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [buildNotchOffsets]);

  const handleSwiperInit = (swiper: SwiperType) => {
    swiperRef.current = swiper;
    buildNotchOffsets(swiper);
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
          onProgress={(swiper) => {
            const wrapper = swiper.wrapperEl as HTMLElement | null;
            const container = swiper.el as HTMLElement | null;

            if (wrapper && container) {
              if (notchOffsetsRef.current.length === 0) {
                buildNotchOffsets(swiper);
              }

              const wrapperRect = wrapper.getBoundingClientRect();
              const containerRect = container.getBoundingClientRect();
              const centerOffset =
                containerRect.left + containerRect.width / 2 - wrapperRect.left;
              const prevCenter = prevCenterRef.current;
              prevCenterRef.current = centerOffset;

              if (prevCenter !== null && centerOffset !== prevCenter) {
                const offsets = notchOffsetsRef.current;

                if (centerOffset > prevCenter) {
                  offsets.forEach((offset) => {
                    if (offset > prevCenter && offset <= centerOffset) {
                      void triggerImpactFeedback("light");
                    }
                  });
                } else {
                  for (let i = offsets.length - 1; i >= 0; i -= 1) {
                    const offset = offsets[i];
                    if (offset < prevCenter && offset >= centerOffset) {
                      void triggerImpactFeedback("light");
                    }
                  }
                }
              }
            }

            swiper.slides.forEach((slide) => {
              const progress = (slide as any).progress;

              const numberScale = 1.3 - Math.abs(progress) * 0.3;
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
          resistanceRatio={0.8}
          freeMode={{
            enabled: true,
            minimumVelocity: 0.15,
            momentum: true,
            momentumBounce: true,
            momentumBounceRatio: 1,
            momentumRatio: 0.8,
            momentumVelocityRatio: 1,
            sticky: true,
          }}
          modules={[FreeMode]}
          onSlideChange={(swiper) => {
            const minutes = swiper.activeIndex * 5;
            setSelectedMinutes(minutes);
            onTimeChange(minutes);
          }}
        >
          {[...Array(NUM_MARKERS)].map((_, index) => {
            const time = index * 5;
            const isFirst = index === 0;
            const isLast = index === NUM_MARKERS - 1;
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
                      isFirst ? "invisible" : "visible"
                    }`}
                    data-timer-notch={isFirst ? undefined : "true"}
                  ></div>
                  <div
                    className={`w-1.5 h-6 bg-border rounded-full ${
                      isFirst ? "invisible" : "visible"
                    }`}
                    data-timer-notch={isFirst ? undefined : "true"}
                  ></div>

                  {/* Main marker */}
                  <div
                    className="w-1.5 h-10 bg-border rounded-full"
                    data-timer-notch="true"
                    style={{
                      backgroundColor:
                        selectedMinutes === time
                          ? "hsl(var(--accent))"
                          : "hsl(var(--border))",
                    }}
                  ></div>

                  <div
                    className={`w-1.5 h-6 bg-border rounded-full ${
                      isLast ? "invisible" : "visible"
                    }`}
                    data-timer-notch={isLast ? undefined : "true"}
                  ></div>
                  <div
                    className={`w-1.5 h-6 bg-border rounded-full ${
                      isLast ? "invisible" : "visible"
                    }`}
                    data-timer-notch={isLast ? undefined : "true"}
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
