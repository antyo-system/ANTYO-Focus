const { createLogger, format, transports } = require('winston');
const config = require('../config/config');

const SENSITIVE_KEYS = [
  'password',
  'pass',
  'authorization',
  'auth',
  'token',
  'access_token',
  'refresh_token',
  'apikey',
  'secret',
  'cookie',
  'set-cookie'
];

const sanitizeMeta = (meta) => {
  const redactValue = (value) => {
    if (value instanceof Error) {
      return {
        message: value.message,
        stack: value.stack,
      };
    }

    if (Array.isArray(value)) {
      return value.map((item) => redactValue(item));
    }

    if (value && typeof value === 'object') {
      return Object.entries(value).reduce((sanitized, [innerKey, innerValue]) => {
        const shouldRedact = SENSITIVE_KEYS.some((sensitiveKey) =>
          innerKey.toLowerCase().includes(sensitiveKey)
        );

        sanitized[innerKey] = shouldRedact ? '[REDACTED]' : redactValue(innerValue, innerKey);
        return sanitized;
      }, Array.isArray(value) ? [] : {});
    }

    return value;
  };

  return redactValue(meta);
};

const logger = createLogger({
  level: config.logLevel,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message, ...meta }) => {
          const sanitizedMeta = sanitizeMeta(meta);
          const metaString = Object.keys(sanitizedMeta).length ? ` ${JSON.stringify(sanitizedMeta)}` : '';
          return `${timestamp} [${level}]: ${message}${metaString}`;
        })
      )
    })
  ]
});

const requestLoggerMiddleware = (req, res, next) => {
  const startTime = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startTime) / 1e6;
    const { method, originalUrl } = req;
    const { statusCode } = res;

    logger.info(`${method} ${originalUrl} ${statusCode} ${durationMs.toFixed(2)}ms`, {
      method,
      url: originalUrl,
      statusCode,
      durationMs: Number(durationMs.toFixed(2))
    });
  });

  next();
};

module.exports = { logger, requestLoggerMiddleware };
