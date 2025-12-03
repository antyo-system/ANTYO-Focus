const prisma = require('../config/db');

const findSessionsByUserId = async ({ userId, filters = {}, pagination }) => {
  const where = { task: { userId } };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.taskId) {
    where.taskId = filters.taskId;
  }

  if (filters.startedFrom || filters.startedTo) {
    where.startTime = {};
    if (filters.startedFrom) {
      where.startTime.gte = filters.startedFrom;
    }
    if (filters.startedTo) {
      where.startTime.lte = filters.startedTo;
    }
  }

  const [sessions, total] = await Promise.all([
    prisma.focusSession.findMany({
      where,
      include: { task: true },
      orderBy: { startTime: 'desc' },
      skip: (pagination.page - 1) * pagination.pageSize,
      take: pagination.pageSize,
    }),
    prisma.focusSession.count({ where }),
  ]);

  return { sessions, total };
};

const findSessionByIdForUser = async (sessionId, userId) =>
  prisma.focusSession.findFirst({
    where: { id: sessionId, task: { userId } },
    include: { task: true },
  });

const createSession = async ({ taskId, startTime, durationSeconds, status }) =>
  prisma.focusSession.create({
    data: {
      taskId,
      startTime,
      durationSeconds,
      status,
    },
    include: { task: true },
  });

const updateSession = async (sessionId, data) =>
  prisma.focusSession.update({
    where: { id: sessionId },
    data,
    include: { task: true },
  });

module.exports = {
  findSessionsByUserId,
  findSessionByIdForUser,
  createSession,
  updateSession,
};
