import { TaskRepository } from '../database/TaskRepository';
import { NLPService } from '../services/NLPService';
import { SpeechToTextService } from '../services/SpeechToTextService';
import { CreateTask } from '../../use-cases/tasks/CreateTask';
import { GetTasks } from '../../use-cases/tasks/GetTasks';
import { GetTaskById } from '../../use-cases/tasks/GetTaskById';
import { UpdateTask } from '../../use-cases/tasks/UpdateTask';
import { DeleteTask } from '../../use-cases/tasks/DeleteTask';
import { ParseVoiceInput } from '../../use-cases/voice/ParseVoiceInput';
import { TaskController } from '../../presentation/controllers/TaskController';
import { VoiceController } from '../../presentation/controllers/VoiceController';

let taskRepository: TaskRepository | null = null;
let nlpService: NLPService | null = null;
let speechToText: SpeechToTextService | null = null;

let createTaskUseCase: CreateTask | null = null;
let getTasksUseCase: GetTasks | null = null;
let getTaskByIdUseCase: GetTaskById | null = null;
let updateTaskUseCase: UpdateTask | null = null;
let deleteTaskUseCase: DeleteTask | null = null;
let parseVoiceInputUseCase: ParseVoiceInput | null = null;

let taskController: TaskController | null = null;
let voiceController: VoiceController | null = null;

const getTaskRepository = (): TaskRepository => {
  if (!taskRepository) {
    taskRepository = new TaskRepository();
  }
  return taskRepository;
};

const getNLPService = (): NLPService => {
  if (!nlpService) {
    nlpService = new NLPService();
  }
  return nlpService;
};

const getSpeechToTextService = (): SpeechToTextService => {
  if (!speechToText) {
    speechToText = new SpeechToTextService();
  }
  return speechToText;
};

const getCreateTask = (): CreateTask => {
  if (!createTaskUseCase) {
    createTaskUseCase = new CreateTask(getTaskRepository());
  }
  return createTaskUseCase;
};

const getGetTasks = (): GetTasks => {
  if (!getTasksUseCase) {
    getTasksUseCase = new GetTasks(getTaskRepository());
  }
  return getTasksUseCase;
};

const getGetTaskById = (): GetTaskById => {
  if (!getTaskByIdUseCase) {
    getTaskByIdUseCase = new GetTaskById(getTaskRepository());
  }
  return getTaskByIdUseCase;
};

const getUpdateTask = (): UpdateTask => {
  if (!updateTaskUseCase) {
    updateTaskUseCase = new UpdateTask(getTaskRepository());
  }
  return updateTaskUseCase;
};

const getDeleteTask = (): DeleteTask => {
  if (!deleteTaskUseCase) {
    deleteTaskUseCase = new DeleteTask(getTaskRepository());
  }
  return deleteTaskUseCase;
};

const getParseVoiceInput = (): ParseVoiceInput => {
  if (!parseVoiceInputUseCase) {
    parseVoiceInputUseCase = new ParseVoiceInput(getNLPService());
  }
  return parseVoiceInputUseCase;
};

export function getTaskController(): TaskController {
  if (!taskController) {
    taskController = new TaskController(
      getCreateTask(),
      getGetTasks(),
      getGetTaskById(),
      getUpdateTask(),
      getDeleteTask()
    );
  }
  return taskController;
}

export function getVoiceController(): VoiceController {
  if (!voiceController) {
    voiceController = new VoiceController(getParseVoiceInput(), getSpeechToTextService());
  }
  return voiceController;
}
