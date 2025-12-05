import { Mic, Check, X, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useSpeechInput } from '../hooks/app/useSpeechInput';

interface SpeechInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function SpeechInput({ value, onChange, disabled }: SpeechInputProps) {
  const {
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
  } = useSpeechInput({ value, onChange, disabled });

  return (
    <>
      {!isActive ? (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {value?.trim() && (
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClearText();
              }}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Clear text"
            >
              <XCircle className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            type="button"
            onClick={startListening}
            disabled={disabled}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
            title="Start voice input"
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-card/95 backdrop-blur-md rounded-lg px-2 py-1.5 shadow-lg border z-50 max-w-[90%]">
          {isTranscribing && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary whitespace-nowrap">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
              <span className="hidden sm:inline">Processing...</span>
            </div>
          )}

          {isReady && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-green-500 whitespace-nowrap">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="hidden sm:inline">Ready!</span>
            </div>
          )}

          {isListening && !isTranscribing && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-destructive whitespace-nowrap">
              <div className="w-1.5 h-1.5 bg-destructive rounded-full animate-pulse"></div>
              <span className="hidden sm:inline">Listening</span>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary whitespace-nowrap">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
              <span className="hidden sm:inline">Starting...</span>
            </div>
          )}

          {(isLoading || isListening || isReady) && (
            <div className="flex items-end gap-0.5 h-6 px-1.5 min-w-[48px]">
              {isLoading ? (
                Array.from({ length: 16 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-0.5 bg-indigo-400 rounded-full animate-pulse"
                    style={{
                      height: `${4 + (index % 3) * 4}px`,
                      animationDelay: `${index * 50}ms`,
                    }}
                  />
                ))
              ) : audioData ? (
                Array.from(audioData.slice(0, 16)).map((value, index) => {
                  const amplified = Math.min(value * 1.5, 255);
                  const baseHeight = 3;
                  const barHeight = Math.max(baseHeight, baseHeight + (amplified / 255) * 25);
                  return (
                    <div
                      key={index}
                      className="w-0.5 bg-gradient-to-t from-red-500 to-red-400 rounded-full transition-all duration-75"
                      style={{
                        height: `${barHeight}px`,
                        minHeight: '3px',
                        maxHeight: '28px',
                      }}
                    />
                  );
                })
              ) : (
                Array.from({ length: 16 }).map((_, index) => (
                  <div key={index} className="w-0.5 bg-border rounded-full" style={{ height: '2px' }} />
                ))
              )}
            </div>
          )}

          {isActive && <div className="w-px h-5 bg-border"></div>}

          {errorMessage && (
            <>
              <span className="text-xs text-destructive max-w-[80px] truncate" title={errorMessage}>
                {errorMessage}
              </span>
              <div className="w-px h-5 bg-border"></div>
            </>
          )}

          {!isLoading && !isReady && !isTranscribing && isListening && (
            <div className="flex items-center gap-1">
              <Button onClick={handleConfirm} size="icon" className="h-6 w-6 bg-green-500 hover:bg-green-600" title="Accept">
                <Check className="h-3 w-3" />
              </Button>
              <Button onClick={handleCancel} size="icon" variant="destructive" className="h-6 w-6" title="Cancel">
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
