import { PrismaClient, TaskStatus, FocusSessionStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@antyo.focus' },
    update: {},
    create: {
      email: 'demo@antyo.focus',
      name: 'Demo User',
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
      task: { connect: { id: taskTwo.id } },
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
