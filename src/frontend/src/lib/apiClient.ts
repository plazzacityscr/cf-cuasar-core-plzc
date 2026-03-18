/**
 * Cliente HTTP configurado con axios para comunicación con la API
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiErrorResponse } from '../types/api';
import { errorMessages } from '../config/errors';

/**
 * Error personalizado para respuestas de la API
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Crear instancia de axios configurada
 */
const createApiClient = (): AxiosInstance => {
  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787',
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 segundos de timeout
  });

  /**
   * Interceptor de solicitud - Agregar logging opcional
   */
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Logging opcional para desarrollo
      if (import.meta.env.DEV) {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
      }
      return config;
    },
    (error: AxiosError) => {
      console.error('[API Request Error]', error);
      return Promise.reject(error);
    }
  );

  /**
   * Interceptor de respuesta - Manejo de errores y logging
   */
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
      // Logging opcional para desarrollo
      if (import.meta.env.DEV) {
        console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
      }
      return response;
    },
    (error: AxiosError<ApiErrorResponse>) => {
      // Manejo de errores
      if (error.response) {
        // El servidor respondió con un código de error
        const { status, data } = error.response;
        const errorMessage = data?.error || data?.details || errorMessages.api.serverError;
        
        console.error(`[API Error] ${status} - ${errorMessage}`, data);
        
        // Crear error personalizado con información del servidor
        throw new ApiError(
          errorMessage,
          status,
          data?.code,
          data?.details
        );
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        const errorMessage = errorMessages.general.network;
        console.error('[API Error] No response received', error.message);
        throw new ApiError(errorMessage, undefined, 'NETWORK_ERROR');
      } else {
        // Error al configurar la solicitud
        const errorMessage = errorMessages.general.unknown;
        console.error('[API Error] Request setup error', error.message);
        throw new ApiError(errorMessage, undefined, 'REQUEST_ERROR');
      }
    }
  );

  return apiClient;
};

/**
 * Instancia única del cliente API
 */
export const apiClient = createApiClient();

/**
 * Función auxiliar para extraer datos de respuesta exitosa
 */
export function extractData<T>(response: AxiosResponse<{ data: T }>): T {
  return response.data.data;
}

/**
 * Función auxiliar para manejar errores de API
 */
export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }
  if (error instanceof Error) {
    return new ApiError(error.message);
  }
  return new ApiError('Error desconocido');
}
