/**
 * Exportaciones centralizadas de configuración
 * Regla R2: Cero hardcoding - importar desde aquí para acceder a configuraciones
 */

export { uiTexts } from './texts';
export type { UITexts } from './texts';

export { errorMessages } from './errors';
export type { ErrorMessages } from './errors';

export { validationMessages } from './validation';
export type { ValidationMessages } from './validation';

export { navigationItems, navigationConfig } from './navigation';
export type { NavigationItem, NavigationConfig } from './navigation';

export { reportConfigs, reportsConfig } from './reports';
export type { ReportConfig, ReportsConfig, ReportConfigType } from './reports';
