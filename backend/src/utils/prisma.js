let PrismaClient;
let TaskStatus;
let FocusSessionStatus;

try {
  ({ PrismaClient, TaskStatus, FocusSessionStatus } = require('@prisma/client'));
} catch (error) {
  if (process.env.NODE_ENV === 'test') {
    TaskStatus = {
      PENDING: 'PENDING',
      IN_PROGRESS: 'IN_PROGRESS',
      COMPLETED: 'COMPLETED',
    };

    FocusSessionStatus = {
      ACTIVE: 'ACTIVE',
      COMPLETED: 'COMPLETED',
      CANCELLED: 'CANCELLED',
    };

    PrismaClient = class {
      constructor() {
        this.task = {};
        this.focusSession = {};
        this.user = {};
      }
    };
  } else {
    throw error;
  }
}

module.exports = { PrismaClient, TaskStatus, FocusSessionStatus };
