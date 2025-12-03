import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../services/taskService.js';

export const createTaskHandler = (req, res, next) => {
  try {
    const task = createTask(req.validatedBody);
    return res.status(201).json(task);
  } catch (error) {
    return next(error);
  }
};

export const getTasksHandler = (_req, res, next) => {
  try {
    const tasks = getAllTasks();
    return res.status(200).json(tasks);
  } catch (error) {
    return next(error);
  }
};

export const getTaskHandler = (req, res, next) => {
  try {
    const task = getTaskById(req.validatedParams.id);
    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
};

export const updateTaskHandler = (req, res, next) => {
  try {
    const task = updateTask(req.validatedParams.id, req.validatedBody);
    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
};

export const deleteTaskHandler = (req, res, next) => {
  try {
    deleteTask(req.validatedParams.id);
    return res.status(204).json({ message: 'Task deleted' });
  } catch (error) {
    return next(error);
  }
};
