const prisma = require('../config/db');

const findByEmail = async (email) =>
  prisma.user.findUnique({
    where: { email },
  });

const createUser = async (data) =>
  prisma.user.create({
    data,
  });

const findById = async (id) =>
  prisma.user.findUnique({
    where: { id },
  });

module.exports = {
  findByEmail,
  createUser,
  findById,
};
