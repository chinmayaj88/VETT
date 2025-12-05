import { Router } from 'express';
import multer from 'multer';
import { VoiceController } from '../controllers/VoiceController';
import { validate } from '../middleware/validator';
import { ParseVoiceInputSchema } from '../dto/TaskDTO';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'audio/webm',
      'audio/wav',
      'audio/mp3',
      'audio/mpeg',
      'audio/ogg',
      'audio/flac',
      'audio/m4a',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  },
});

export const createVoiceRoutes = (voiceController: VoiceController) => {
  const router = Router();

  // Parse text transcript (from frontend)
  router.post('/parse', validate(ParseVoiceInputSchema), (req, res) => voiceController.parse(req, res));

  // Transcribe audio and parse (using Hugging Face + Gemini)
  router.post('/transcribe', upload.single('audio'), (req, res) => voiceController.transcribeAndParse(req, res));

  return router;
};

