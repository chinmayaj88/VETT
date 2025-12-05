import { Request, Response } from 'express';
import { CreateTask } from '../../use-cases/tasks/CreateTask';
import { GetTasks } from '../../use-cases/tasks/GetTasks';
import { GetTaskById } from '../../use-cases/tasks/GetTaskById';
import { UpdateTask } from '../../use-cases/tasks/UpdateTask';
import { DeleteTask } from '../../use-cases/tasks/DeleteTask';
import { TaskStatus, TaskPriority } from '../../domain/entities/Task';

export class TaskController {
  constructor(
    private createTask: CreateTask,
    private getTasks: GetTasks,
    private getTaskById: GetTaskById,
    private updateTask: UpdateTask,
    private deleteTask: DeleteTask
  ) {}

  async create(req: Request, res: Response) {
    try {
      const { title, description, status, priority, dueDate } = req.body;

      // Validate required fields
      if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'Task title is required and cannot be empty' });
      }

      // Validate title length
      if (title.trim().length > 500) {
        return res.status(400).json({ error: 'Task title must be 500 characters or less' });
      }

      // Validate description length
      if (description && typeof description === 'string' && description.length > 5000) {
        return res.status(400).json({ error: 'Task description must be 5000 characters or less' });
      }

      // Validate status enum
      if (status && !Object.values(TaskStatus).includes(status as TaskStatus)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${Object.values(TaskStatus).join(', ')}` });
      }

      // Validate priority enum
      if (priority && !Object.values(TaskPriority).includes(priority as TaskPriority)) {
        return res.status(400).json({ error: `Invalid priority. Must be one of: ${Object.values(TaskPriority).join(', ')}` });
      }

      // Validate and parse date
      let parsedDueDate: Date | undefined;
      if (dueDate) {
        parsedDueDate = new Date(dueDate);
        if (isNaN(parsedDueDate.getTime())) {
          return res.status(400).json({ error: 'Invalid due date format' });
        }
      }

      const task = await this.createTask.execute({
        title: title.trim(),
        description: description?.trim() || null,
        status: status ? (status as TaskStatus) : undefined,
        priority: priority ? (priority as TaskPriority) : undefined,
        dueDate: parsedDueDate,
      });

      res.status(201).json(task);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create task';
      res.status(400).json({ error: message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const { search, status, priority, dueDateFrom, dueDateTo } = req.query;

      // Validate search parameter
      const searchStr = search && typeof search === 'string' ? search.trim() : undefined;
      if (searchStr && searchStr.length > 500) {
        return res.status(400).json({ error: 'Search query must be 500 characters or less' });
      }

      // Validate status enum
      if (status && !Object.values(TaskStatus).includes(status as TaskStatus)) {
        return res.status(400).json({ error: `Invalid status filter. Must be one of: ${Object.values(TaskStatus).join(', ')}` });
      }

      // Validate priority enum
      if (priority && !Object.values(TaskPriority).includes(priority as TaskPriority)) {
        return res.status(400).json({ error: `Invalid priority filter. Must be one of: ${Object.values(TaskPriority).join(', ')}` });
      }

      // Validate and parse dates
      let parsedDueDateFrom: Date | undefined;
      let parsedDueDateTo: Date | undefined;

      if (dueDateFrom) {
        parsedDueDateFrom = new Date(dueDateFrom as string);
        if (isNaN(parsedDueDateFrom.getTime())) {
          return res.status(400).json({ error: 'Invalid dueDateFrom format' });
        }
      }

      if (dueDateTo) {
        parsedDueDateTo = new Date(dueDateTo as string);
        if (isNaN(parsedDueDateTo.getTime())) {
          return res.status(400).json({ error: 'Invalid dueDateTo format' });
        }
      }

      // Validate date range
      if (parsedDueDateFrom && parsedDueDateTo && parsedDueDateFrom > parsedDueDateTo) {
        return res.status(400).json({ error: 'dueDateFrom must be before or equal to dueDateTo' });
      }

      const tasks = await this.getTasks.execute({
        search: searchStr,
        filter: {
          ...(status && { status: status as TaskStatus }),
          ...(priority && { priority: priority as TaskPriority }),
          ...(parsedDueDateFrom && { dueDateFrom: parsedDueDateFrom }),
          ...(parsedDueDateTo && { dueDateTo: parsedDueDateTo }),
        },
      });

      res.json(tasks || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch tasks';
      res.status(500).json({ error: message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Validate ID exists
      if (!id || !id.trim()) {
        return res.status(400).json({ error: 'Task ID is required' });
      }

      // Validate ID format (UUID or valid string)
      if (id.trim().length > 100) {
        return res.status(400).json({ error: 'Invalid task ID format' });
      }

      const task = await this.getTaskById.execute(id.trim());
      res.json(task);
    } catch (error) {
      if (error instanceof Error && error.message === 'Task not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to fetch task' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, status, priority, dueDate } = req.body;

      // Validate ID exists
      if (!id || !id.trim()) {
        return res.status(400).json({ error: 'Task ID is required' });
      }

      // Validate at least one field to update
      if (title === undefined && description === undefined && status === undefined && 
          priority === undefined && dueDate === undefined) {
        return res.status(400).json({ error: 'At least one field must be provided for update' });
      }

      // Validate title if provided
      if (title !== undefined) {
        if (typeof title !== 'string') {
          return res.status(400).json({ error: 'Title must be a string' });
        }
        if (!title.trim()) {
          return res.status(400).json({ error: 'Task title cannot be empty' });
        }
        if (title.trim().length > 500) {
          return res.status(400).json({ error: 'Task title must be 500 characters or less' });
        }
      }

      // Validate description if provided
      if (description !== undefined) {
        if (description !== null && typeof description !== 'string') {
          return res.status(400).json({ error: 'Description must be a string or null' });
        }
        if (description && description.length > 5000) {
          return res.status(400).json({ error: 'Task description must be 5000 characters or less' });
        }
      }

      // Validate status enum if provided
      if (status !== undefined && !Object.values(TaskStatus).includes(status as TaskStatus)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${Object.values(TaskStatus).join(', ')}` });
      }

      // Validate priority enum if provided
      if (priority !== undefined && !Object.values(TaskPriority).includes(priority as TaskPriority)) {
        return res.status(400).json({ error: `Invalid priority. Must be one of: ${Object.values(TaskPriority).join(', ')}` });
      }

      // Validate and parse date if provided
      let parsedDueDate: Date | null | undefined;
      if (dueDate !== undefined) {
        if (dueDate === null) {
          parsedDueDate = null;
        } else {
          parsedDueDate = new Date(dueDate);
          if (isNaN(parsedDueDate.getTime())) {
            return res.status(400).json({ error: 'Invalid due date format' });
          }
        }
      }

      const task = await this.updateTask.execute(id.trim(), {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(status !== undefined && { status: status as TaskStatus }),
        ...(priority !== undefined && { priority: priority as TaskPriority }),
        ...(dueDate !== undefined && { dueDate: parsedDueDate }),
      });

      res.json(task);
    } catch (error) {
      if (error instanceof Error && error.message === 'Task not found') {
        return res.status(404).json({ error: error.message });
      }
      const message = error instanceof Error ? error.message : 'Failed to update task';
      res.status(400).json({ error: message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Validate ID exists
      if (!id || !id.trim()) {
        return res.status(400).json({ error: 'Task ID is required' });
      }

      // Validate ID format
      if (id.trim().length > 100) {
        return res.status(400).json({ error: 'Invalid task ID format' });
      }

      await this.deleteTask.execute(id.trim());
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Task not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to delete task' });
    }
  }
}
