import { HttpError } from '../utils/httpError.js';

export const errorHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const payload = {
    message: err.message || 'Internal Server Error',
  };

  if (err.details) {
    payload.details = err.details;
  }

  res.status(statusCode).json(payload);
};
