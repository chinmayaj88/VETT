import { Request, Response } from 'express';
import { ParseVoiceInput } from '../../use-cases/voice/ParseVoiceInput';
import { SpeechToTextService } from '../../infrastructure/services/SpeechToTextService';

export class VoiceController {
  constructor(
    private parseVoiceInput: ParseVoiceInput,
    private speechToText: SpeechToTextService
  ) {}

  async parse(req: Request, res: Response) {
    try {
      const { transcript } = req.body;

      // Validate transcript exists
      if (!transcript) {
        return res.status(400).json({ error: 'Transcript is required' });
      }

      // Validate transcript is a string
      if (typeof transcript !== 'string') {
        return res.status(400).json({ error: 'Transcript must be a string' });
      }

      // Validate transcript is not empty
      if (!transcript.trim()) {
        return res.status(400).json({ error: 'Transcript cannot be empty' });
      }

      // Validate transcript length (reasonable limit)
      if (transcript.length > 10000) {
        return res.status(400).json({ error: 'Transcript must be 10000 characters or less' });
      }

      const result = await this.parseVoiceInput.execute(transcript.trim());
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to parse transcript';
      res.status(500).json({ error: message });
    }
  }

  async transcribeAndParse(req: Request, res: Response) {
    try {
      // Validate file exists
      if (!req.file) {
        return res.status(400).json({ error: 'Audio file is required' });
      }

      // Validate file size (10MB limit)
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      if (req.file.size > MAX_FILE_SIZE) {
        return res.status(413).json({ error: 'Audio file is too large. Maximum size is 10MB' });
      }

      // Validate minimum file size (audio must have content)
      const MIN_FILE_SIZE = 1024; // 1KB minimum
      if (req.file.size < MIN_FILE_SIZE) {
        return res.status(400).json({ error: 'Audio file is too small. Please upload a valid audio file' });
      }

      // Validate file type
      const allowedMimeTypes = [
        'audio/webm',
        'audio/mp4',
        'audio/mpeg',
        'audio/wav',
        'audio/ogg',
        'audio/x-m4a',
        'audio/mp3',
      ];

      if (!req.file.mimetype || !allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          error: `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`,
        });
      }

      // Validate buffer exists
      if (!req.file.buffer || req.file.buffer.length === 0) {
        return res.status(400).json({ error: 'Audio file is empty or corrupted' });
      }

      const transcription = await this.speechToText.transcribeAudio(
        req.file.buffer,
        req.file.mimetype
      );

      // Validate transcription result
      if (!transcription || !transcription.transcript) {
        return res.status(500).json({ error: 'Failed to transcribe audio. Please try again.' });
      }

      const result = await this.parseVoiceInput.execute(transcription.transcript);

      res.json({
        transcript: transcription.transcript,
        parsed: result.parsed,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to process audio';
      res.status(500).json({ error: message });
    }
  }
}
