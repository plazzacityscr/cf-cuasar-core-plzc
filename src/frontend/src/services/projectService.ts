/**
 * Servicio para operaciones relacionadas con proyectos
 */

import { apiClient, extractData } from '../lib/apiClient';
import type {
  Project,
  ProjectInput,
  ProjectUpdateInput,
  ProjectFilters,
  ProjectsResponse,
  ProjectStats,
} from '../types/project';
import type { ApiSuccessResponse, PaginationParams } from '../types/api';

/**
 * Obtener todos los proyectos
 */
export async function getAllProjects(
  filters?: ProjectFilters,
  pagination?: PaginationParams
): Promise<ProjectsResponse> {
  const params = new URLSearchParams();
  
  if (filters) {
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
  }
  
  if (pagination) {
    if (pagination.page) params.append('page', pagination.page.toString());
    if (pagination.limit) params.append('limit', pagination.limit.toString());
  }
  
  const response = await apiClient.get<ApiSuccessResponse<ProjectsResponse>>(
    `/api/proyectos?${params.toString()}`
  );
  
  return extractData(response);
}

/**
 * Obtener un proyecto por su ID
 */
export async function getProjectById(id: string): Promise<Project> {
  const response = await apiClient.get<ApiSuccessResponse<Project>>(
    `/api/proyectos/${id}`
  );
  
  return extractData(response);
}

/**
 * Crear un nuevo proyecto
 */
export async function createProject(input: ProjectInput): Promise<Project> {
  const response = await apiClient.post<ApiSuccessResponse<Project>>(
    '/api/proyectos',
    input
  );
  
  return extractData(response);
}

/**
 * Actualizar un proyecto existente
 */
export async function updateProject(
  id: string,
  input: ProjectUpdateInput
): Promise<Project> {
  const response = await apiClient.put<ApiSuccessResponse<Project>>(
    `/api/proyectos/${id}`,
    input
  );
  
  return extractData(response);
}

/**
 * Eliminar un proyecto
 */
export async function deleteProject(id: string): Promise<void> {
  await apiClient.delete(`/api/proyectos/${id}`);
}

/**
 * Obtener estadísticas de proyectos
 */
export async function getProjectStats(): Promise<ProjectStats> {
  const response = await apiClient.get<ApiSuccessResponse<ProjectStats>>(
    '/api/proyectos/stats'
  );
  
  return extractData(response);
}

/**
 * Obtener proyectos por estado
 */
export async function getProjectsByStatus(
  status: string,
  pagination?: PaginationParams
): Promise<ProjectsResponse> {
  return getAllProjects({ status: status as any }, pagination);
}

/**
 * Buscar proyectos
 */
export async function searchProjects(
  query: string,
  pagination?: PaginationParams
): Promise<ProjectsResponse> {
  return getAllProjects({ search: query }, pagination);
}
