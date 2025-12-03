import {
  createTaskHandler,
  deleteTaskHandler,
  getTaskHandler,
  getTasksHandler,
  updateTaskHandler,
} from '../controllers/taskController.js';
import { validateBody, validateParams } from '../middleware/validationMiddleware.js';
import { z } from '../validation/zodLite.js';

const taskCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'done']).optional(),
});

const taskUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'done']).optional(),
});

const taskIdSchema = z.object({
  id: z.string().min(1, 'Task id is required'),
});

export const registerTaskRoutes = (router) => {
  router.post('/tasks', validateBody(taskCreateSchema), createTaskHandler);
  router.get('/tasks', getTasksHandler);
  router.get('/tasks/:id', validateParams(taskIdSchema), getTaskHandler);
  router.patch('/tasks/:id', validateParams(taskIdSchema), validateBody(taskUpdateSchema), updateTaskHandler);
  router.delete('/tasks/:id', validateParams(taskIdSchema), deleteTaskHandler);
};

export { taskCreateSchema, taskUpdateSchema, taskIdSchema };
