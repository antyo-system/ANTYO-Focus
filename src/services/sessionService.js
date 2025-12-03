const STORAGE_KEY = "antyo_sessions";
const ACTIVE_SESSION_KEY = "antyo_active_session";
const TASKS_KEY = "antyo_tasks";

const getStorage = () => {
  if (typeof globalThis !== "undefined" && globalThis.localStorage) {
    return globalThis.localStorage;
  }

  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage;
  }

  const store = new Map();

  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, value),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
};

const storage = getStorage();

const readJson = (key, fallback) => {
  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Unable to parse ${key}`, err);
    return fallback;
  }
};

const writeJson = (key, value) => {
  storage.setItem(key, JSON.stringify(value));
};

const getId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const getActiveSession = () => readJson(ACTIVE_SESSION_KEY, null);

export const listSessions = async () => ({
  activeSession: getActiveSession(),
  sessions: readJson(STORAGE_KEY, []),
});

export const startSession = async ({ task, mode, targetDurationMinutes }) => {
  const targetDurationMs =
    mode === "timer" && Number.isFinite(targetDurationMinutes)
      ? Number(targetDurationMinutes) * 60 * 1000
      : null;

  const session = {
    id: getId(),
    task,
    mode,
    targetDurationMs,
    startTime: Date.now(),
  };

  writeJson(ACTIVE_SESSION_KEY, session);

  return { session };
};

const updateTaskProgress = (completedSession) => {
  const tasks = readJson(TASKS_KEY, {});
  const existing = tasks[completedSession.task] || {
    label: completedSession.task,
    sessions: 0,
    totalFocusMs: 0,
    lastResult: null,
    progress: 0,
  };

  const target = completedSession.targetDurationMs;
  const effectiveDuration = completedSession.focusMs || completedSession.actualDurationMs;
  existing.sessions += 1;
  existing.totalFocusMs += effectiveDuration;
  existing.lastResult = completedSession.result;

  if (target) {
    const newProgress = Math.min(
      100,
      Math.round((completedSession.actualDurationMs / target) * 100)
    );
    existing.progress = Math.max(existing.progress, newProgress);
  }

  tasks[completedSession.task] = existing;
  writeJson(TASKS_KEY, tasks);
};

export const stopSession = async ({ focusSeconds = 0, distractedSeconds = 0, result } = {}) => {
  const active = getActiveSession();
  if (!active) {
    throw new Error("No active session to stop.");
  }

  const endTime = Date.now();
  const actualDurationMs = endTime - active.startTime;
  const derivedResult =
    result ||
    (active.targetDurationMs && actualDurationMs + 5000 < active.targetDurationMs
      ? "aborted"
      : "completed");

  const completedSession = {
    ...active,
    endTime,
    actualDurationMs,
    focusMs: focusSeconds * 1000,
    distractedMs: distractedSeconds * 1000,
    result: derivedResult,
  };

  const history = readJson(STORAGE_KEY, []);
  history.push(completedSession);
  writeJson(STORAGE_KEY, history);
  storage.removeItem(ACTIVE_SESSION_KEY);

  updateTaskProgress(completedSession);

  return { session: completedSession };
};
