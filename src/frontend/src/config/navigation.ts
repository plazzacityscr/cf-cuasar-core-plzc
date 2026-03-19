/**
 * Configuración centralizada de navegación del sidebar
 * Regla R2: Cero hardcoding - todos los textos de navegación deben estar centralizados
 */

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  badge?: number | string;
  children?: NavigationItem[];
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Panel de Control',
    path: '/',
    icon: 'LayoutDashboard'
  },
  {
    id: 'projects',
    label: 'Proyectos',
    path: '/projects',
    icon: 'FolderOpen'
  }
];

export const navigationConfig = {
  items: navigationItems,
  defaultPath: '/',
  collapsedWidth: '4rem',
  expandedWidth: '16rem'
} as const;

export type NavigationConfig = typeof navigationConfig;
