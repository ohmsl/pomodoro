// // src/components/SwipeWrapper.jsx
// import { animated, useSpring } from "@react-spring/web";
// import { useGesture } from "@use-gesture/react";
// import { useState } from "react";
// import PomodoroTimer from "./pomodoro/PomodoroTimer";
// import Settings from "./settings/Settings";

// const SwipeWrapper = () => {
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);

//   const [{ x }, api] = useSpring(() => ({ x: 0 }));

//   const bind = useGesture(
//     {
//       onDrag: ({ down, movement: [mx], direction: [dx], cancel }) => {
//         if (dx !== 1) return; // Only respond to right swipes
//         if (mx > window.innerWidth / 3 && !down) {
//           setIsSettingsOpen(true);
//           api.start({ x: 0 });
//           cancel && cancel();
//         } else {
//           api.start({ x: down ? mx : 0 });
//         }
//       },
//     },
//     {
//       drag: {
//         filterTaps: true,
//         from: () => [x.get(), 0],
//       },
//     }
//   );

//   const handleCloseSettings = () => {
//     setIsSettingsOpen(false);
//   };

//   return (
//     <div className="relative w-full h-full overflow-hidden">
//       <animated.div {...bind()} style={{ x }} className="absolute inset-0">
//         <PomodoroTimer />
//       </animated.div>
//       {isSettingsOpen && (
//         <div className="absolute inset-0 bg-white z-10">
//           <Settings onClose={handleCloseSettings} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default SwipeWrapper;

export {};
