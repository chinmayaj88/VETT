import { Search, X } from 'lucide-react';
import { TaskStatus, TaskPriority } from '../types/task';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';

interface FilterBarProps {
  search: string;
  status: string;
  priority: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onClear: () => void;
}

export default function FilterBar({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onClear,
}: FilterBarProps) {
  const hasFilters = search || status || priority;

  return (
    <Card className="p-4 md:p-5 bg-card/80 backdrop-blur-sm border-border/50">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title or description..."
            className="pl-10"
          />
        </div>

        <Select 
          value={status || undefined} 
          onValueChange={(value) => onStatusChange(value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
            <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
            <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={priority || undefined} 
          onValueChange={(value) => onPriorityChange(value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
            <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
            <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
            <SelectItem value={TaskPriority.URGENT}>Urgent</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            onClick={onClear}
            variant="outline"
            className="w-full md:w-auto"
          >
            <X className="h-4 w-4" />
            <span>Clear</span>
          </Button>
        )}
      </div>
    </Card>
  );
}
