import assert from 'node:assert/strict';
import test from 'node:test';

import { createApp } from '../app.js';
import { resetTasks } from '../services/taskService.js';

test('task routes handle lifecycle with validation and errors', async () => {
  resetTasks();
  const app = createApp();

  const createResponse = await app.handle({
    method: 'POST',
    path: '/tasks',
    body: { title: 'Implement API', description: 'Wire controllers' },
  });

  assert.equal(createResponse.statusCode, 201);
  assert.ok(createResponse.body.id);

  const listResponse = await app.handle({ method: 'GET', path: '/tasks' });
  assert.equal(listResponse.statusCode, 200);
  assert.equal(listResponse.body.length, 1);

  const taskId = createResponse.body.id;
  const updateResponse = await app.handle({
    method: 'PATCH',
    path: `/tasks/${taskId}`,
    body: { status: 'done' },
  });
  assert.equal(updateResponse.statusCode, 200);
  assert.equal(updateResponse.body.status, 'done');

  const deleteResponse = await app.handle({ method: 'DELETE', path: `/tasks/${taskId}` });
  assert.equal(deleteResponse.statusCode, 204);

  const notFoundResponse = await app.handle({ method: 'GET', path: `/tasks/${taskId}` });
  assert.equal(notFoundResponse.statusCode, 404);
});

test('validation middleware blocks invalid payloads', async () => {
  resetTasks();
  const app = createApp();

  const invalidCreate = await app.handle({ method: 'POST', path: '/tasks', body: { description: 'Missing title' } });
  assert.equal(invalidCreate.statusCode, 400);
  assert.equal(invalidCreate.body.message, 'Invalid request body');

  const invalidUpdate = await app.handle({ method: 'PATCH', path: '/tasks/not-an-id', body: { status: 'unknown' } });
  assert.equal(invalidUpdate.statusCode, 400);
  assert.equal(invalidUpdate.body.message, 'Invalid request body');
});
