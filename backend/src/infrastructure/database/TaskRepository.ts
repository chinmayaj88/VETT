import { ITaskRepository } from '../../domain/interfaces/ITaskRepository';
import { Task, CreateTaskInput, UpdateTaskInput, TaskFilter, TaskStatus, TaskPriority } from '../../domain/entities/Task';
import prisma from '../config/database';

export class TaskRepository implements ITaskRepository {
  async create(input: CreateTaskInput): Promise<Task> {
    const task = await prisma.task.create({
      data: {
        title: input.title,
        description: input.description ?? null,
        status: input.status ?? TaskStatus.TODO,
        priority: input.priority ?? TaskPriority.MEDIUM,
        dueDate: input.dueDate ?? null,
      },
    });

    return this.mapToDomain(task);
  }

  async findById(id: string): Promise<Task | null> {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    return task ? this.mapToDomain(task) : null;
  }

  async findAll(): Promise<Task[]> {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return tasks.map((task) => this.mapToDomain(task));
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.priority !== undefined && { priority: input.priority }),
        ...(input.dueDate !== undefined && { dueDate: input.dueDate }),
      },
    });

    return this.mapToDomain(task);
  }

  async delete(id: string): Promise<void> {
    await prisma.task.delete({
      where: { id },
    });
  }

  async filter(filters: TaskFilter): Promise<Task[]> {
    const where: {
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: { gte?: Date; lte?: Date };
    } = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.priority) {
      where.priority = filters.priority;
    }

    if (filters.dueDateFrom || filters.dueDateTo) {
      where.dueDate = {};
      if (filters.dueDateFrom) {
        where.dueDate.gte = filters.dueDateFrom;
      }
      if (filters.dueDateTo) {
        where.dueDate.lte = filters.dueDateTo;
      }
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return tasks.map((task) => this.mapToDomain(task));
  }

  async search(query: string): Promise<Task[]> {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return tasks.map((task) => this.mapToDomain(task));
  }

  private mapToDomain(task: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Task {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status as TaskStatus,
      priority: task.priority as TaskPriority,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}

