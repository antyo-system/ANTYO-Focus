const dashboardService = require('../services/dashboardService');
const { logger } = require('../middleware/logger');

const getDashboard = async (req, res) => {
  try {
    const summary = await dashboardService.getDashboardSummary(req.user.id);
    return res.json({ summary });
  } catch (error) {
    logger.error('Failed to build dashboard summary', { error });
    return res.status(500).json({ message: 'Failed to load dashboard' });
  }
};

module.exports = {
  getDashboard,
};
