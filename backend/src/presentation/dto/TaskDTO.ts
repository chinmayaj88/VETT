import { z } from 'zod';
import { TaskStatus, TaskPriority } from '../../domain/entities/Task';

export const CreateTaskSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(2000).optional().nullable(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDate: z.union([z.string().datetime(), z.date()]).optional().nullable(),
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(2000).optional().nullable(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDate: z.union([z.string().datetime(), z.date()]).optional().nullable(),
});

export const ParseVoiceInputSchema = z.object({
  transcript: z.string().min(1),
});

export const TaskFilterSchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDateFrom: z.union([z.string().datetime(), z.date()]).optional(),
  dueDateTo: z.union([z.string().datetime(), z.date()]).optional(),
});

export const GetTasksQuerySchema = z.object({
  search: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDateFrom: z.union([z.string().datetime(), z.date()]).optional(),
  dueDateTo: z.union([z.string().datetime(), z.date()]).optional(),
});

export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof UpdateTaskSchema>;
export type ParseVoiceInputDTO = z.infer<typeof ParseVoiceInputSchema>;
export type TaskFilterDTO = z.infer<typeof TaskFilterSchema>;

