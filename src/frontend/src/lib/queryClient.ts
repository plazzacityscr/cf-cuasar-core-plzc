/**
 * Configuración de QueryClient de TanStack Query
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Crear instancia de QueryClient con configuración personalizada
 */
export const createQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Tiempo de refresco en milisegundos (5 minutos por defecto)
        staleTime: 5 * 60 * 1000,
        // Tiempo de caché en milisegundos (10 minutos por defecto)
        gcTime: 10 * 60 * 1000,
        // Número de reintentos en caso de error
        retry: (failureCount, error) => {
          // No reintentar en errores 4xx (errores del cliente)
          if (error && typeof error === 'object' && 'statusCode' in error) {
            const statusCode = (error as any).statusCode;
            if (statusCode && statusCode >= 400 && statusCode < 500) {
              return false;
            }
          }
          // Reintentar hasta 2 veces en otros errores
          return failureCount < 2;
        },
        // Retraso entre reintentos (exponencial)
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refrescar datos cuando la ventana obtiene foco
        refetchOnWindowFocus: false,
        // Refrescar datos al reconectar
        refetchOnReconnect: true,
        // No refrescar datos al montar el componente
        refetchOnMount: false,
      },
      mutations: {
        // Número de reintentos en caso de error
        retry: (failureCount, error) => {
          // No reintentar en errores 4xx
          if (error && typeof error === 'object' && 'statusCode' in error) {
            const statusCode = (error as any).statusCode;
            if (statusCode && statusCode >= 400 && statusCode < 500) {
              return false;
            }
          }
          // Reintentar una vez en otros errores
          return failureCount < 1;
        },
        // Retraso entre reintentos
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  });
};

/**
 * Instancia única de QueryClient
 */
export const queryClient = createQueryClient();
