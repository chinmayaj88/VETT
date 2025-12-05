import { useCallback } from 'react';
import { api } from '../../lib/axios';
import type { VoiceParseResponse } from '../../types/task';

export function useVoiceApi() {
  const parse = useCallback(async (transcript: string): Promise<VoiceParseResponse> => {
    const response = await api.post<VoiceParseResponse>('/voice/parse', {
      transcript,
    });
    return response.data;
  }, []);

  const transcribeAndParse = useCallback(async (audioFile: File): Promise<VoiceParseResponse> => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    const response = await api.post<VoiceParseResponse>(
      '/voice/transcribe',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      }
    );
    return response.data;
  }, []);

  return {
    parse,
    transcribeAndParse,
  };
}

