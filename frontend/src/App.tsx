import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Mic, Sparkles } from 'lucide-react';
import TaskCard from './components/TaskCard';
import FilterBar from './components/FilterBar';
import TaskFormModal from './components/TaskFormModal';
import VoiceToTaskModal from './components/VoiceToTaskModal';
import type { Task, CreateTaskInput, UpdateTaskInput } from './types/task';
import { TaskStatus } from './types/task';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { useTasks } from './hooks/app/useTasks';
import { useTaskFilters } from './hooks/app/useTaskFilters';
import { usePriorityLabel } from './hooks/app/usePriorityLabel';

function TaskCardWrapper({ task, onClick }: { task: Task; onClick: () => void }) {
  const priority = usePriorityLabel(task.priority);
  return (
    <div onClick={onClick}>
      <TaskCard
        label={priority.label}
        labelColor={priority.color}
        title={task.title}
        description={task.description || 'No description'}
        dueDate={task.dueDate}
      />
    </div>
  );
}

export default function App() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isVoiceToTaskOpen, setIsVoiceToTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filters = useTaskFilters();
  const { tasks, isLoading, error, createTask, updateTask, deleteTask } = useTasks({
    search: filters.search,
    statusFilter: filters.statusFilter,
    priorityFilter: filters.priorityFilter,
  });

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleCreateTask = useCallback(async (input: CreateTaskInput) => {
    try {
      await createTask(input);
      setIsTaskFormOpen(false);
    } catch {
      // Error is handled by useTasks hook
    }
  }, [createTask]);

  const handleVoiceToTask = useCallback(async (input: CreateTaskInput) => {
    try {
      await createTask(input);
      setIsVoiceToTaskOpen(false);
    } catch {
      // Error is handled by useTasks hook
    }
  }, [createTask]);

  const handleUpdateTask = useCallback(async (input: UpdateTaskInput) => {
    if (!selectedTask) return;
    try {
      await updateTask(selectedTask.id, input);
      setIsTaskFormOpen(false);
      setSelectedTask(null);
    } catch {
      // Error is handled by useTasks hook
    }
  }, [selectedTask, updateTask]);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setSelectedTask(null);
    } catch {
      // Error is handled by useTasks hook
    }
  }, [deleteTask]);

  const handleCloseTaskForm = useCallback(() => {
    setIsTaskFormOpen(false);
    setSelectedTask(null);
  }, []);

  const handleCloseVoiceModal = useCallback(() => {
    setIsVoiceToTaskOpen(false);
  }, []);

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsTaskFormOpen(true);
  }, []);

  const todoTasks = useMemo(
    () => tasks.filter((task) => task.status === TaskStatus.TODO),
    [tasks]
  );
  const inProgressTasks = useMemo(
    () => tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS),
    [tasks]
  );
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === TaskStatus.DONE),
    [tasks]
  );

  const renderColumn = (
    title: string,
    count: number,
    tasks: Task[],
    gradient: string,
    borderColor: string,
    spinnerColor: string
  ) => (
    <div className="flex-shrink-0 w-full sm:w-80 md:w-96">
      <Card className="overflow-hidden border-border/50 bg-card/60">
        <div className={`${gradient} px-5 py-4 flex items-center gap-3 border-b ${borderColor}`}>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="font-bold text-base text-white">
            {count} {title}
          </span>
        </div>
        <div className="p-4 md:p-5 space-y-4 min-h-[600px] bg-card/30">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className={`w-8 h-8 border-2 ${spinnerColor} border-t-transparent rounded-full animate-spin mb-3`}></div>
              <p className="text-sm text-muted-foreground">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No tasks yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Create your first task</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCardWrapper key={task.id} task={task} onClick={() => handleTaskClick(task)} />
            ))
          )}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Vett
              </h1>
              <p className="text-xs text-muted-foreground">Voice-Enabled Task Tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsVoiceToTaskOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
            >
              <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Voice to Task</span>
              <span className="sm:hidden">Voice</span>
            </Button>
            <Button
              onClick={() => {
                setSelectedTask(null);
                setIsTaskFormOpen(true);
              }}
              variant="secondary"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Create Task</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <FilterBar
            search={filters.search}
            status={filters.statusFilter}
            priority={filters.priorityFilter}
            onSearchChange={filters.setSearch}
            onStatusChange={filters.setStatusFilter}
            onPriorityChange={filters.setPriorityFilter}
            onClear={filters.clearFilters}
          />
        </div>

        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {renderColumn('To Do', todoTasks.length, todoTasks, 'bg-gradient-to-br from-purple-600/90 to-indigo-600/90', 'border-purple-500/20', 'border-purple-500')}
          {renderColumn('In Progress', inProgressTasks.length, inProgressTasks, 'bg-gradient-to-br from-orange-600/90 to-amber-600/90', 'border-orange-500/20', 'border-orange-500')}
          {renderColumn('Completed', completedTasks.length, completedTasks, 'bg-gradient-to-br from-green-600/90 to-emerald-600/90', 'border-green-500/20', 'border-green-500')}
        </div>
      </main>

      <TaskFormModal
        isOpen={isTaskFormOpen}
        onClose={handleCloseTaskForm}
        task={selectedTask}
        onSave={
          selectedTask
            ? (input: CreateTaskInput | UpdateTaskInput) => handleUpdateTask(input as UpdateTaskInput)
            : (input: CreateTaskInput | UpdateTaskInput) => handleCreateTask(input as CreateTaskInput)
        }
        onDelete={handleDeleteTask}
      />

      <VoiceToTaskModal isOpen={isVoiceToTaskOpen} onClose={handleCloseVoiceModal} onConfirm={handleVoiceToTask} />
    </div>
  );
}
