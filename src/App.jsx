import { Routes, Route } from "react-router-dom";
import PreFocus from "./pages/prefocus";
import FocusScreen from "./pages/focus";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PreFocus />} />
      <Route path="/focus" element={<FocusScreen />} />
    </Routes>
  );
}
