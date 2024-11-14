// import { useTheme, type ThemeMode } from "../ThemeProvider";

// const Settings = ({ onClose }: { onClose: () => void }) => {
//   const { theme, setTheme } = useTheme();

//   const handleThemeChange = (themeId: string, mode: ThemeMode) => {
//     setTheme({ id: themeId, mode });
//   };

//   return (
//     <div className="p-4">
//       <button onClick={onClose} className="mb-4">
//         Close
//       </button>
//       <h2 className="text-2xl font-bold mb-4">Settings</h2>
//       <div>
//         <label className="block mb-2">Select Theme:</label>
//         <div className="grid grid-cols-1 gap-4">
//           {themes.map((themeItem) => (
//             <div key={themeItem.id} className="flex items-center">
//               <div className="w-24">{themeItem.name}</div>
//               {["light", "dark", "system"].map((mode) => (
//                 <button
//                   key={mode}
//                   onClick={() => handleThemeChange(themeItem.id, mode)}
//                   className={`w-16 h-16 rounded-lg border ml-2 ${
//                     theme.id === themeItem.id && theme.mode === mode
//                       ? "ring-2 ring-primary"
//                       : ""
//                   }`}
//                   style={{
//                     background:
//                       mode === "system"
//                         ? `linear-gradient(135deg, ${themeItem.colors.light} 0%, ${themeItem.colors.dark} 100%)`
//                         : themeItem.colors[mode],
//                   }}
//                   title={`${themeItem.name} ${
//                     mode.charAt(0).toUpperCase() + mode.slice(1)
//                   }`}
//                 >
//                   {mode === "system" ? "S" : ""}
//                 </button>
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;

export {};
