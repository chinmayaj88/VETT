import { Request, Response } from 'express';
import { ParseVoiceInput } from '../../use-cases/voice/ParseVoiceInput';
import { SpeechToTextService } from '../../infrastructure/services/SpeechToTextService';
import { isPastDate, isTodayOrFuture } from '../../infrastructure/utils/dateUtils';

export class VoiceController {
  constructor(
    private parseVoiceInput: ParseVoiceInput,
    private speechToText: SpeechToTextService
  ) {}

  async parse(req: Request, res: Response) {
    try {
      const { transcript } = req.body;

      if (!transcript) {
        return res.status(400).json({ error: 'Transcript is required' });
      }

      if (typeof transcript !== 'string') {
        return res.status(400).json({ error: 'Transcript must be a string' });
      }

      if (!transcript.trim()) {
        return res.status(400).json({ error: 'Transcript cannot be empty' });
      }

      if (transcript.length > 10000) {
        return res.status(400).json({ error: 'Transcript must be 10000 characters or less' });
      }

      const result = await this.parseVoiceInput.execute(transcript.trim());

      if (result.parsed.dueDate) {
        try {
          const dueDate = typeof result.parsed.dueDate === 'string' 
            ? new Date(result.parsed.dueDate) 
            : result.parsed.dueDate;
          
          if (isNaN(dueDate.getTime())) {
            return res.status(400).json({ 
              error: 'Invalid date format received. Please try again.' 
            });
          }

          if (isPastDate(dueDate)) {
            return res.status(400).json({ 
              error: 'Cannot select past date. Please select today or a future date.' 
            });
          }

          if (!isTodayOrFuture(dueDate)) {
            return res.status(400).json({ 
              error: 'Invalid date. Please select today or a future date.' 
            });
          }
        } catch (error) {
          return res.status(400).json({ 
            error: 'Invalid date format. Please try again.' 
          });
        }
      }

      res.json({
        transcript: result.transcript,
        parsed: result.parsed,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to parse transcript';
      res.status(500).json({ error: message });
    }
  }

  async transcribeAndParse(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Audio file is required' });
      }

      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      if (req.file.size > MAX_FILE_SIZE) {
        return res.status(413).json({ error: 'Audio file is too large. Maximum size is 10MB' });
      }

      const MIN_FILE_SIZE = 1024;
      if (req.file.size < MIN_FILE_SIZE) {
        return res.status(400).json({ error: 'Audio file is too small. Please upload a valid audio file' });
      }

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

      if (!req.file.buffer || req.file.buffer.length === 0) {
        return res.status(400).json({ error: 'Audio file is empty or corrupted' });
      }

      const transcription = await this.speechToText.transcribeAudio(
        req.file.buffer,
        req.file.mimetype
      );

      if (!transcription || !transcription.transcript) {
        return res.status(500).json({ error: 'Failed to transcribe audio. Please try again.' });
      }

      const result = await this.parseVoiceInput.execute(transcription.transcript);

      if (result.parsed.dueDate) {
        try {
          const dueDate = typeof result.parsed.dueDate === 'string' 
            ? new Date(result.parsed.dueDate) 
            : result.parsed.dueDate;
          
          if (isNaN(dueDate.getTime())) {
            return res.status(400).json({ 
              error: 'Invalid date format received. Please try again.' 
            });
          }

          if (isPastDate(dueDate)) {
            return res.status(400).json({ 
              error: 'Cannot select past date. Please select today or a future date.' 
            });
          }

          if (!isTodayOrFuture(dueDate)) {
            return res.status(400).json({ 
              error: 'Invalid date. Please select today or a future date.' 
            });
          }
        } catch (error) {
          return res.status(400).json({ 
            error: 'Invalid date format. Please try again.' 
          });
        }
      }

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
