const focusSessionService = require('../services/focusSessionService');
const { logger } = require('../middleware/logger');

const listSessions = async (req, res) => {
  try {
    const sessions = await focusSessionService.getSessionsForUser(req.user.id);
    return res.json({ sessions });
  } catch (error) {
    logger.error('Failed to fetch focus sessions', { error });
    return res.status(500).json({ message: 'Failed to fetch focus sessions' });
  }
};

module.exports = {
  listSessions,
};
