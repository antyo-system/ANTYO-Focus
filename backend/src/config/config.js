const dotenv = require('dotenv');

dotenv.config();

const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development'
};

module.exports = config;
