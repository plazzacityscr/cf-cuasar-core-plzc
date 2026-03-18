/**
 * Estados posibles de un paso del workflow
 */
export enum StepStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped'
}

/**
 * Estados posibles de la ejecución del workflow
 */
export enum WorkflowStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

/**
 * Interfaz para un paso del workflow
 */
export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: StepStatus;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  output?: any;
}

/**
 * Interfaz para la ejecución de un workflow
 */
export interface WorkflowExecution {
  id: string;
  projectId: string;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  startedAt: string;
  completedAt?: string;
  error?: string;
  progress: number;
}

/**
 * Interfaz para iniciar un workflow
 */
export interface StartWorkflowInput {
  projectId: string;
}

/**
 * Interfaz para respuesta de ejecución de workflow
 */
export interface WorkflowExecutionResponse {
  execution: WorkflowExecution;
}

/**
 * Interfaz para progreso del workflow
 */
export interface WorkflowProgress {
  executionId: string;
  status: WorkflowStatus;
  currentStep: string;
  progress: number;
  stepsCompleted: number;
  totalSteps: number;
}
