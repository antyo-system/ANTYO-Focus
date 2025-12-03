const prisma = require('../config/db');

const findTasksByUserId = async (userId) =>
  prisma.task.findMany({
    where: { userId },
    include: { sessions: true },
    orderBy: { createdAt: 'desc' },
  });

module.exports = {
  findTasksByUserId,
};
