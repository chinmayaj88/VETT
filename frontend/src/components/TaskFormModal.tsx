import { useState } from 'react';
import { Save, Mic, Trash2 } from 'lucide-react';
import type { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';
import { TaskStatus, TaskPriority } from '../types/task';
import SpeechInput from './SpeechInput';
import { useTaskForm } from '../hooks/app/useTaskForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { DatePickerInput } from './ui/date-picker';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  onSave: (input: CreateTaskInput | UpdateTaskInput) => void;
  onDelete?: (taskId: string) => void;
}

export default function TaskFormModal({ isOpen, onClose, task, onSave, onDelete }: TaskFormModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { formData, updateField, handleSave: handleFormSave } = useTaskForm({
    task,
    isOpen,
    onSave,
    onClose,
  });

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            <DialogDescription>
              {task ? 'Update your task details below.' : 'Fill in the details to create a new task.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2 flex-wrap">
                <span>Title</span>
                <span className="text-destructive">*</span>
                <span className="text-xs font-normal text-muted-foreground flex items-center gap-1">
                  <Mic className="w-3 h-3" />
                  Click mic to speak
                </span>
              </Label>
              <div className="relative">
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Enter task title or speak it..."
                  className="pr-24"
                />
                <SpeechInput
                  value={formData.title}
                  onChange={(value) => updateField('title', value)}
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2 flex-wrap">
                <span>Description</span>
                <span className="text-xs font-normal text-muted-foreground flex items-center gap-1">
                  <Mic className="w-3 h-3" />
                  Click mic to speak
                </span>
              </Label>
              <div className="relative">
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => updateField('description', e.target.value || null)}
                  placeholder="Enter task description or speak it..."
                  rows={5}
                  className="pr-24 resize-none"
                />
                <SpeechInput
                  value={formData.description || ''}
                  onChange={(value) => updateField('description', value || null)}
                />
              </div>
            </div>

            {/* Priority and Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => updateField('priority', value as TaskPriority)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                    <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                    <SelectItem value={TaskPriority.URGENT}>Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => updateField('status', value as TaskStatus)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                    <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                    <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <DatePickerInput
                id="dueDate"
                value={formData.dueDate}
                onChange={(date) => updateField('dueDate', date)}
                placeholder="Select due date and time"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3">
            <div className="flex-1">
              {task && onDelete && (
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="destructive"
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Task
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={handleFormSave}
                disabled={!formData.title.trim()}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
              >
                <Save className="h-4 w-4" />
                {task ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{task?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowDeleteConfirm(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
