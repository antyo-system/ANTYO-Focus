const taskService = require('../services/taskService');

const listTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasksForUser(req.user.id);
    return res.json({ tasks });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

module.exports = {
  listTasks,
};
