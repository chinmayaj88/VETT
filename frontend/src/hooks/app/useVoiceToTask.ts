import { useState, useRef, useEffect, useCallback } from 'react';
import { useVoiceApi } from '../api/useVoiceApi';
import type { CreateTaskInput } from '../../types/task';
import { TaskStatus, TaskPriority } from '../../types/task';

interface UseVoiceToTaskParams {
  isOpen: boolean;
  onClose: () => void;
}

export function useVoiceToTask({ isOpen, onClose }: UseVoiceToTaskParams) {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [parsedTask, setParsedTask] = useState<CreateTaskInput | null>(null);
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
      setShowPreview(false);
      setParsedTask(null);
      setAudioData(null);
      setErrorMessage(null);
      setIsLoading(false);
      setIsReady(false);
      setIsTranscribing(false);
      cleanup();
    }
  }, [isOpen, cleanup]);

  const getMimeType = (): string => {
    if (MediaRecorder.isTypeSupported('audio/webm')) return 'audio/webm';
    if (MediaRecorder.isTypeSupported('audio/mp4')) return 'audio/mp4';
    return 'audio/webm';
  };

  const startListening = async () => {
    if (isListening || isLoading || !isOpen) return;

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

      mediaRecorder.onstop = () => {
        setIsListening(false);
        setIsLoading(false);
      };

      setIsReady(true);
      setIsLoading(false);

      setTimeout(() => {
        mediaRecorder.start();
        setIsListening(true);
        setIsReady(false);
        setTranscript('');
      }, 500);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('Failed to access microphone. Please check permissions.');
      cleanup();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop();
    }
    setIsListening(false);
  };

  const handleAccept = async () => {
    stopRecording();
    setIsTranscribing(true);
    setErrorMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (audioChunksRef.current.length === 0) {
        setErrorMessage('No audio recorded. Please try again.');
        setIsTranscribing(false);
        cleanup();
        return;
      }

      const mimeType = mediaRecorderRef.current?.mimeType || getMimeType();
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
      
      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      if (audioBlob.size > MAX_FILE_SIZE) {
        setErrorMessage('Audio file is too large. Maximum size is 10MB. Please record a shorter clip.');
        setIsTranscribing(false);
        cleanup();
        return;
      }

      const MIN_FILE_SIZE = 1024;
      if (audioBlob.size < MIN_FILE_SIZE) {
        setErrorMessage('Audio recording is too short. Please record at least a few seconds of audio.');
        setIsTranscribing(false);
        cleanup();
        return;
      }

      const audioFile = new File([audioBlob], 'recording.webm', { type: mimeType });

      const result = await voiceApi.transcribeAndParse(audioFile);
      
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response from server');
      }

      const taskData: CreateTaskInput = {
        title: result.parsed?.title || result.transcript || 'Untitled Task',
        description: result.parsed?.description || null,
        priority: (result.parsed?.priority as TaskPriority) || TaskPriority.MEDIUM,
        status: (result.parsed?.status as TaskStatus) || TaskStatus.TODO,
        dueDate: result.parsed?.dueDate || null,
      };

      setParsedTask(taskData);
      setTranscript(result.transcript);
      setShowPreview(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to transcribe audio';
      setErrorMessage(message);
    } finally {
      setIsTranscribing(false);
      cleanup();
    }
  };

  const handleCancel = () => {
    stopRecording();
    cleanup();
    setTranscript('');
    setParsedTask(null);
    setShowPreview(false);
    setErrorMessage(null);
  };

  const handlePreviewConfirm = (onConfirm: (task: CreateTaskInput) => void) => {
    if (parsedTask) {
      onConfirm(parsedTask);
      onClose();
      setTranscript('');
      setParsedTask(null);
      setShowPreview(false);
      setErrorMessage(null);
    }
  };

  const handlePreviewCancel = () => {
    setShowPreview(false);
    setParsedTask(null);
    setTranscript('');
    setErrorMessage(null);
    cleanup();
  };

  const updateParsedTask = (updates: Partial<CreateTaskInput>) => {
    if (parsedTask) {
      setParsedTask({ ...parsedTask, ...updates });
    }
  };

  return {
    isListening,
    isLoading,
    isReady,
    isTranscribing,
    transcript,
    showPreview,
    parsedTask,
    audioData,
    errorMessage,
    startListening,
    handleAccept,
    handleCancel,
    handlePreviewConfirm,
    handlePreviewCancel,
    updateParsedTask,
  };
}

