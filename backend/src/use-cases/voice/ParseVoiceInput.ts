import { INLPService } from '../../domain/interfaces/INLPService';
import { CreateTaskInput, TaskStatus, TaskPriority } from '../../domain/entities/Task';
import { ParsedTaskData } from '../../domain/interfaces/INLPService';

export class ParseVoiceInput {
  constructor(private nlpService: INLPService) {}

  async execute(transcript: string): Promise<{
    transcript: string;
    parsed: CreateTaskInput;
  }> {
    if (!transcript || transcript.trim().length === 0) {
      throw new Error('Transcript cannot be empty');
    }

    const parsed = await this.nlpService.parseVoiceInput(transcript.trim());

    const taskInput: CreateTaskInput = {
      title: parsed.title,
      description: parsed.description || null,
      status: this.mapStatus(parsed.status),
      priority: this.mapPriority(parsed.priority),
      dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
    };

    return {
      transcript: transcript.trim(),
      parsed: taskInput,
    };
  }

  private mapStatus(status?: string): TaskStatus {
    if (!status) return TaskStatus.TODO;

    const upper = status.toUpperCase();
    if (upper === 'IN_PROGRESS' || upper === 'IN PROGRESS') {
      return TaskStatus.IN_PROGRESS;
    }
    if (upper === 'DONE' || upper === 'COMPLETE') {
      return TaskStatus.DONE;
    }
    return TaskStatus.TODO;
  }

  private mapPriority(priority?: string): TaskPriority {
    if (!priority) return TaskPriority.MEDIUM;

    const upper = priority.toUpperCase();
    if (upper === 'URGENT' || upper === 'CRITICAL') {
      return TaskPriority.URGENT;
    }
    if (upper === 'HIGH') {
      return TaskPriority.HIGH;
    }
    if (upper === 'LOW') {
      return TaskPriority.LOW;
    }
    return TaskPriority.MEDIUM;
  }
}

