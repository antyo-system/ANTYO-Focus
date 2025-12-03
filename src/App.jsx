import { Routes, Route } from "react-router-dom";
import PreFocus from "./pages/prefocus";
import FocusScreen from "./pages/focus";
import Dashboard from "./pages/Dashboard";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PreFocus />} />
      <Route path="/focus" element={<FocusScreen />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
