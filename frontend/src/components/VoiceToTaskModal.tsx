import { X, Mic, Check, Save } from 'lucide-react';
import type { CreateTaskInput } from '../types/task';
import { TaskStatus, TaskPriority } from '../types/task';
import { DatePickerInput } from './ui/date-picker';
import { useVoiceToTask } from '../hooks/app/useVoiceToTask';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

interface VoiceToTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (task: CreateTaskInput) => void;
}

export default function VoiceToTaskModal({ isOpen, onClose, onConfirm }: VoiceToTaskModalProps) {
  const {
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
  } = useVoiceToTask({ isOpen, onClose });

  if (!isOpen) return null;

  return (
    <>
      {!showPreview && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Voice to Task</DialogTitle>
              <DialogDescription>Record your voice to create a task automatically</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-muted/30 rounded-xl p-4 min-h-[100px] border border-dashed border-muted-foreground/20">
                {transcript ? (
                  <p className="text-foreground text-sm leading-relaxed">{transcript}</p>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[100px] text-center">
                    <Mic className="w-8 h-8 text-muted-foreground/40 mb-2" />
                    <p className="text-muted-foreground text-sm">
                      {isListening
                        ? 'Listening... Speak your task...'
                        : isReady
                          ? 'Ready - Speak now!'
                          : isTranscribing
                            ? 'Transcribing and parsing your speech...'
                            : 'Click the button below to start recording'}
                    </p>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                  <p className="text-destructive text-sm">{errorMessage}</p>
                </div>
              )}

              <div className="flex items-center justify-center gap-4">
                {!isListening && !isLoading && !isReady && !isTranscribing ? (
                  <Button
                    onClick={startListening}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
                    size="lg"
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <div className="flex items-center gap-3 bg-card/95 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg border">
                    {isTranscribing && (
                      <div className="flex items-center gap-2 text-xs font-medium text-primary">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <span>Processing speech...</span>
                      </div>
                    )}

                    {isReady && (
                      <div className="flex items-center gap-2 text-xs font-medium text-green-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Ready - Speak now!</span>
                      </div>
                    )}

                    {isListening && !isTranscribing && (
                      <div className="flex items-center gap-2 text-xs font-medium text-destructive">
                        <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                        <span>Listening...</span>
                      </div>
                    )}

                    {isLoading && (
                      <div className="flex items-center gap-2 text-xs font-medium text-primary">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <span>Initializing...</span>
                      </div>
                    )}

                    {(isLoading || isListening || isReady) && (
                      <>
                        <div className="w-px h-6 bg-border"></div>
                        <div className="flex items-end gap-0.5 h-8 px-2 min-w-[64px]">
                          {isLoading ? (
                            Array.from({ length: 16 }).map((_, index) => (
                              <div
                                key={index}
                                className="w-0.5 bg-primary/40 rounded-full animate-pulse"
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
                      </>
                    )}

                    {!isLoading && !isReady && !isTranscribing && isListening && (
                      <>
                        <div className="w-px h-6 bg-border"></div>
                        <div className="flex items-center gap-1.5">
                          <Button
                            onClick={handleAccept}
                            size="icon"
                            className="h-7 w-7 bg-green-500 hover:bg-green-600"
                            title="Accept and transcribe"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button onClick={handleCancel} size="icon" variant="destructive" className="h-7 w-7" title="Cancel">
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showPreview && parsedTask && (
        <Dialog open={showPreview} onOpenChange={(open) => !open && handlePreviewCancel()}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Preview Task</DialogTitle>
              <DialogDescription>Review and edit the task details before creating</DialogDescription>
            </DialogHeader>

            {errorMessage && (
              <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm font-medium">{errorMessage}</p>
              </div>
            )}

            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="preview-title">Title</Label>
                <Input
                  id="preview-title"
                  value={parsedTask.title}
                  onChange={(e) => updateParsedTask({ title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preview-description">Description</Label>
                <Textarea
                  id="preview-description"
                  value={parsedTask.description || ''}
                  onChange={(e) => updateParsedTask({ description: e.target.value || null })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preview-priority">Priority</Label>
                  <Select
                    value={parsedTask.priority}
                    onValueChange={(value) => updateParsedTask({ priority: value as TaskPriority })}
                  >
                    <SelectTrigger id="preview-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                      <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
                      <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                      <SelectItem value={TaskPriority.URGENT}>Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preview-status">Status</Label>
                  <Select
                    value={parsedTask.status}
                    onValueChange={(value) => updateParsedTask({ status: value as TaskStatus })}
                  >
                    <SelectTrigger id="preview-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                      <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                      <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preview-dueDate">Due Date</Label>
                <DatePickerInput
                  id="preview-dueDate"
                  value={parsedTask.dueDate}
                  onChange={(date) => updateParsedTask({ dueDate: date })}
                  placeholder="Select due date and time"
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handlePreviewCancel} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={() => handlePreviewConfirm(onConfirm)}
                disabled={!parsedTask.title.trim()}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
