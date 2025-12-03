const { TaskStatus, FocusSessionStatus } = require('../utils/prisma');
const prisma = require('../config/db');

const buildStatusCounts = (groups, statuses) =>
  statuses.reduce((acc, status) => {
    const match = groups.find((group) => group.status === status);
    return { ...acc, [status]: match ? match._count._all : 0 };
  }, {});

const DAYS_OF_HISTORY = 14;

const buildDateKey = (date) => new Date(date).toISOString().split('T')[0];

const buildDailySeries = (startDate, endDate, dailyStats) => {
  const statsByDate = dailyStats.reduce((acc, stat) => {
    acc.set(buildDateKey(stat.date), stat);
    return acc;
  }, new Map());

  const results = [];
  for (
    const cursor = new Date(startDate);
    cursor <= endDate;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    const key = buildDateKey(cursor);
    const stat = statsByDate.get(key);
    results.push({
      date: key,
      focusDurationSeconds: stat?.focusDurationSeconds || 0,
      distractionDurationSeconds: stat?.distractionDurationSeconds || 0,
      sessionCount: stat?.sessionCount || 0,
    });
  }

  return results;
};

const getDashboardSummary = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (DAYS_OF_HISTORY - 1));

  const [
    taskGroups,
    sessionGroups,
    sessionDurationAgg,
    recentSessions,
    upcomingTasks,
    dailyStats,
    user,
  ] = await Promise.all([
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
    prisma.focusDailyStat.findMany({
      where: { userId, date: { gte: startDate } },
      orderBy: { date: 'asc' },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        currentStreakDays: true,
        longestStreakDays: true,
        lastFocusDate: true,
        totalFocusSeconds: true,
        weeklyFocusSeconds: true,
      },
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
    focus: {
      streak: {
        currentDays: user?.currentStreakDays || 0,
        longestDays: user?.longestStreakDays || 0,
        lastFocusDate: user?.lastFocusDate || null,
      },
      totals: {
        lifetimeFocusSeconds: user?.totalFocusSeconds || 0,
        weeklyFocusSeconds: user?.weeklyFocusSeconds || 0,
      },
      daily: buildDailySeries(startDate, today, dailyStats),
    },
  };
};

module.exports = {
  getDashboardSummary,
};
