const fetchStatus = () => ({
  status: 'ok',
  uptime: process.uptime(),
  timestamp: new Date().toISOString()
});

module.exports = {
  fetchStatus
};
