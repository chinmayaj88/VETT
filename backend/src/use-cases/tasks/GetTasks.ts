import { ITaskRepository } from '../../domain/interfaces/ITaskRepository';
import { Task, TaskFilter } from '../../domain/entities/Task';

export interface GetTasksInput {
  filter?: TaskFilter;
  search?: string;
}

export class GetTasks {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(input: GetTasksInput = {}): Promise<Task[]> {
    if (input.search) {
      return await this.taskRepository.search(input.search);
    }

    if (input.filter) {
      return await this.taskRepository.filter(input.filter);
    }

    return await this.taskRepository.findAll();
  }
}

