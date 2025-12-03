const prisma = require('../config/db');

const findTasksByUserId = async ({ userId, filters = {}, pagination }) => {
  const where = { userId };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.dueFrom || filters.dueTo) {
    where.dueDate = {};
    if (filters.dueFrom) {
      where.dueDate.gte = filters.dueFrom;
    }
    if (filters.dueTo) {
      where.dueDate.lte = filters.dueTo;
    }
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      include: { sessions: true },
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
      skip: (pagination.page - 1) * pagination.pageSize,
      take: pagination.pageSize,
    }),
    prisma.task.count({ where }),
  ]);

  return { tasks, total };
};

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
