import { useMemo } from 'react';

export function useTaskCard(dueDate?: string | null) {
  const dateInfo = useMemo(() => {
    if (!dueDate) return null;
    try {
      const date = new Date(dueDate);
      
      // Validate date is not invalid
      if (isNaN(date.getTime())) {
        return null;
      }
      
      const now = new Date();
      const diffTime = date.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        return { text: 'Overdue', className: 'text-red-400' };
      } else if (diffDays === 0) {
        return { text: 'Today', className: 'text-orange-400' };
      } else if (diffDays === 1) {
        return { text: 'Tomorrow', className: 'text-yellow-400' };
      } else if (diffDays <= 7) {
        return { text: `In ${diffDays} days`, className: 'text-blue-400' };
      } else {
        try {
          return { 
            text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            className: 'text-muted-foreground'
          };
        } catch {
          return null;
        }
      }
    } catch {
      return null;
    }
  }, [dueDate]);

  const formattedDate = useMemo(() => {
    if (!dueDate) return null;
    try {
      const date = new Date(dueDate);
      
      // Validate date is not invalid
      if (isNaN(date.getTime())) {
        return null;
      }
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return null;
    }
  }, [dueDate]);

  return {
    dateInfo,
    formattedDate,
  };
}

