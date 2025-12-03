const { FocusSessionStatus, TaskStatus } = require('../utils/prisma');
const focusSessionService = require('../services/focusSessionService');
const { logger } = require('../middleware/logger');

const listSessions = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const filters = {};

  if (page < 1 || pageSize < 1) {
    return res.status(400).json({ message: 'page and pageSize must be positive integers' });
  }

  if (req.query.status) {
    const status = req.query.status.trim();
    if (!Object.values(FocusSessionStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid focus session status filter' });
    }
    filters.status = status;
  }

  if (req.query.taskId) {
    const taskId = Number(req.query.taskId);
    if (!Number.isInteger(taskId)) {
      return res.status(400).json({ message: 'taskId filter must be a number' });
    }
    filters.taskId = taskId;
  }

  if (req.query.startedFrom) {
    const parsed = new Date(req.query.startedFrom);
    if (Number.isNaN(parsed.getTime())) {
      return res.status(400).json({ message: 'Invalid startedFrom filter' });
    }
    filters.startedFrom = parsed;
  }

  if (req.query.startedTo) {
    const parsed = new Date(req.query.startedTo);
    if (Number.isNaN(parsed.getTime())) {
      return res.status(400).json({ message: 'Invalid startedTo filter' });
    }
    filters.startedTo = parsed;
  }

  try {
    const { sessions, total } = await focusSessionService.getSessionsForUser({
      userId: req.user.id,
      filters,
      pagination: { page, pageSize },
    });
    return res.json({ sessions, pagination: { page, pageSize, total } });
  } catch (error) {
    logger.error('Failed to fetch focus sessions', { error });
    return res.status(500).json({ message: 'Failed to fetch focus sessions' });
  }
};

const startSession = async (req, res) => {
  const taskId = Number(req.body.taskId);
  const targetDurationSeconds =
    req.body.targetDurationSeconds !== undefined
      ? Number(req.body.targetDurationSeconds)
      : undefined;

  if (!Number.isInteger(taskId)) {
    return res.status(400).json({ message: 'taskId must be provided' });
  }

  if (targetDurationSeconds !== undefined && !Number.isInteger(targetDurationSeconds)) {
    return res.status(400).json({ message: 'targetDurationSeconds must be an integer' });
  }

  try {
    const session = await focusSessionService.startSession({
      userId: req.user.id,
      taskId,
      targetDurationSeconds,
    });
    return res.status(201).json({ session });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    logger.error('Failed to start focus session', { error });
    return res.status(statusCode).json({ message: error.message || 'Failed to start session' });
  }
};

const stopSession = async (req, res) => {
  const sessionId = Number(req.params.id);
  if (!Number.isInteger(sessionId)) {
    return res.status(400).json({ message: 'sessionId must be a number' });
  }

  const { status, taskStatus } = req.body;

  if (status && !Object.values(FocusSessionStatus).includes(status)) {
    return res.status(400).json({ message: 'Invalid session status' });
  }

  if (taskStatus && !Object.values(TaskStatus).includes(taskStatus)) {
    return res.status(400).json({ message: 'Invalid task status' });
  }

  try {
    const session = await focusSessionService.stopSession({
      userId: req.user.id,
      sessionId,
      status,
      taskStatus,
    });
    return res.json({ session });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    logger.error('Failed to stop focus session', { error });
    return res.status(statusCode).json({ message: error.message || 'Failed to stop session' });
  }
};

module.exports = {
  listSessions,
  startSession,
  stopSession,
};
