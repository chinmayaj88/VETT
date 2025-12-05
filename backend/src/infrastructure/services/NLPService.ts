import { INLPService, ParsedTaskData } from '../../domain/interfaces/INLPService';
import { GoogleGenAI } from '@google/genai';

export class NLPService implements INLPService {
  private ai: GoogleGenAI;
  private readonly models = ['gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-pro'];

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async parseVoiceInput(transcript: string): Promise<ParsedTaskData> {
    if (!transcript?.trim()) {
      throw new Error('Transcript cannot be empty');
    }

    const prompt = this.buildPrompt(transcript);
    let lastError: Error | null = null;

    for (const model of this.models) {
      if (!model) continue;
      
      try {
        const response = await this.ai.models.generateContent({
          model,
          contents: prompt,
        });

        const text = response.text?.trim();
        if (!text) {
          throw new Error('Empty response from Gemini');
        }

        const parsed = this.extractAndParseJSON(text);
        return this.normalizeParsedResult(parsed, transcript);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        continue;
      }
    }

    throw new Error(`Failed to parse voice input: ${lastError?.message || 'All models failed'}`);
  }

  private buildPrompt(transcript: string): string {
    const currentYear = new Date().getFullYear();
    return `Extract structured task information from this input: "${transcript}"

Return a JSON object with:
- title: Main task name/description (required)
- description: Additional details (optional, null if not found)
- priority: LOW, MEDIUM, HIGH, or URGENT (default: MEDIUM)
- dueDate: ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ). Current year: ${currentYear}. Default time to 18:00 if only date given
- status: TODO, IN_PROGRESS, or DONE (default: TODO)

Extract all mentioned information. Return only valid JSON.`;
  }

  private extractAndParseJSON(text: string): {
    title?: string;
    description?: string | null;
    priority?: string;
    dueDate?: string | null;
    status?: string;
  } {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      throw new Error('Invalid JSON in response');
    }
  }

  private normalizeParsedResult(
    parsed: {
      title?: string;
      description?: string | null;
      priority?: string;
      dueDate?: string | null;
      status?: string;
    },
    transcript: string
  ): ParsedTaskData {
    return {
      title: parsed.title?.trim() || transcript.substring(0, 100).trim() || 'Untitled Task',
      description: parsed.description?.trim() || null,
      priority: parsed.priority?.toUpperCase() || 'MEDIUM',
      dueDate: parsed.dueDate || null,
      status: parsed.status?.toUpperCase() || 'TODO',
    };
  }
}
