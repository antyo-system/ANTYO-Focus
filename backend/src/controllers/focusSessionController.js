const focusSessionService = require('../services/focusSessionService');

const listSessions = async (req, res) => {
  try {
    const sessions = await focusSessionService.getSessionsForUser(req.user.id);
    return res.json({ sessions });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch focus sessions' });
  }
};

module.exports = {
  listSessions,
};
