const dotenv = require('dotenv');

dotenv.config();

const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  logLevel: process.env.LOG_LEVEL || 'info'
};

module.exports = config;
