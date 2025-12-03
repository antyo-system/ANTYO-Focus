const taskRepository = require('../repositories/taskRepository');

const getTasksForUser = async (userId) => taskRepository.findTasksByUserId(userId);

module.exports = {
  getTasksForUser,
};
