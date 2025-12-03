import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  resetTasks,
  updateTask,
} from '../services/taskService.js';

test('taskService supports create/read/update/delete', () => {
  resetTasks();

  const created = createTask({ title: 'Write docs', description: 'Document API', status: 'pending' });
  assert.ok(created.id);

  const fetched = getTaskById(created.id);
  assert.equal(fetched.title, 'Write docs');

  const updated = updateTask(created.id, { status: 'done' });
  assert.equal(updated.status, 'done');
  assert.notEqual(updated.updatedAt, created.updatedAt);

  const tasks = getAllTasks();
  assert.equal(tasks.length, 1);

  deleteTask(created.id);
  assert.equal(getAllTasks().length, 0);
});
