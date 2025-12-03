const { TaskStatus, FocusSessionStatus } = require('@prisma/client');
const prisma = require('../config/db');

const buildStatusCounts = (groups, statuses) =>
  statuses.reduce((acc, status) => {
    const match = groups.find((group) => group.status === status);
    return { ...acc, [status]: match ? match._count._all : 0 };
  }, {});

const getDashboardSummary = async (userId) => {
  const [taskGroups, sessionGroups, sessionDurationAgg, recentSessions, upcomingTasks] =
    await Promise.all([
      prisma.task.groupBy({
        by: ['status'],
        _count: { _all: true },
        where: { userId },
      }),
      prisma.focusSession.groupBy({
        by: ['status'],
        _count: { _all: true },
        where: { task: { userId } },
      }),
      prisma.focusSession.aggregate({
        where: { task: { userId } },
        _sum: { durationSeconds: true },
      }),
      prisma.focusSession.findMany({
        where: { task: { userId } },
        include: { task: true },
        orderBy: { startTime: 'desc' },
        take: 5,
      }),
      prisma.task.findMany({
        where: {
          userId,
          status: { not: TaskStatus.COMPLETED },
        },
        orderBy: [{ dueDate: 'asc' }, { createdAt: 'asc' }],
        take: 5,
      }),
    ]);

  const taskStatusCounts = buildStatusCounts(taskGroups, Object.values(TaskStatus));
  const sessionStatusCounts = buildStatusCounts(sessionGroups, Object.values(FocusSessionStatus));

  const totalTasks = Object.values(taskStatusCounts).reduce((sum, count) => sum + count, 0);
  const totalSessions = Object.values(sessionStatusCounts).reduce((sum, count) => sum + count, 0);

  return {
    tasks: {
      total: totalTasks,
      byStatus: taskStatusCounts,
      upcoming: upcomingTasks,
    },
    sessions: {
      total: totalSessions,
      durationSeconds: sessionDurationAgg._sum.durationSeconds || 0,
      byStatus: sessionStatusCounts,
      recent: recentSessions,
    },
  };
};

module.exports = {
  getDashboardSummary,
};
