import "./App.css";
import PomodoroTimer from "./components/pomodoro/PomodoroTimer";

function App() {
  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  //   console.log(await invoke("greet", { name: "World" }));
  // }

  return <PomodoroTimer />;
}

export default App;
