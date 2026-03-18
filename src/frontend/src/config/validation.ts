/**
 * Catálogo centralizado de mensajes de validación
 * Regla R2: Cero hardcoding - todos los mensajes de validación deben estar centralizados
 */

export const validationMessages = {
  // Mensajes generales
  required: 'Este campo es requerido',
  optional: 'Campo opcional',

  // Longitud
  minLength: (min: number) => `Debe tener al menos ${min} caracteres`,
  maxLength: (max: number) => `No puede exceder ${max} caracteres`,
  exactLength: (length: number) => `Debe tener exactamente ${length} caracteres`,

  // Números
  minNumber: (min: number) => `Debe ser mayor o igual a ${min}`,
  maxNumber: (max: number) => `Debe ser menor o igual a ${max}`,
  positiveNumber: 'Debe ser un número positivo',
  integer: 'Debe ser un número entero',

  // Email
  emailInvalid: 'El correo electrónico no es válido',
  emailRequired: 'El correo electrónico es requerido',

  // URL
  urlInvalid: 'La URL no es válida',

  // Patrones
  patternMismatch: 'El formato no es válido',

  // Selección
  minItems: (min: number) => `Debe seleccionar al menos ${min} elementos`,
  maxItems: (max: number) => `Debe seleccionar como máximo ${max} elementos`,

  // Fechas
  dateInvalid: 'La fecha no es válida',
  dateMin: 'La fecha debe ser posterior a la fecha mínima',
  dateMax: 'La fecha debe ser anterior a la fecha máxima',
  dateRangeInvalid: 'El rango de fechas no es válido',

  // Archivos
  fileRequired: 'Debe seleccionar un archivo',
  fileInvalidType: 'El tipo de archivo no es válido',
  fileTooLarge: (maxSize: string) => `El archivo excede el tamaño máximo de ${maxSize}`,
  fileTooSmall: (minSize: string) => `El archivo es menor que el tamaño mínimo de ${minSize}`,

  // Contraseñas
  passwordTooShort: (min: number) => `La contraseña debe tener al menos ${min} caracteres`,
  passwordTooWeak: 'La contraseña debe incluir mayúsculas, minúsculas y números',
  passwordMismatch: 'Las contraseñas no coinciden',

  // Campos específicos del proyecto
  projectName: {
    required: 'El nombre es requerido',
    tooShort: 'El nombre debe tener al menos 3 caracteres',
    tooLong: 'El nombre no puede exceder 100 caracteres'
  },
  projectDescription: {
    required: 'La descripción es requerida',
    tooShort: 'La descripción debe tener al menos 10 caracteres',
    tooLong: 'La descripción no puede exceder 1000 caracteres'
  },

  // Etiquetas de formulario
  labels: {
    required: 'Campo requerido',
    optional: 'Opcional'
  },

  // Caracteres
  characterCount: (current: number, max: number) => `${current} / ${max} caracteres`
} as const;

export type ValidationMessages = typeof validationMessages;
