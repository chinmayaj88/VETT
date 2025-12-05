import { ITaskRepository } from '../../domain/interfaces/ITaskRepository';

export class DeleteTask {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<void> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }

    await this.taskRepository.delete(id);
  }
}

