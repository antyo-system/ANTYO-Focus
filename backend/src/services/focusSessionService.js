const { FocusSessionStatus, TaskStatus } = require('../utils/prisma');
const focusSessionRepository = require('../repositories/focusSessionRepository');
const taskRepository = require('../repositories/taskRepository');

const getSessionsForUser = async ({ userId, filters, pagination }) =>
  focusSessionRepository.findSessionsByUserId({ userId, filters, pagination });

const startSession = async ({ userId, taskId, targetDurationSeconds }) => {
  const task = await taskRepository.findTaskByIdForUser(taskId, userId);

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  const startTime = new Date();
  const session = await focusSessionRepository.createSession({
    taskId,
    startTime,
    durationSeconds: targetDurationSeconds || 0,
    status: FocusSessionStatus.ACTIVE,
  });

  if (task.status === TaskStatus.PENDING) {
    await taskRepository.updateTaskForUser(taskId, { status: TaskStatus.IN_PROGRESS });
    session.task.status = TaskStatus.IN_PROGRESS;
  }

  return session;
};

const stopSession = async ({ userId, sessionId, status, taskStatus }) => {
  const session = await focusSessionRepository.findSessionByIdForUser(sessionId, userId);

  if (!session) {
    const error = new Error('Session not found');
    error.statusCode = 404;
    throw error;
  }

  if (session.status === FocusSessionStatus.COMPLETED && session.endTime) {
    const error = new Error('Session already completed');
    error.statusCode = 400;
    throw error;
  }

  const resolvedStatus = status || FocusSessionStatus.COMPLETED;
  const endTime = new Date();
  const durationSeconds = Math.max(0, Math.round((endTime - session.startTime) / 1000));

  const updatedSession = await focusSessionRepository.updateSession(sessionId, {
    endTime,
    durationSeconds,
    status: resolvedStatus,
  });

  if (taskStatus && Object.values(TaskStatus).includes(taskStatus)) {
    await taskRepository.updateTaskForUser(session.taskId, { status: taskStatus });
    updatedSession.task.status = taskStatus;
  }

  return updatedSession;
};

module.exports = {
  getSessionsForUser,
  startSession,
  stopSession,
};
