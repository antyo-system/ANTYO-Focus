import assert from "node:assert/strict";
import test from "node:test";

const createMockStorage = () => {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, value),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
};

const loadService = () =>
  import(`./sessionService.js?seed=${Math.random().toString(16).slice(2)}`);

test(
  "creates, stops, and records a session with task progress",
  { concurrency: false },
  async () => {
    globalThis.localStorage = createMockStorage();
    const { startSession, stopSession, listSessions } = await loadService();

    await startSession({
      task: "Write report",
      mode: "timer",
      targetDurationMinutes: 1,
    });

    const { activeSession } = await listSessions();
    assert.equal(activeSession.task, "Write report");
    assert.equal(activeSession.targetDurationMs, 60000);

    // simulate time passing before stopping
    await new Promise((resolve) => setTimeout(resolve, 10));

    const { session } = await stopSession({
      focusSeconds: 30,
      distractedSeconds: 5,
    });

    assert.equal(session.result, "aborted");
    assert.equal(session.focusMs, 30000);
    assert.equal(session.distractedMs, 5000);
    assert.ok(session.actualDurationMs > 0);

    const { activeSession: afterActive, sessions } = await listSessions();
    assert.equal(afterActive, null);
    assert.equal(sessions.length, 1);
    assert.equal(sessions[0].targetDurationMs, 60000);

    const tasks = JSON.parse(globalThis.localStorage.getItem("antyo_tasks"));
    assert.equal(tasks["Write report"].lastResult, "aborted");
    assert.equal(tasks["Write report"].totalFocusMs, 30000);
  }
);

test(
  "marks session completed when target duration is reached",
  { concurrency: false },
  async () => {
    globalThis.localStorage = createMockStorage();
    const { startSession, stopSession, listSessions } = await loadService();

    await startSession({ task: "Design UI", mode: "timer", targetDurationMinutes: 1 });

    const { activeSession } = await listSessions();
    const backdated = { ...activeSession, startTime: Date.now() - 61000 };
    globalThis.localStorage.setItem("antyo_active_session", JSON.stringify(backdated));

    const { session } = await stopSession({ focusSeconds: 70, distractedSeconds: 0 });
    assert.equal(session.result, "completed");
  }
);
