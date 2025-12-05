import { useState, useRef, useEffect, useCallback } from 'react';
import { useVoiceApi } from '../api/useVoiceApi';

interface UseSpeechInputParams {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function useSpeechInput({ value, onChange, disabled }: UseSpeechInputParams) {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [pendingTranscript, setPendingTranscript] = useState('');
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isCancelledRef = useRef<boolean>(false);

  const voiceApi = useVoiceApi();

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (mediaRecorderRef.current?.state !== 'inactive') {
      try {
        mediaRecorderRef.current?.stop();
      } catch {
      }
      mediaRecorderRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    audioContextRef.current?.close().catch(() => {});
    audioContextRef.current = null;

    analyserRef.current = null;
    setAudioData(null);
    audioChunksRef.current = [];
    setIsLoading(false);
    setIsReady(false);
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const getMimeType = (): string => {
    if (MediaRecorder.isTypeSupported('audio/webm')) return 'audio/webm';
    if (MediaRecorder.isTypeSupported('audio/mp4')) return 'audio/mp4';
    return 'audio/webm';
  };

  const startListening = async () => {
    if (isListening || isLoading || disabled) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.3;
      analyserRef.current = analyser;

      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioData = () => {
        if (analyserRef.current && streamRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          setAudioData(new Uint8Array(dataArray));
          animationFrameRef.current = requestAnimationFrame(updateAudioData);
        }
      };
      updateAudioData();

      const mediaRecorder = new MediaRecorder(stream, { mimeType: getMimeType() });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (isCancelledRef.current) {
          isCancelledRef.current = false;
          setIsListening(false);
          setIsLoading(false);
          setIsTranscribing(false);
          cleanup();
          return;
        }

        if (audioChunksRef.current.length === 0) {
          setIsListening(false);
          setIsLoading(false);
          cleanup();
          return;
        }

        try {
          setIsTranscribing(true);

          const audioBlob = new Blob(audioChunksRef.current, {
            type: mediaRecorder.mimeType,
          });

          const MAX_FILE_SIZE = 10 * 1024 * 1024;
          if (audioBlob.size > MAX_FILE_SIZE) {
            setErrorMessage('Audio file is too large. Maximum size is 10MB. Please record a shorter clip.');
            setIsTranscribing(false);
            setIsListening(false);
            setIsLoading(false);
            cleanup();
            return;
          }

          const MIN_FILE_SIZE = 1024;
          if (audioBlob.size < MIN_FILE_SIZE) {
            setErrorMessage('Audio recording is too short. Please record at least a few seconds of audio.');
            setIsTranscribing(false);
            setIsListening(false);
            setIsLoading(false);
            cleanup();
            return;
          }

          const audioFile = new File([audioBlob], 'recording.webm', {
            type: mediaRecorder.mimeType,
          });

          const result = await voiceApi.transcribeAndParse(audioFile);
          
          if (!result || typeof result !== 'object' || !result.transcript) {
            throw new Error('Invalid response from server');
          }
          
          const fullTranscript = (value + ' ' + result.transcript).trim();

          setPendingTranscript(fullTranscript);
          onChange(fullTranscript);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to transcribe audio';
          setErrorMessage(message);
        } finally {
          setIsTranscribing(false);
          setIsListening(false);
          setIsLoading(false);
          cleanup();
        }
      };

      setIsReady(true);
      setIsLoading(false);

      setTimeout(() => {
        mediaRecorder.start();
        setIsListening(true);
        setIsReady(false);
        setPendingTranscript('');
      }, 500);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('Failed to access microphone. Please check permissions.');
      cleanup();
    }
  };

  const stopListening = (cancelled: boolean = false) => {
    if (cancelled) {
      isCancelledRef.current = true;
    }
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop();
    }
    setIsListening(false);
    if (!cancelled) {
      cleanup();
    }
  };

  const handleConfirm = () => {
    stopListening();
    const finalTranscript = pendingTranscript.trim() || value.trim();
    if (finalTranscript) {
      onChange(finalTranscript);
    }
    setPendingTranscript('');
    setErrorMessage(null);
  };

  const handleCancel = () => {
    stopListening(true);
    onChange(value);
    setPendingTranscript('');
    setErrorMessage(null);
  };

  const handleClearText = () => {
    onChange('');
    setPendingTranscript('');
    setErrorMessage(null);
  };

  const isActive = isListening || isLoading || isReady || isTranscribing;

  return {
    isListening,
    isLoading,
    isReady,
    isTranscribing,
    audioData,
    errorMessage,
    isActive,
    startListening,
    handleConfirm,
    handleCancel,
    handleClearText,
  };
}

