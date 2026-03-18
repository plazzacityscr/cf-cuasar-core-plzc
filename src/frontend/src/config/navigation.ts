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
  },
  {
    id: 'results',
    label: 'Resultados',
    path: '/results',
    icon: 'BarChart3'
  },
  {
    id: 'analytics',
    label: 'Análisis',
    path: '/analytics',
    icon: 'TrendingUp',
    children: [
      {
        id: 'market-analysis',
        label: 'Análisis de Mercado',
        path: '/analytics/market',
        icon: 'LineChart'
      },
      {
        id: 'trends',
        label: 'Tendencias',
        path: '/analytics/trends',
        icon: 'Activity'
      }
    ]
  },
  {
    id: 'reports',
    label: 'Informes',
    path: '/reports',
    icon: 'FileText'
  },
  {
    id: 'settings',
    label: 'Configuración',
    path: '/settings',
    icon: 'Settings'
  }
];

export const navigationConfig = {
  items: navigationItems,
  defaultPath: '/',
  collapsedWidth: '4rem',
  expandedWidth: '16rem'
} as const;

export type NavigationConfig = typeof navigationConfig;
