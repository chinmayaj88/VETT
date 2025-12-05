import { ITaskRepository } from '../../domain/interfaces/ITaskRepository';
import { Task, UpdateTaskInput } from '../../domain/entities/Task';

export class UpdateTask {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string, input: UpdateTaskInput): Promise<Task> {
    const existingTask = await this.taskRepository.findById(id);
    if (!existingTask) {
      throw new Error('Task not found');
    }

    if (input.title !== undefined) {
      if (!input.title || input.title.trim().length === 0) {
        throw new Error('Task title cannot be empty');
      }
      if (input.title.length > 500) {
        throw new Error('Task title must be less than 500 characters');
      }
    }

    return await this.taskRepository.update(id, {
      ...(input.title !== undefined && { title: input.title.trim() }),
      ...(input.description !== undefined && {
        description: input.description?.trim() || null,
      }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.priority !== undefined && { priority: input.priority }),
      ...(input.dueDate !== undefined && { dueDate: input.dueDate }),
    });
  }
}

