/**
 * Configuración centralizada de reportes
 * Regla R2: Cero hardcoding - todos los textos de reportes deben estar centralizados
 */

export interface ReportConfig {
  id: string;
  label: string;
  title: string;
  description: string;
  icon?: string;
}

export const reportConfigs: ReportConfig[] = [
  {
    id: 'resumen',
    label: 'Resumen Ejecutivo',
    title: 'Resumen Ejecutivo',
    description: 'Resumen general del análisis con puntos clave y conclusiones principales.',
    icon: 'FileText'
  },
  {
    id: 'analisis_mercado',
    label: 'Análisis de Mercado',
    title: 'Análisis de Mercado',
    description: 'Análisis detallado del mercado actual con tendencias y segmentos.',
    icon: 'BarChart3'
  },
  {
    id: 'tendencias',
    label: 'Tendencias',
    title: 'Tendencias del Mercado',
    description: 'Análisis de tendencias emergentes y patrones del mercado.',
    icon: 'TrendingUp'
  },
  {
    id: 'competencia',
    label: 'Competencia',
    title: 'Análisis de Competencia',
    description: 'Evaluación de la competencia y análisis de ventajas competitivas.',
    icon: 'Users'
  },
  {
    id: 'oportunidades',
    label: 'Oportunidades',
    title: 'Oportunidades de Inversión',
    description: 'Identificación de oportunidades de inversión y zonas con mayor potencial.',
    icon: 'Target'
  },
  {
    id: 'riesgos',
    label: 'Riesgos',
    title: 'Análisis de Riesgos',
    description: 'Evaluación de riesgos del mercado y estrategias de mitigación.',
    icon: 'AlertTriangle'
  },
  {
    id: 'recomendaciones',
    label: 'Recomendaciones',
    title: 'Recomendaciones',
    description: 'Recomendaciones estratégicas y próximos pasos para la inversión.',
    icon: 'Lightbulb'
  },
  {
    id: 'proyecciones',
    label: 'Proyecciones',
    title: 'Proyecciones del Mercado',
    description: 'Proyecciones futuras del mercado a 12 y 24 meses.',
    icon: 'LineChart'
  },
  {
    id: 'conclusiones',
    label: 'Conclusiones',
    title: 'Conclusiones',
    description: 'Conclusiones finales y resumen ejecutivo del análisis.',
    icon: 'CheckCircle'
  }
];

export const reportsConfig = {
  reports: reportConfigs,
  defaultReportId: 'resumen',
  loadingMessage: 'Cargando informe...',
  errorMessage: 'Error al cargar el informe',
  retryMessage: 'Reintentar',
  retryingMessage: 'Reintentando...'
} as const;

export type ReportsConfig = typeof reportsConfig;
export type ReportConfigType = ReportConfig;
