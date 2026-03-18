/**
 * Servicio para operaciones relacionadas con resultados y reportes
 */

import { apiClient, extractData } from '../lib/apiClient';
import type { ApiSuccessResponse } from '../types/api';

/**
 * Interfaz para un reporte de análisis
 */
export interface AnalysisReport {
  id: string;
  projectId: string;
  executionId: string;
  title: string;
  summary: string;
  content: string;
  createdAt: string;
  format: 'markdown' | 'html' | 'pdf';
}

/**
 * Interfaz para filtros de reportes
 */
export interface ReportFilters {
  projectId?: string;
  executionId?: string;
  format?: string;
}

/**
 * Obtener un reporte por su ID
 */
export async function getReport(reportId: string): Promise<AnalysisReport> {
  const response = await apiClient.get<ApiSuccessResponse<AnalysisReport>>(
    `/api/resultados/reportes/${reportId}`
  );
  
  return extractData(response);
}

/**
 * Obtener todos los reportes
 */
export async function getAllReports(filters?: ReportFilters): Promise<AnalysisReport[]> {
  const params = new URLSearchParams();
  
  if (filters) {
    if (filters.projectId) params.append('projectId', filters.projectId);
    if (filters.executionId) params.append('executionId', filters.executionId);
    if (filters.format) params.append('format', filters.format);
  }
  
  const response = await apiClient.get<ApiSuccessResponse<AnalysisReport[]>>(
    `/api/resultados/reportes?${params.toString()}`
  );
  
  return extractData(response);
}

/**
 * Obtener reportes por proyecto
 */
export async function getProjectReports(projectId: string): Promise<AnalysisReport[]> {
  const response = await apiClient.get<ApiSuccessResponse<AnalysisReport[]>>(
    `/api/proyectos/${projectId}/reportes`
  );
  
  return extractData(response);
}

/**
 * Obtener el reporte de la última ejecución de un proyecto
 */
export async function getLatestReport(projectId: string): Promise<AnalysisReport | null> {
  const response = await apiClient.get<ApiSuccessResponse<AnalysisReport | null>>(
    `/api/proyectos/${projectId}/reportes/ultimo`
  );
  
  return extractData(response);
}

/**
 * Descargar un reporte en formato específico
 */
export async function downloadReport(
  reportId: string,
  format: 'markdown' | 'html' | 'pdf'
): Promise<Blob> {
  const response = await apiClient.get(
    `/api/resultados/reportes/${reportId}/descargar?format=${format}`,
    {
      responseType: 'blob',
    }
  );
  
  return response.data;
}

/**
 * Obtener resumen de resultados de un proyecto
 */
export async function getProjectResultsSummary(projectId: string): Promise<{
  totalReports: number;
  lastReportDate?: string;
  lastExecutionStatus: string;
}> {
  const response = await apiClient.get<ApiSuccessResponse<{
    totalReports: number;
    lastReportDate?: string;
    lastExecutionStatus: string;
  }>>(
    `/api/proyectos/${projectId}/resultados/resumen`
  );
  
  return extractData(response);
}
