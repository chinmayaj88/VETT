export interface ParsedTaskData {
  title: string;
  description?: string | null;
  priority?: string;
  dueDate?: string | null;
  status?: string;
}

export interface INLPService {
  parseVoiceInput(transcript: string): Promise<ParsedTaskData>;
}

