const config = require('../config/config');
const { logger } = require('./logger');

const notFoundHandler = (req, res, next) => {
  const error = new Error('Not Found');
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  logger.error(message, {
    error: err,
    path: req.originalUrl,
    method: req.method,
    statusCode,
  });

  const response = { message };

  if (config.nodeEnv !== 'production' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = { notFoundHandler, errorHandler };
