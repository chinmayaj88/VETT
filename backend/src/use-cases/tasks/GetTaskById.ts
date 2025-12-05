import { ITaskRepository } from '../../domain/interfaces/ITaskRepository';
import { Task } from '../../domain/entities/Task';

export class GetTaskById {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }
}

