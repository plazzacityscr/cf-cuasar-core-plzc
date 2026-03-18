/**
 * Proveedor de QueryClient para la aplicación
 */

import { QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { queryClient } from './queryClient';

/**
 * Props del QueryProvider
 */
interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Componente proveedor que envuelve la aplicación con QueryClient
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
    </TanStackQueryClientProvider>
  );
}
