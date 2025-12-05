import { useState, useEffect, useCallback } from 'react';
import { useTaskApi } from '../api/useTaskApi';
import type { Task, CreateTaskInput, UpdateTaskInput } from '../../types/task';

interface UseTasksParams {
  search?: string;
  statusFilter?: string;
  priorityFilter?: string;
}

export function useTasks({ search, statusFilter, priorityFilter }: UseTasksParams) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAll, create: createApi, update: updateApi, delete: deleteApi } = useTaskApi();

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params: { search?: string; status?: string; priority?: string } = {};
      if (search?.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const fetchedTasks = await getAll(params);
      
      // Validate response is an array
      if (!Array.isArray(fetchedTasks)) {
        throw new Error('Invalid response format from server');
      }
      
      setTasks(fetchedTasks || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(message);
      // Set empty array on error to prevent UI breaking
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, priorityFilter, getAll]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(async (input: CreateTaskInput): Promise<void> => {
    // Validate input
    if (!input.title || !input.title.trim()) {
      const error = new Error('Task title is required');
      setError(error.message);
      throw error;
    }

    if (input.title.length > 500) {
      const error = new Error('Task title must be 500 characters or less');
      setError(error.message);
      throw error;
    }

    if (input.description && input.description.length > 5000) {
      const error = new Error('Task description must be 5000 characters or less');
      setError(error.message);
      throw error;
    }

    try {
      await createApi(input);
      await fetchTasks();
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      setError(message);
      throw err;
    }
  }, [createApi, fetchTasks]);

  const updateTask = useCallback(async (id: string, input: UpdateTaskInput): Promise<void> => {
    // Validate ID
    if (!id || !id.trim()) {
      const error = new Error('Task ID is required');
      setError(error.message);
      throw error;
    }

    // Validate input
    if (input.title !== undefined) {
      if (!input.title.trim()) {
        const error = new Error('Task title cannot be empty');
        setError(error.message);
        throw error;
      }
      if (input.title.length > 500) {
        const error = new Error('Task title must be 500 characters or less');
        setError(error.message);
        throw error;
      }
    }

    if (input.description !== undefined && input.description && input.description.length > 5000) {
      const error = new Error('Task description must be 5000 characters or less');
      setError(error.message);
      throw error;
    }

    try {
      await updateApi(id, input);
      await fetchTasks();
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      setError(message);
      throw err;
    }
  }, [updateApi, fetchTasks]);

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    // Validate ID
    if (!id || !id.trim()) {
      const error = new Error('Task ID is required');
      setError(error.message);
      throw error;
    }

    try {
      await deleteApi(id);
      await fetchTasks();
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      setError(message);
      throw err;
    }
  }, [deleteApi, fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
}

