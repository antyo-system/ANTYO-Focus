const prisma = require('../config/db');

const findSessionsByUserId = async (userId) =>
  prisma.focusSession.findMany({
    where: { task: { userId } },
    include: { task: true },
    orderBy: { startTime: 'desc' },
  });

module.exports = {
  findSessionsByUserId,
};
