const taskService = require('../services/taskService');
const { logger } = require('../middleware/logger');

const listTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasksForUser(req.user.id);
    return res.json({ tasks });
  } catch (error) {
    logger.error('Failed to fetch tasks', { error });
    return res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

module.exports = {
  listTasks,
};
