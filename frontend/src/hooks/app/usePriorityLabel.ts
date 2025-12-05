import { useMemo } from 'react';
import { TaskPriority } from '../../types/task';

export function usePriorityLabel(priority: TaskPriority) {
  return useMemo(() => {
    switch (priority) {
      case TaskPriority.URGENT:
        return { label: 'Urgent', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
      case TaskPriority.HIGH:
        return { label: 'High', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
      case TaskPriority.MEDIUM:
        return { label: 'Medium', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
      case TaskPriority.LOW:
        return { label: 'Low', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      default:
        return { label: 'Medium', color: 'bg-muted text-muted-foreground' };
    }
  }, [priority]);
}

