import "./App.css";
import PomodoroTimer from "./components/pomodoro/PomodoroTimer";

function App() {
  // const [greetMsg, setGreetMsg] = useState("");
  // const [name, setName] = useState("");

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  return <PomodoroTimer />;
}

export default App;
