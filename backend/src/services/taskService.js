const { TaskStatus } = require('@prisma/client');
const taskRepository = require('../repositories/taskRepository');

const getTasksForUser = async (userId) => taskRepository.findTasksByUserId(userId);

const getTaskByIdForUser = async (taskId, userId) => taskRepository.findTaskByIdForUser(taskId, userId);

const createTaskForUser = async ({ title, description, status, dueDate, userId }) =>
  taskRepository.createTask({ title, description, status, dueDate, userId });

const updateTaskForUser = async ({ taskId, userId, data }) => {
  const existing = await taskRepository.findTaskByIdForUser(taskId, userId);
  if (!existing) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  return taskRepository.updateTaskForUser(taskId, data);
};

const deleteTaskForUser = async ({ taskId, userId }) => {
  const existing = await taskRepository.findTaskByIdForUser(taskId, userId);
  if (!existing) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  return taskRepository.deleteTaskForUser(taskId);
};

const ensureValidTaskStatus = (status) => {
  const allowed = Object.values(TaskStatus);
  return allowed.includes(status);
};

module.exports = {
  getTasksForUser,
  getTaskByIdForUser,
  createTaskForUser,
  updateTaskForUser,
  deleteTaskForUser,
  ensureValidTaskStatus,
};
