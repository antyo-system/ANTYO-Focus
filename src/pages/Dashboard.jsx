import { useEffect, useState } from "react";
import packageJson from "../../package.json";
import { useNavigate } from "react-router-dom";
import { listSessions } from "../services/sessionService";

const version = packageJson.version;

export default function Dashboard() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const { sessions } = await listSessions();
      setHistory(sessions);
    };

    fetchSessions();
  }, []);

  // hitung total harian (sementara total semua aja dulu)
  const totalFocus = history.reduce((sum, s) => sum + (s.focusMs || 0), 0);
  const totalDistracted = history.reduce(
    (sum, s) => sum + (s.distractedMs || 0),
    0
  );
  const navigate = useNavigate();
  const handleStartNewSession = () => {
    navigate("/prefocus");
  };
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold text-green-400 mb-8">Focus Summary</h1>

      <div className="mb-6">
        <p>Total Focus Time: {Math.floor(totalFocus / 60)} min</p>
        <p>Total Distracted Time: {Math.floor(totalDistracted / 60)} min</p>
        <p>Total Sessions: {history.length}</p>
      </div>
      <button
        onClick={handleStartNewSession}
        className="mt-8 bg-green-400 text-black font-bold py-3 px-6 rounded-xl text-lg hover:bg-green-300 transition"
      >
        🎯 Start New Session
      </button>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Recent Sessions</h2>
      <div className="space-y-4">
        {history.length === 0 && (
          <p className="text-gray-400">No sessions yet. Start one!</p>
        )}

        {history.map((s, i) => (
          <div
            key={i}
            className="border border-green-500/40 bg-black/40 rounded-xl p-4"
          >
            <p className="text-green-300 font-bold">
              {s.task || "Unnamed Task"}
            </p>
            <p>
              Focus: {Math.floor((s.focusMs || 0) / 60000)} min | Distracted:{" "}
              {Math.floor((s.distractedMs || 0) / 60000)} min
            </p>
            <p>
              Target: {s.targetDurationMs ? Math.round(s.targetDurationMs / 60000) : "-"} min | Result: {s.result}
            </p>
            <p className="text-sm text-gray-400">
              {new Date(s.startTime).toLocaleString()} → {new Date(s.endTime).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-gray-500 text-sm">App Version: {version}</div>
    </div>
  );
}
