import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { validate, validateQuery } from '../middleware/validator';
import { CreateTaskSchema, UpdateTaskSchema, GetTasksQuerySchema } from '../dto/TaskDTO';

export const createTaskRoutes = (taskController: TaskController) => {
  const router = Router();

  router.post('/', validate(CreateTaskSchema), (req, res) => taskController.create(req, res));
  router.get('/', validateQuery(GetTasksQuerySchema), (req, res) => taskController.getAll(req, res));
  router.get('/:id', (req, res) => taskController.getById(req, res));
  router.put('/:id', validate(UpdateTaskSchema), (req, res) => taskController.update(req, res));
  router.delete('/:id', (req, res) => taskController.delete(req, res));

  return router;
};

