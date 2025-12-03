process.env.NODE_ENV = 'test';

const assert = require('node:assert');
const { afterEach, beforeEach, describe, test, mock } = require('node:test');

const taskService = require('./taskService');
const taskRepository = require('../repositories/taskRepository');

beforeEach(() => {
  mock.restoreAll();
});

afterEach(() => {
  mock.restoreAll();
});

describe('taskService', () => {
  test('ensureValidTaskStatus returns true for known status', () => {
    assert.strictEqual(taskService.ensureValidTaskStatus('PENDING'), true);
  });

  test('ensureValidTaskStatus returns false for unknown status', () => {
    assert.strictEqual(taskService.ensureValidTaskStatus('INVALID'), false);
  });

  test('updateTaskForUser throws 404 when task is missing', async () => {
    mock.method(taskRepository, 'findTaskByIdForUser', () => null);

    await assert.rejects(
      () => taskService.updateTaskForUser({ taskId: 1, userId: 10, data: {} }),
      (error) => error.statusCode === 404 && error.message === 'Task not found'
    );
  });

  test('updateTaskForUser updates existing task', async () => {
    const updatedTask = { id: 1, title: 'Updated' };
    mock.method(taskRepository, 'findTaskByIdForUser', () => ({ id: 1 }));
    const updateMock = mock.method(taskRepository, 'updateTaskForUser', () => updatedTask);

    const result = await taskService.updateTaskForUser({
      taskId: 1,
      userId: 5,
      data: { title: 'Updated' },
    });

    assert.deepStrictEqual(result, updatedTask);
    assert.strictEqual(updateMock.mock.callCount(), 1);
  });

  test('deleteTaskForUser throws 404 when task is missing', async () => {
    mock.method(taskRepository, 'findTaskByIdForUser', () => null);

    await assert.rejects(
      () => taskService.deleteTaskForUser({ taskId: 2, userId: 10 }),
      (error) => error.statusCode === 404 && error.message === 'Task not found'
    );
  });

  test('deleteTaskForUser deletes an existing task', async () => {
    mock.method(taskRepository, 'findTaskByIdForUser', () => ({ id: 2 }));
    const deleteMock = mock.method(taskRepository, 'deleteTaskForUser', () => ({ id: 2 }));

    const result = await taskService.deleteTaskForUser({ taskId: 2, userId: 10 });

    assert.deepStrictEqual(result, { id: 2 });
    assert.strictEqual(deleteMock.mock.callCount(), 1);
  });
});
