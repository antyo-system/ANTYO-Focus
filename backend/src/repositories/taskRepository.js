const prisma = require('../config/db');

const findTasksByUserId = async (userId) =>
  prisma.task.findMany({
    where: { userId },
    include: { sessions: true },
    orderBy: { createdAt: 'desc' },
  });

const findTaskByIdForUser = async (taskId, userId) =>
  prisma.task.findFirst({
    where: { id: taskId, userId },
    include: { sessions: true },
  });

const createTask = async ({ title, description, status, dueDate, userId }) =>
  prisma.task.create({
    data: {
      title,
      description,
      status,
      dueDate,
      userId,
    },
    include: { sessions: true },
  });

const updateTaskForUser = async (taskId, data) =>
  prisma.task.update({
    where: { id: taskId },
    data,
    include: { sessions: true },
  });

const deleteTaskForUser = async (taskId) =>
  prisma.task.delete({
    where: { id: taskId },
  });

module.exports = {
  findTasksByUserId,
  findTaskByIdForUser,
  createTask,
  updateTaskForUser,
  deleteTaskForUser,
};
