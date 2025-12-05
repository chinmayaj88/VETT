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
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    const todayISO = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;
    
    return `Extract structured task information from this input: "${transcript}"

IMPORTANT DATE RULES:
- Today is ${todayISO} (${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')})
- "today" = ${todayISO}T18:00:00.000Z
- "tomorrow" = next day at 18:00:00.000Z
- "yesterday" or any past date = DO NOT include dueDate (set to null)
- Relative dates like "next week", "in 3 days" = calculate from today
- Only include dueDate if it's today or a future date

DESCRIPTION EXTRACTION RULES:
- ALWAYS extract description from the transcript if there's any additional context beyond the main task title
- If the transcript contains multiple sentences or clauses, use the extra information as description
- If the transcript mentions details, context, reasons, or explanations, include them in description
- Only set description to null if the transcript is just a simple task name with no additional information
- Examples:
  * "Review the pull request" → title: "Review the pull request", description: null
  * "Review the pull request, it's about authentication" → title: "Review the pull request", description: "it's about authentication"
  * "Fix the login bug because users can't sign in" → title: "Fix the login bug", description: "users can't sign in"
  * "Call John tomorrow about the project" → title: "Call John", description: "about the project", dueDate: tomorrow

Return a JSON object with:
- title: Main task name (required, keep it concise - 1-10 words)
- description: Additional details, context, or explanations from the transcript (extract aggressively, null only if truly no additional info)
- priority: LOW, MEDIUM, HIGH, or URGENT (default: MEDIUM)
- dueDate: ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) ONLY if date is today or future. Set to null for past dates.
- status: TODO, IN_PROGRESS, or DONE (default: TODO)

Extract all mentioned information. Be thorough with description extraction. Return only valid JSON.`;
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
    const title = parsed.title?.trim() || transcript.substring(0, 100).trim() || 'Untitled Task';
    
    let description = parsed.description?.trim() || null;
    
    if (!description && transcript.trim().length > title.length + 10) {
      const transcriptLower = transcript.toLowerCase();
      const titleLower = title.toLowerCase();
      
      if (transcriptLower.includes(titleLower)) {
        const titleIndex = transcriptLower.indexOf(titleLower);
        const afterTitle = transcript.substring(titleIndex + title.length).trim();
        
        if (afterTitle.length > 0) {
          const cleaned = afterTitle
            .replace(/^(,|and|or|but|because|for|to|by|with|about|on|at|in|the|a|an)\s+/i, '')
            .trim();
          
          if (cleaned.length > 5 && cleaned.length < 5000) {
            description = cleaned;
          }
        }
      } else if (transcript.length > 50) {
        const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length > 1) {
          const firstSentence = sentences[0].trim();
          const remainingText = sentences.slice(1).join('. ').trim();
          if (remainingText.length > 5 && remainingText.length < 5000) {
            description = remainingText;
          }
        }
      }
    }
    
    return {
      title,
      description: description || null,
      priority: parsed.priority?.toUpperCase() || 'MEDIUM',
      dueDate: parsed.dueDate || null,
      status: parsed.status?.toUpperCase() || 'TODO',
    };
  }
}
