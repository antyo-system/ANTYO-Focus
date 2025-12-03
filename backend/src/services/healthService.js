const healthRepository = require('../repositories/healthRepository');

const getHealthStatus = () => healthRepository.fetchStatus();

module.exports = {
  getHealthStatus
};
