import { ITaskRepository } from '../../domain/interfaces/ITaskRepository';
import { Task, CreateTaskInput } from '../../domain/entities/Task';

export class CreateTask {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    if (!input.title || input.title.trim().length === 0) {
      throw new Error('Task title is required');
    }

    if (input.title.length > 500) {
      throw new Error('Task title must be less than 500 characters');
    }

    return await this.taskRepository.create({
      title: input.title.trim(),
      description: input.description?.trim() || null,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate,
    });
  }
}

