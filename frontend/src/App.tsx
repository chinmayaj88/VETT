import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Mic, Sparkles, GripVertical } from 'lucide-react';
import { DndContext, DragOverlay, closestCenter, useDraggable, useDroppable } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
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
import { getPriorityLabel } from './lib/priorityUtils';

interface DraggableTaskCardProps {
  task: Task;
  onClick: () => void;
}

function DraggableTaskCard({ task, onClick }: DraggableTaskCardProps) {
  const priority = usePriorityLabel(task.priority);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        {...listeners}
        {...attributes}
        className="absolute right-2 top-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 hover:scale-110"
        aria-label="Drag to move task"
        title="Drag to move task"
      >
        <GripVertical className="h-5 w-5 text-white drop-shadow-lg" />
      </div>
      <div onClick={onClick} className="cursor-pointer">
        <TaskCard
          label={priority.label}
          labelColor={priority.color}
          title={task.title}
          description={task.description || 'No description'}
          dueDate={task.dueDate}
        />
      </div>
    </div>
  );
}

interface DroppableColumnProps {
  id: TaskStatus;
  title: string;
  count: number;
  tasks: Task[];
  gradient: string;
  borderColor: string;
  spinnerColor: string;
  isLoading: boolean;
  onTaskClick: (task: Task) => void;
}

function DroppableColumn({
  id,
  title,
  count,
  tasks,
  gradient,
  borderColor,
  spinnerColor,
  isLoading,
  onTaskClick,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} className="shrink-0 w-full min-w-[280px] sm:w-80 md:w-96 lg:w-[400px] snap-start">
      <Card className={`overflow-hidden border-border/50 bg-card/60 transition-all ${isOver ? 'ring-2 ring-primary ring-offset-2 bg-card/80' : ''}`}>
        <div className={`${gradient} px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 border-b ${borderColor}`}>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="font-bold text-sm sm:text-base text-white">
            {count} {title}
          </span>
        </div>
        <div className="p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4 min-h-[400px] sm:min-h-[500px] md:min-h-[600px] bg-card/30">
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
              <DraggableTaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

export default function App() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isVoiceToTaskOpen, setIsVoiceToTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

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

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  }, [tasks]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    // Find the task being dragged
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Don't update if status hasn't changed
    if (task.status === newStatus) return;

    // Validate the new status is a valid column
    const validStatuses = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];
    if (!validStatuses.includes(newStatus)) return;

    try {
      await updateTask(taskId, { status: newStatus });
    } catch (error) {
      // Error is handled by useTasks hook
      console.error('Failed to update task status:', error);
    }
  }, [tasks, updateTask]);

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

  const activeTaskPriority = activeTask ? getPriorityLabel(activeTask.priority) : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-card/80 backdrop-blur supports-backdrop-filter:bg-card/60">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600">
              <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Vett
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Voice-Enabled Task Tracker</p>
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

      <main className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
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

        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            <DroppableColumn
              id={TaskStatus.TODO}
              title="To Do"
              count={todoTasks.length}
              tasks={todoTasks}
              gradient="bg-gradient-to-br from-purple-600/90 to-indigo-600/90"
              borderColor="border-purple-500/20"
              spinnerColor="border-purple-500"
              isLoading={isLoading}
              onTaskClick={handleTaskClick}
            />
            <DroppableColumn
              id={TaskStatus.IN_PROGRESS}
              title="In Progress"
              count={inProgressTasks.length}
              tasks={inProgressTasks}
              gradient="bg-gradient-to-br from-orange-600/90 to-amber-600/90"
              borderColor="border-orange-500/20"
              spinnerColor="border-orange-500"
              isLoading={isLoading}
              onTaskClick={handleTaskClick}
            />
            <DroppableColumn
              id={TaskStatus.DONE}
              title="Completed"
              count={completedTasks.length}
              tasks={completedTasks}
              gradient="bg-gradient-to-br from-green-600/90 to-emerald-600/90"
              borderColor="border-green-500/20"
              spinnerColor="border-green-500"
              isLoading={isLoading}
              onTaskClick={handleTaskClick}
            />
          </div>
          <DragOverlay>
            {activeTask && activeTaskPriority ? (
              <div className="opacity-90 rotate-2 scale-105">
                <TaskCard
                  label={activeTaskPriority.label}
                  labelColor={activeTaskPriority.color}
                  title={activeTask.title}
                  description={activeTask.description || 'No description'}
                  dueDate={activeTask.dueDate}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
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
