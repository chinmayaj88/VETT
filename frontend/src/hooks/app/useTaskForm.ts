import { useState, useEffect, useCallback, useRef } from 'react';
import type { Task, CreateTaskInput } from '../../types/task';
import { TaskStatus, TaskPriority } from '../../types/task';

interface UseTaskFormParams {
  task?: Task | null;
  isOpen?: boolean;
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

export function useTaskForm({ task, isOpen, onSave, onClose }: UseTaskFormParams) {
  const [formData, setFormData] = useState<CreateTaskInput>(defaultFormData);
  const previousTaskIdRef = useRef<string | null>(null);
  const previousIsOpenRef = useRef<boolean>(false);

  useEffect(() => {
    // Reset form when modal opens for a new task (task is null/undefined)
    if (isOpen && !previousIsOpenRef.current && !task) {
      setFormData(defaultFormData);
      previousTaskIdRef.current = null;
    }
    // Update form when task changes (for editing)
    else if (task) {
      const taskId = task.id;
      // Only update if it's a different task
      if (previousTaskIdRef.current !== taskId) {
        setFormData({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
        });
        previousTaskIdRef.current = taskId;
      }
    }
    // Reset when modal closes
    else if (!isOpen && previousIsOpenRef.current) {
      setFormData(defaultFormData);
      previousTaskIdRef.current = null;
    }

    previousIsOpenRef.current = isOpen ?? false;
  }, [task, isOpen]);

  const handleSave = useCallback(() => {
    if (!formData.title.trim()) return;
    onSave(formData);
    // Reset form after successful save
    setFormData(defaultFormData);
    previousTaskIdRef.current = null;
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

