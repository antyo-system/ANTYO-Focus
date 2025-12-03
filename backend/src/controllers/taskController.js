const taskService = require('../services/taskService');
const { logger } = require('../middleware/logger');

const validateTaskPayload = (payload, { requireTitle = false } = {}) => {
  const errors = [];
  const data = {};

  if (requireTitle && !payload.title) {
    errors.push('Title is required');
  }

  if (payload.title !== undefined) {
    if (typeof payload.title !== 'string' || !payload.title.trim()) {
      errors.push('Title must be a non-empty string');
    } else {
      data.title = payload.title.trim();
    }
  }

  if (payload.description !== undefined) {
    data.description = typeof payload.description === 'string' ? payload.description : null;
  }

  if (payload.status !== undefined) {
    if (!taskService.ensureValidTaskStatus(payload.status)) {
      errors.push('Invalid task status');
    } else {
      data.status = payload.status;
    }
  }

  if (payload.dueDate !== undefined) {
    const parsed = new Date(payload.dueDate);
    if (Number.isNaN(parsed.getTime())) {
      errors.push('Invalid dueDate');
    } else {
      data.dueDate = parsed;
    }
  }

  return { errors, data };
};

const listTasks = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const filters = {};

  if (page < 1 || pageSize < 1) {
    return res.status(400).json({ message: 'page and pageSize must be positive integers' });
  }

  if (req.query.status) {
    const status = req.query.status.trim();
    if (!taskService.ensureValidTaskStatus(status)) {
      return res.status(400).json({ message: 'Invalid task status filter' });
    }
    filters.status = status;
  }

  if (req.query.dueFrom) {
    const parsed = new Date(req.query.dueFrom);
    if (Number.isNaN(parsed.getTime())) {
      return res.status(400).json({ message: 'Invalid dueFrom filter' });
    }
    filters.dueFrom = parsed;
  }

  if (req.query.dueTo) {
    const parsed = new Date(req.query.dueTo);
    if (Number.isNaN(parsed.getTime())) {
      return res.status(400).json({ message: 'Invalid dueTo filter' });
    }
    filters.dueTo = parsed;
  }

  try {
    const { tasks, total } = await taskService.getTasksForUser({
      userId: req.user.id,
      filters,
      pagination: { page, pageSize },
    });
    return res.json({ tasks, pagination: { page, pageSize, total } });
  } catch (error) {
    logger.error('Failed to fetch tasks', { error });
    return res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

const createTask = async (req, res) => {
  const { errors, data } = validateTaskPayload(req.body, { requireTitle: true });
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  try {
    const task = await taskService.createTaskForUser({
      ...data,
      status: data.status || 'PENDING',
      userId: req.user.id,
    });
    return res.status(201).json({ task });
  } catch (error) {
    logger.error('Failed to create task', { error });
    return res.status(500).json({ message: 'Failed to create task' });
  }
};

const updateTask = async (req, res) => {
  const taskId = Number(req.params.id);
  if (!Number.isInteger(taskId)) {
    return res.status(400).json({ message: 'Task id must be a number' });
  }

  const { errors, data } = validateTaskPayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  try {
    const task = await taskService.updateTaskForUser({ taskId, userId: req.user.id, data });
    return res.json({ task });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    logger.error('Failed to update task', { error });
    return res.status(statusCode).json({ message: error.message || 'Failed to update task' });
  }
};

const deleteTask = async (req, res) => {
  const taskId = Number(req.params.id);
  if (!Number.isInteger(taskId)) {
    return res.status(400).json({ message: 'Task id must be a number' });
  }

  try {
    await taskService.deleteTaskForUser({ taskId, userId: req.user.id });
    return res.status(204).send();
  } catch (error) {
    const statusCode = error.statusCode || 500;
    logger.error('Failed to delete task', { error });
    return res.status(statusCode).json({ message: error.message || 'Failed to delete task' });
  }
};

module.exports = {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
};
