/**
 * Hook para recuperación de resultados con TanStack Query
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import * as resultsService from '../services/resultsService';
import type { ReportFilters } from '../services/resultsService';

/**
 * Hook para obtener un reporte por su ID
 */
export function useReport(reportId: string, enabled = true) {
  return useQuery({
    queryKey: ['report', reportId],
    queryFn: () => resultsService.getReport(reportId),
    enabled: enabled && !!reportId,
  });
}

/**
 * Hook para obtener todos los reportes
 */
export function useAllReports(filters?: ReportFilters, enabled = true) {
  return useQuery({
    queryKey: ['reports', filters],
    queryFn: () => resultsService.getAllReports(filters),
    enabled,
  });
}

/**
 * Hook para obtener reportes de un proyecto
 */
export function useProjectReports(projectId: string, enabled = true) {
  return useQuery({
    queryKey: ['projectReports', projectId],
    queryFn: () => resultsService.getProjectReports(projectId),
    enabled: enabled && !!projectId,
  });
}

/**
 * Hook para obtener el último reporte de un proyecto
 */
export function useLatestReport(projectId: string, enabled = true) {
  return useQuery({
    queryKey: ['latestReport', projectId],
    queryFn: () => resultsService.getLatestReport(projectId),
    enabled: enabled && !!projectId,
  });
}

/**
 * Hook para descargar un reporte
 */
export function useDownloadReport() {
  return useMutation({
    mutationFn: ({ reportId, format }: { reportId: string; format: 'markdown' | 'html' | 'pdf' }) =>
      resultsService.downloadReport(reportId, format),
  });
}

/**
 * Hook para obtener el resumen de resultados de un proyecto
 */
export function useProjectResultsSummary(projectId: string, enabled = true) {
  return useQuery({
    queryKey: ['projectResultsSummary', projectId],
    queryFn: () => resultsService.getProjectResultsSummary(projectId),
    enabled: enabled && !!projectId,
    staleTime: 60000, // 1 minuto - el resumen cambia frecuentemente
  });
}

/**
 * Hook combinado para obtener resultados completos de un proyecto
 */
export function useProjectResults(projectId: string, enabled = true) {
  const reportsQuery = useProjectReports(projectId, enabled);
  const latestReportQuery = useLatestReport(projectId, enabled);
  const summaryQuery = useProjectResultsSummary(projectId, enabled);

  return {
    reports: reportsQuery.data || [],
    latestReport: latestReportQuery.data,
    summary: summaryQuery.data,
    isLoading: reportsQuery.isLoading || latestReportQuery.isLoading || summaryQuery.isLoading,
    isError: reportsQuery.isError || latestReportQuery.isError || summaryQuery.isError,
    error: reportsQuery.error || latestReportQuery.error || summaryQuery.error,
    refetch: () => {
      reportsQuery.refetch();
      latestReportQuery.refetch();
      summaryQuery.refetch();
    },
  };
}
