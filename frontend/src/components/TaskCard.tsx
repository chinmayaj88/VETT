import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';
import { useTaskCard } from '../hooks/app/useTaskCard';

interface TaskCardProps {
  label: string;
  labelColor: string;
  title: string;
  description: string;
  dueDate?: string | null;
}

export default function TaskCard({
  label,
  labelColor,
  title,
  description,
  dueDate,
}: TaskCardProps) {
  const { dateInfo, formattedDate } = useTaskCard(dueDate);

  return (
    <Card className="cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 group bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="p-5">
        {/* Priority Badge */}
        <div className="mb-4 flex items-center justify-between">
          <Badge variant="outline" className={cn("border text-xs font-semibold", labelColor)}>
            {label}
          </Badge>
          {dateInfo && (
            <div className={cn("flex items-center gap-1.5 text-xs font-medium", dateInfo.className)}>
              <Clock className="h-3 w-3" />
              <span>{dateInfo.text}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-foreground mb-3 text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
          {description}
        </p>

        {/* Due Date (if available and not already shown) */}
        {dueDate && !dateInfo && formattedDate && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/50">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
