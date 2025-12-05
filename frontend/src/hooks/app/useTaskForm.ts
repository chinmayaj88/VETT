import { useState, useEffect, useCallback } from 'react';
import type { Task, CreateTaskInput } from '../../types/task';
import { TaskStatus, TaskPriority } from '../../types/task';

interface UseTaskFormParams {
  task?: Task | null;
  onSave: (input: CreateTaskInput) => void;
  onClose: () => void;
}

const defaultFormData: CreateTaskInput = {
  title: '',
  description: null,
  status: TaskStatus.TODO,
  priority: TaskPriority.MEDIUM,
  dueDate: null,
};

export function useTaskForm({ task, onSave, onClose }: UseTaskFormParams) {
  const [formData, setFormData] = useState<CreateTaskInput>(defaultFormData);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [task]);

  const handleSave = useCallback(() => {
    if (!formData.title.trim()) return;
    onSave(formData);
    onClose();
  }, [formData, onSave, onClose]);

  const updateField = useCallback(<K extends keyof CreateTaskInput>(
    field: K,
    value: CreateTaskInput[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  return {
    formData,
    updateField,
    handleSave,
  };
}

