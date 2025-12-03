const focusSessionRepository = require('../repositories/focusSessionRepository');

const getSessionsForUser = async (userId) => focusSessionRepository.findSessionsByUserId(userId);

module.exports = {
  getSessionsForUser,
};
