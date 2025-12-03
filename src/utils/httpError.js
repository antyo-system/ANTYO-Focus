export class HttpError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    if (details) {
      this.details = details;
    }
  }
}

export const buildNotFoundError = (entity, identifier = '') => {
  const label = identifier ? `${entity} with id ${identifier}` : entity;
  return new HttpError(404, `${label} not found`);
};
