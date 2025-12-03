import { errorHandler } from './middleware/errorHandler.js';
import { registerTaskRoutes } from './routes/taskRoutes.js';
import { HttpError } from './utils/httpError.js';

class ResponseMock {
  constructor() {
    this.statusCode = 200;
    this.body = null;
    this.headersSent = false;
  }

  status(code) {
    this.statusCode = code;
    return this;
  }

  json(payload) {
    this.body = payload;
    this.headersSent = true;
    return this;
  }
}

const matchRoute = (pattern, path) => {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    return null;
  }

  const params = {};

  for (let i = 0; i < patternParts.length; i += 1) {
    const part = patternParts[i];
    const pathPart = pathParts[i];
    if (part.startsWith(':')) {
      params[part.slice(1)] = pathPart;
    } else if (part !== pathPart) {
      return null;
    }
  }

  return params;
};

class MiniApp {
  constructor() {
    this.routes = [];
    this.middlewares = [];
    this.errorMiddlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  useError(middleware) {
    this.errorMiddlewares.push(middleware);
  }

  register(method, path, ...handlers) {
    this.routes.push({ method, path, handlers });
  }

  post(path, ...handlers) {
    this.register('POST', path, ...handlers);
  }

  get(path, ...handlers) {
    this.register('GET', path, ...handlers);
  }

  patch(path, ...handlers) {
    this.register('PATCH', path, ...handlers);
  }

  delete(path, ...handlers) {
    this.register('DELETE', path, ...handlers);
  }

  async handle(request) {
    const { method, path, body } = request;
    const res = new ResponseMock();
    const routeMatch = this.routes.find((route) =>
      route.method === method && matchRoute(route.path, path)
    );

    const params = routeMatch ? matchRoute(routeMatch.path, path) : {};
    const req = { ...request, params: params || {}, body: body ?? {} };

    const callErrorHandlers = async (error) => {
      if (this.errorMiddlewares.length === 0) {
        res.status(error.statusCode || 500).json({ message: error.message });
        return;
      }

      let index = 0;
      const nextError = async (err) => {
        const handler = this.errorMiddlewares[index];
        index += 1;
        if (!handler) {
          res.status(err.statusCode || 500).json({ message: err.message });
          return;
        }
        try {
          await handler(err, req, res, nextError);
        } catch (handlerError) {
          await nextError(handlerError);
        }
      };

      await nextError(error);
    };

    if (!routeMatch) {
      await callErrorHandlers(new HttpError(404, 'Not Found'));
      return res;
    }

    const stack = [...this.middlewares, ...routeMatch.handlers];
    let index = 0;

    const next = async (err) => {
      if (err) {
        await callErrorHandlers(err);
        return;
      }

      const handler = stack[index];
      index += 1;

      if (!handler) {
        return;
      }

      try {
        await handler(req, res, next);
      } catch (error) {
        await callErrorHandlers(error);
      }
    };

    await next();
    return res;
  }
}

export const createApp = () => {
  const app = new MiniApp();
  registerTaskRoutes(app);
  app.useError(errorHandler);
  return app;
};

export { MiniApp };
