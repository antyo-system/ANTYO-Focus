import { randomUUID } from 'node:crypto';
import { buildNotFoundError } from '../utils/httpError.js';

const tasks = new Map();

export const createTask = ({ title, description, status = 'pending' }) => {
  const id = randomUUID();
  const now = new Date().toISOString();
  const task = { id, title, description: description ?? '', status, createdAt: now, updatedAt: now };
  tasks.set(id, task);
  return task;
};

export const getAllTasks = () => Array.from(tasks.values());

export const getTaskById = (id) => {
  const task = tasks.get(id);
  if (!task) {
    throw buildNotFoundError('Task', id);
  }
  return task;
};

export const updateTask = (id, payload) => {
  const existing = getTaskById(id);
  const updated = {
    ...existing,
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  tasks.set(id, updated);
  return updated;
};

export const deleteTask = (id) => {
  if (!tasks.delete(id)) {
    throw buildNotFoundError('Task', id);
  }
};

export const resetTasks = () => tasks.clear();
