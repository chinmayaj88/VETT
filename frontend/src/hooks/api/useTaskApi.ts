import { useCallback } from 'react';
import { api } from '../../lib/axios';
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
} from '../../types/task';

export function useTaskApi() {
  const getAll = useCallback(async (params?: {
    search?: string;
    status?: string;
    priority?: string;
  }): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks', { params });
    return response.data;
  }, []);

  const getById = useCallback(async (id: string): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  }, []);

  const create = useCallback(async (input: CreateTaskInput): Promise<Task> => {
    const response = await api.post<Task>('/tasks', input);
    return response.data;
  }, []);

  const update = useCallback(async (id: string, input: UpdateTaskInput): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, input);
    return response.data;
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  }, []);

  return {
    getAll,
    getById,
    create,
    update,
    delete: deleteTask,
  };
}

