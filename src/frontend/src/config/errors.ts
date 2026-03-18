/**
 * Catálogo centralizado de mensajes de error
 * Regla R2: Cero hardcoding - todos los mensajes de error deben estar centralizados
 */

export const errorMessages = {
  // Errores generales
  general: {
    unknown: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
    network: 'Error de conexión. Verifica tu conexión a internet.',
    timeout: 'La solicitud excedió el tiempo de espera. Por favor, intenta nuevamente.',
    unauthorized: 'No tienes autorización para realizar esta acción.',
    forbidden: 'No tienes permisos para acceder a este recurso.',
    notFound: 'El recurso solicitado no fue encontrado.'
  },

  // Errores de proyectos
  projects: {
    createFailed: 'Error al crear el proyecto. Por favor, intenta nuevamente.',
    updateFailed: 'Error al actualizar el proyecto. Por favor, intenta nuevamente.',
    deleteFailed: 'Error al eliminar el proyecto. Por favor, intenta nuevamente.',
    loadFailed: 'Error al cargar el proyecto. Por favor, intenta nuevamente.',
    listFailed: 'Error al cargar la lista de proyectos. Por favor, intenta nuevamente.',
    notFound: 'No se encontró el proyecto.',
    deleteConfirm: '¿Estás seguro de que deseas eliminar este proyecto?'
  },

  // Errores de resultados/informes
  results: {
    loadFailed: 'Error al cargar los informes. Por favor, intenta nuevamente.',
    reportLoadFailed: 'Error al cargar el informe. Por favor, intenta nuevamente.',
    reportGenerateFailed: 'Error al generar el informe. Por favor, intenta nuevamente.',
    retryFailed: 'Error al reintentar la operación. Por favor, intenta nuevamente.'
  },

  // Errores de workflow
  workflow: {
    startFailed: 'Error al iniciar el análisis. Por favor, intenta nuevamente.',
    executionFailed: 'Error durante la ejecución del análisis. Por favor, intenta nuevamente.',
    statusCheckFailed: 'Error al verificar el estado del análisis.',
    timeout: 'El análisis está tardando más de lo esperado.'
  },

  // Errores de validación
  validation: {
    required: 'Este campo es requerido',
    invalidFormat: 'El formato del campo es inválido',
    tooShort: 'El valor es demasiado corto',
    tooLong: 'El valor es demasiado largo',
    invalidEmail: 'El correo electrónico no es válido',
    invalidUrl: 'La URL no es válida',
    invalidNumber: 'El valor debe ser un número válido',
    minValue: 'El valor debe ser mayor o igual a {min}',
    maxValue: 'El valor debe ser menor o igual a {max}',
    minItems: 'Debe seleccionar al menos {min} elementos',
    maxItems: 'Debe seleccionar como máximo {max} elementos'
  },

  // Errores de formulario
  form: {
    nameRequired: 'El nombre es requerido',
    nameTooShort: 'El nombre debe tener al menos 3 caracteres',
    nameTooLong: 'El nombre no puede exceder 100 caracteres',
    descriptionRequired: 'La descripción es requerida',
    descriptionTooShort: 'La descripción debe tener al menos 10 caracteres',
    descriptionTooLong: 'La descripción no puede exceder 1000 caracteres'
  },

  // Errores de API
  api: {
    serverError: 'Error del servidor. Por favor, intenta nuevamente más tarde.',
    badRequest: 'La solicitud es inválida.',
    conflict: 'Ya existe un recurso con estos datos.',
    rateLimitExceeded: 'Has excedido el límite de solicitudes. Por favor, espera unos minutos.',
    serviceUnavailable: 'El servicio no está disponible en este momento.'
  },

  // Errores de almacenamiento
  storage: {
    quotaExceeded: 'Se ha excedido el espacio de almacenamiento.',
    saveFailed: 'Error al guardar los datos.',
    loadFailed: 'Error al cargar los datos.',
    deleteFailed: 'Error al eliminar los datos.'
  }
} as const;

export type ErrorMessages = typeof errorMessages;
