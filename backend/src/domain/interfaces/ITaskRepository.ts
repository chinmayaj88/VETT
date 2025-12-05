import { Task, CreateTaskInput, UpdateTaskInput, TaskFilter } from '../entities/Task';

export interface ITaskRepository {
  create(input: CreateTaskInput): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findAll(): Promise<Task[]>;
  update(id: string, input: UpdateTaskInput): Promise<Task>;
  delete(id: string): Promise<void>;
  filter(filters: TaskFilter): Promise<Task[]>;
  search(query: string): Promise<Task[]>;
}

