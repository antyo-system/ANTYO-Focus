const healthService = require('../services/healthService');

const getHealth = (_req, res) => {
  const status = healthService.getHealthStatus();
  return res.json(status);
};

module.exports = {
  getHealth
};
