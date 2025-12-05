import { useState, useCallback } from 'react';

export function useTaskFilters() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const clearFilters = useCallback(() => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
  }, []);

  return {
    search,
    statusFilter,
    priorityFilter,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    clearFilters,
  };
}

