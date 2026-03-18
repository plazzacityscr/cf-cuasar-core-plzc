/**
 * Catálogo centralizado de textos de UI
 * Regla R2: Cero hardcoding - todos los textos deben estar centralizados
 */

export const uiTexts = {
  // Header
  header: {
    searchPlaceholder: 'Buscar...',
    menuButtonLabel: 'Abrir menú',
    notificationsLabel: 'Notificaciones',
    userMenuLabel: 'Menú de usuario',
    profile: 'Perfil',
    settings: 'Configuración',
    logout: 'Cerrar sesión'
  },

  // Sidebar
  sidebar: {
    appName: 'VaaIA'
  },

  // Dashboard
  dashboard: {
    title: 'Panel de Control',
    subtitle: 'Resumen general de proyectos',
    stats: {
      totalProjects: 'Total de Proyectos',
      inProgress: 'En Progreso',
      completed: 'Completados',
      failed: 'Fallidos',
      pending: 'Pendientes',
      cancelled: 'Cancelados'
    },
    recentProjects: 'Proyectos Recientes',
    updated: 'Actualizado:'
  },

  // Projects
  projects: {
    title: 'Proyectos',
    subtitle: 'Gestiona tus proyectos de análisis',
    newProject: 'Nuevo Proyecto',
    listView: 'Vista de lista',
    gridView: 'Vista de cuadrícula'
  },

  // Create Project
  createProject: {
    title: 'Crear Nuevo Proyecto',
    subtitle: 'Completa el formulario para crear un nuevo proyecto de análisis',
    back: 'Volver',
    createError: 'Error al crear el proyecto. Por favor, intenta nuevamente.'
  },

  // Project Detail
  projectDetail: {
    backToProjects: 'Volver a Proyectos',
    loading: 'Cargando proyecto...',
    notFound: 'No se encontró el proyecto.',
    loadError: 'Error al cargar el proyecto. Por favor, intenta nuevamente.',
    deleteError: 'Error al eliminar el proyecto. Por favor, intenta nuevamente.',
    deleteConfirm: '¿Estás seguro de que deseas eliminar este proyecto?',
    runAnalysisError: 'Error al ejecutar el análisis. Por favor, intenta nuevamente.'
  },

  // Results
  results: {
    title: 'Resultados del Análisis',
    subtitle: 'Informes detallados del análisis de mercado',
    back: 'Volver',
    backToProject: 'Volver al Proyecto',
    loading: 'Cargando informes...',
    loadError: 'Error al cargar los informes. Por favor, intenta nuevamente.'
  },

  // Loading States
  loading: {
    default: 'Cargando...',
    report: 'Cargando informe...'
  },

  // Buttons
  buttons: {
    cancel: 'Cancelar',
    save: 'Guardar',
    create: 'Crear',
    update: 'Actualizar',
    delete: 'Eliminar',
    edit: 'Editar',
    view: 'Ver',
    retry: 'Reintentar',
    close: 'Cerrar',
    back: 'Volver'
  },

  // Actions
  actions: {
    creating: 'Creando...',
    updating: 'Actualizando...',
    deleting: 'Eliminando...',
    retrying: 'Reintentando...',
    submitting: 'Enviando...'
  },

  // Project Form
  projectForm: {
    nameLabel: 'Nombre del Proyecto',
    namePlaceholder: 'Ej: Análisis de mercado residencial',
    descriptionLabel: 'Descripción',
    descriptionPlaceholder: 'Describe el propósito y objetivos del proyecto...',
    characterCount: 'caracteres',
    createProject: 'Crear Proyecto',
    updateProject: 'Actualizar Proyecto'
  },

  // Status
  status: {
    pending: 'Pendiente',
    inProgress: 'En Progreso',
    completed: 'Completado',
    failed: 'Fallido',
    cancelled: 'Cancelado'
  }
} as const;

export type UITexts = typeof uiTexts;
