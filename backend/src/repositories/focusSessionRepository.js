const prisma = require('../config/db');

const findSessionsByUserId = async (userId) =>
  prisma.focusSession.findMany({
    where: { task: { userId } },
    include: { task: true },
    orderBy: { startTime: 'desc' },
  });

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
