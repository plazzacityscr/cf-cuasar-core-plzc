/**
 * Hook genérico para llamadas a la API con TanStack Query
 */

import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, handleApiError } from '../lib/apiClient';

/**
 * Tipo para opciones de query genéricas
 */
export type UseApiQueryOptions<TData, TError = ApiError> = Omit<
  UseQueryOptions<TData, TError>,
  'queryKey' | 'queryFn'
>;

/**
 * Tipo para opciones de mutación genéricas
 */
export type UseApiMutationOptions<TData, TVariables, TError = ApiError> = Omit<
  UseMutationOptions<TData, TError, TVariables>,
  'mutationFn'
>;

/**
 * Hook genérico para realizar queries a la API
 */
export function useApi<TData, TError = ApiError>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: UseApiQueryOptions<TData, TError>
) {
  return useQuery<TData, TError>({
    queryKey,
    queryFn,
    ...options,
  });
}

/**
 * Hook genérico para realizar mutations a la API
 */
export function useApiMutation<TData, TVariables, TError = ApiError>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseApiMutationOptions<TData, TVariables, TError>
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn,
    ...options,
  });
}

/**
 * Hook para manejar errores de API de forma consistente
 */
export function useApiErrorHandler() {
  const handleError = (error: unknown): ApiError => {
    return handleApiError(error);
  };

  return { handleError };
}

/**
 * Hook para polling automático de datos
 */
export function useApiPolling<TData>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  interval: number,
  options?: Omit<UseApiQueryOptions<TData>, 'refetchInterval'>
) {
  return useQuery<TData, ApiError>({
    queryKey,
    queryFn,
    refetchInterval: interval,
    ...options,
  });
}

/**
 * Hook para polling condicional basado en el estado de los datos
 */
export function useApiConditionalPolling<TData>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  shouldPoll: (data: TData | undefined) => boolean,
  interval: number,
  options?: Omit<UseApiQueryOptions<TData>, 'refetchInterval'>
) {
  return useQuery<TData, ApiError>({
    queryKey,
    queryFn,
    refetchInterval: (query) => {
      const data = query.state.data as TData | undefined;
      return shouldPoll(data) ? interval : false;
    },
    ...options,
  });
}
