/**
 * Hook para acceder a los textos centralizados
 * Regla R2: Cero hardcoding - usar este hook para acceder a todos los textos de UI
 */

import { useMemo } from 'react';
import { uiTexts } from '../config/texts';
import { errorMessages } from '../config/errors';
import { validationMessages } from '../config/validation';
import { navigationItems } from '../config/navigation';
import { reportConfigs } from '../config/reports';

export interface Texts {
  ui: typeof uiTexts;
  errors: typeof errorMessages;
  validation: typeof validationMessages;
  navigation: typeof navigationItems;
  reports: typeof reportConfigs;
}

/**
 * Hook para acceder a los textos centralizados de la aplicación
 * @returns Objeto con todos los textos centralizados
 */
export function useTexts(): Texts {
  return useMemo(() => ({
    ui: uiTexts,
    errors: errorMessages,
    validation: validationMessages,
    navigation: navigationItems,
    reports: reportConfigs
  }), []);
}

export default useTexts;
