import { HttpError } from '../utils/httpError.js';

const formatIssues = (issues) =>
  issues.map(({ path, message }) => ({
    path: path.join('.'),
    message,
  }));

export const validateBody = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body ?? {});
  if (!result.success) {
    return next(new HttpError(400, 'Invalid request body', formatIssues(result.error.issues)));
  }

  req.validatedBody = result.data;
  return next();
};

export const validateParams = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.params ?? {});
  if (!result.success) {
    return next(new HttpError(400, 'Invalid route parameters', formatIssues(result.error.issues)));
  }

  req.validatedParams = result.data;
  return next();
};
