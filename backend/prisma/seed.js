const { PrismaClient, TaskStatus, FocusSessionStatus } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  const today = new Date();
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);

  const user = await prisma.user.upsert({
    where: { email: 'demo@antyo.focus' },
    update: {},
    create: {
      email: 'demo@antyo.focus',
      name: 'Demo User',
      passwordHash,
      totalFocusSeconds: 22 * 60,
      totalDistractedSeconds: 3 * 60,
      weeklyFocusSeconds: 22 * 60,
      currentStreakDays: 1,
      longestStreakDays: 1,
      lastFocusDate: startOfToday,
      totalSessions: 1,
      completedTasks: 0,
    },
  });

  const taskOne = await prisma.task.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Setup workspace',
      description: 'Install dependencies and review onboarding docs.',
      status: TaskStatus.IN_PROGRESS,
      dueDate: new Date(Date.now() + 72 * 60 * 60 * 1000),
      focusDurationSeconds: 22 * 60,
      distractionDurationSeconds: 3 * 60,
      user: { connect: { id: user.id } },
    },
  });

  const taskTwo = await prisma.task.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Plan weekly focus goals',
      description: 'Define three focus sessions for this week.',
      status: TaskStatus.PENDING,
      dueDate: new Date(Date.now() + 120 * 60 * 60 * 1000),
      user: { connect: { id: user.id } },
    },
  });

  await prisma.focusSession.upsert({
    where: { id: 1 },
    update: {},
    create: {
      startTime: new Date(),
      endTime: new Date(Date.now() + 25 * 60 * 1000),
      durationSeconds: 25 * 60,
      status: FocusSessionStatus.COMPLETED,
      focusDurationSeconds: 22 * 60,
      distractionDurationSeconds: 3 * 60,
      interruptionCount: 1,
      task: { connect: { id: taskOne.id } },
    },
  });

  await prisma.focusSession.upsert({
    where: { id: 2 },
    update: {},
    create: {
      startTime: new Date(Date.now() + 60 * 60 * 1000),
      durationSeconds: 50 * 60,
      status: FocusSessionStatus.PLANNED,
      focusDurationSeconds: 0,
      distractionDurationSeconds: 0,
      interruptionCount: 0,
      task: { connect: { id: taskTwo.id } },
    },
  });

  await prisma.focusDailyStat.upsert({
    where: {
      userId_date: {
        userId: user.id,
        date: startOfToday,
      },
    },
    update: {},
    create: {
      date: startOfToday,
      focusDurationSeconds: 22 * 60,
      distractionDurationSeconds: 3 * 60,
      sessionCount: 1,
      user: { connect: { id: user.id } },
    },
  });
}

main()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
