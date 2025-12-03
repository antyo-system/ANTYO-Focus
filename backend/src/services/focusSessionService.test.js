process.env.NODE_ENV = 'test';

const assert = require('node:assert');
const { afterEach, beforeEach, describe, test, mock } = require('node:test');
const { FocusSessionStatus, TaskStatus } = require('../utils/prisma');

const taskRepository = require('../repositories/taskRepository');
const focusSessionRepository = require('../repositories/focusSessionRepository');
const focusSessionService = require('./focusSessionService');

beforeEach(() => {
  mock.restoreAll();
});

afterEach(() => {
  mock.restoreAll();
});

describe('focusSessionService.startSession', () => {
  test('throws when task does not exist', async () => {
    mock.method(taskRepository, 'findTaskByIdForUser', () => null);

    await assert.rejects(
      () =>
        focusSessionService.startSession({
          userId: 1,
          taskId: 100,
          targetDurationSeconds: 25,
        }),
      (error) => error.statusCode === 404 && error.message === 'Task not found'
    );
  });

  test('marks pending task as in progress when starting session', async () => {
    const createdSession = { id: 10, task: { id: 5, status: TaskStatus.PENDING } };
    mock.method(taskRepository, 'findTaskByIdForUser', () => ({ id: 5, status: TaskStatus.PENDING }));
    mock.method(focusSessionRepository, 'createSession', (data) => ({ ...data, ...createdSession }));
    const updateTaskMock = mock.method(taskRepository, 'updateTaskForUser', () => ({
      id: 5,
      status: TaskStatus.IN_PROGRESS,
    }));

    const result = await focusSessionService.startSession({
      userId: 1,
      taskId: 5,
      targetDurationSeconds: 50,
    });

    assert.strictEqual(result.task.status, TaskStatus.IN_PROGRESS);
    assert.strictEqual(updateTaskMock.mock.callCount(), 1);
  });
});

describe('focusSessionService.stopSession', () => {
  test('throws when session is not found', async () => {
    mock.method(focusSessionRepository, 'findSessionByIdForUser', () => null);

    await assert.rejects(
      () =>
        focusSessionService.stopSession({
          userId: 2,
          sessionId: 99,
        }),
      (error) => error.statusCode === 404 && error.message === 'Session not found'
    );
  });

  test('throws when session already completed', async () => {
    mock.method(focusSessionRepository, 'findSessionByIdForUser', () => ({
      id: 2,
      status: FocusSessionStatus.COMPLETED,
      endTime: new Date(),
    }));

    await assert.rejects(
      () =>
        focusSessionService.stopSession({
          userId: 2,
          sessionId: 2,
        }),
      (error) => error.statusCode === 400 && error.message === 'Session already completed'
    );
  });

  test('updates session and task status', async () => {
    const startTime = new Date(Date.now() - 8000);

    mock.method(focusSessionRepository, 'findSessionByIdForUser', () => ({
      id: 3,
      status: FocusSessionStatus.ACTIVE,
      startTime,
      taskId: 7,
      task: { id: 7, status: TaskStatus.IN_PROGRESS },
    }));

    const updateSessionMock = mock.method(focusSessionRepository, 'updateSession', (sessionId, data) => ({
      id: sessionId,
      ...data,
      startTime,
      task: { id: 7, status: data.status },
    }));

    const updateTaskMock = mock.method(taskRepository, 'updateTaskForUser', (taskId, data) => ({
      id: taskId,
      ...data,
    }));

    const result = await focusSessionService.stopSession({
      userId: 4,
      sessionId: 3,
      status: FocusSessionStatus.COMPLETED,
      taskStatus: TaskStatus.COMPLETED,
    });

    const [, updateData] = updateSessionMock.mock.calls[0].arguments;

    assert.strictEqual(result.status, FocusSessionStatus.COMPLETED);
    assert.strictEqual(result.durationSeconds, updateData.durationSeconds);
    assert.ok(updateData.durationSeconds >= 0);
    assert.strictEqual(updateTaskMock.mock.callCount(), 1);
    assert.strictEqual(updateSessionMock.mock.callCount(), 1);
  });
});
