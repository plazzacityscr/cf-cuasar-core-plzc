/**
 * Servicio para operaciones relacionadas con workflows
 */

import { apiClient, extractData } from '../lib/apiClient';
import type {
  WorkflowExecution,
  WorkflowStep,
  StartWorkflowInput,
  WorkflowExecutionResponse,
  WorkflowProgress,
} from '../types/workflow';
import type { ApiSuccessResponse } from '../types/api';

/**
 * Iniciar un workflow para un proyecto
 */
export async function startWorkflow(input: StartWorkflowInput): Promise<WorkflowExecution> {
  const response = await apiClient.post<ApiSuccessResponse<WorkflowExecutionResponse>>(
    '/api/workflows/iniciar',
    input
  );
  
  const data = extractData(response);
  return data.execution;
}

/**
 * Obtener una ejecución de workflow por su ID
 */
export async function getExecution(executionId: string): Promise<WorkflowExecution> {
  const response = await apiClient.get<ApiSuccessResponse<WorkflowExecution>>(
    `/api/workflows/ejecuciones/${executionId}`
  );
  
  return extractData(response);
}

/**
 * Obtener los pasos de una ejecución de workflow
 */
export async function getExecutionSteps(executionId: string): Promise<WorkflowStep[]> {
  const response = await apiClient.get<ApiSuccessResponse<WorkflowStep[]>>(
    `/api/workflows/ejecuciones/${executionId}/pasos`
  );
  
  return extractData(response);
}

/**
 * Obtener el progreso de una ejecución de workflow
 */
export async function getExecutionProgress(executionId: string): Promise<WorkflowProgress> {
  const response = await apiClient.get<ApiSuccessResponse<WorkflowProgress>>(
    `/api/workflows/ejecuciones/${executionId}/progreso`
  );
  
  return extractData(response);
}

/**
 * Cancelar una ejecución de workflow
 */
export async function cancelExecution(executionId: string): Promise<WorkflowExecution> {
  const response = await apiClient.post<ApiSuccessResponse<WorkflowExecution>>(
    `/api/workflows/ejecuciones/${executionId}/cancelar`,
    {}
  );
  
  return extractData(response);
}

/**
 * Obtener ejecuciones de workflow por proyecto
 */
export async function getProjectExecutions(projectId: string): Promise<WorkflowExecution[]> {
  const response = await apiClient.get<ApiSuccessResponse<WorkflowExecution[]>>(
    `/api/proyectos/${projectId}/ejecuciones`
  );
  
  return extractData(response);
}

/**
 * Obtener la última ejecución de workflow para un proyecto
 */
export async function getLatestExecution(projectId: string): Promise<WorkflowExecution | null> {
  const response = await apiClient.get<ApiSuccessResponse<WorkflowExecution | null>>(
    `/api/proyectos/${projectId}/ejecuciones/ultima`
  );
  
  return extractData(response);
}

/**
 * Reintentar una ejecución de workflow fallida
 */
export async function retryExecution(executionId: string): Promise<WorkflowExecution> {
  const response = await apiClient.post<ApiSuccessResponse<WorkflowExecution>>(
    `/api/workflows/ejecuciones/${executionId}/reintentar`,
    {}
  );
  
  return extractData(response);
}
