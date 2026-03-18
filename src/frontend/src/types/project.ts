/**
 * Estados posibles de un proyecto
 */
export enum ProjectStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

/**
 * Interfaz para un proyecto
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  workflowId?: string;
  userId?: string;
}

/**
 * Interfaz para crear un nuevo proyecto
 */
export interface ProjectInput {
  name: string;
  description: string;
}

/**
 * Interfaz para actualizar un proyecto existente
 */
export interface ProjectUpdateInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

/**
 * Interfaz para filtros de proyectos
 */
export interface ProjectFilters {
  status?: ProjectStatus;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Interfaz para paginación de proyectos
 */
export interface ProjectPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Interfaz para respuesta de lista de proyectos
 */
export interface ProjectsResponse {
  projects: Project[];
  pagination: ProjectPagination;
}

/**
 * Interfaz para resumen de estadísticas de proyectos
 */
export interface ProjectStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  failed: number;
  cancelled: number;
}
