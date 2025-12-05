import { createClient } from '@deepgram/sdk';
import { Readable } from 'stream';

export interface SpeechToTextResult {
  transcript: string;
  confidence?: number;
}

export interface ISpeechToTextService {
  transcribeAudio(audioBuffer: Buffer, mimeType: string): Promise<SpeechToTextResult>;
}

export class SpeechToTextService implements ISpeechToTextService {
  private readonly deepgram: ReturnType<typeof createClient>;
  private readonly maxRetries = 2;
  private readonly retryDelay = 1000;

  constructor() {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      throw new Error('DEEPGRAM_API_KEY is not set');
    }
    this.deepgram = createClient(apiKey);
  }

  async transcribeAudio(audioBuffer: Buffer, mimeType: string): Promise<SpeechToTextResult> {
    const audioStream = Readable.from(audioBuffer);

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const { result, error } = await this.deepgram.listen.prerecorded.transcribeFile(
          audioStream,
          {
            model: 'nova-2',
            language: 'en-US',
            smart_format: true,
            punctuate: true,
          }
        );

        if (error) {
          throw new Error(`Deepgram API error: ${error.message || 'Unknown error'}`);
        }

        if (!result?.results?.channels?.[0]?.alternatives?.[0]) {
          throw new Error('No transcription results');
        }

        const transcript = result.results.channels[0].alternatives[0].transcript?.trim() || '';
        const confidence = result.results.channels[0].alternatives[0].confidence;

        if (!transcript) {
          throw new Error('Empty transcript');
        }

        return { transcript, confidence };
      } catch (error) {
        if (attempt === this.maxRetries) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          throw new Error(`Transcription failed: ${message}`);
        }
        await this.delay(this.retryDelay * (attempt + 1));
        audioStream.destroy();
        audioStream.push(audioBuffer);
      }
    }

    throw new Error('Transcription failed after retries');
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
