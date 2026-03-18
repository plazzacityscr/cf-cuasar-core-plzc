# Análisis: Contradicciones y Diferencias entre documentos

## Tabla de Contradicciones Reales

| ID | Aspecto | VaaIA_ConceptoProyecto.md | explico_LaIdea.md | Tipo | Estado |
|---|---------|------------------------|-------------------|------|--------|
| C-001 | Selección de operación de negocio | No menciona que el usuario elija operación. Asume que cada proyecto ejecuta siempre el mismo workflow (7 análisis fijos: Resumen, Datos clave, 4 planos, 3 perfiles). | "En cada proyecto eliges una única operación de negocio desde un desplegable." | **CONTRADICCIÓN** | Requiere aclaración |
| C-002 | Genericidad del sistema | Define el sistema de forma específica y concreta para análisis de inmuebles (7 análisis predefinidos, I-JSON, perfiles específicos). | Define el sistema como plataforma genérica de operaciones de negocio, funciones reutilizables, aplicable a cualquier cadena de procesos. | **TENSIÓN CONCEPTUAL** | Requiere aclaración |

---

## Tabla: Contenido en explico_LaIdea.md que NO está en VaaIA_ConceptoProyecto.md

| ID | Concepto | Descripción | Presencia en VaaID | Presencia en Explico |
|---|----------|-------------|------------------|-------------------|
| D-001 | Tabla de Pipeline / Historial técnico | Tabla específica y separada para registrar: qué función se ejecutó, cuándo empezó/terminó, si error o éxito, detalles para reconstruir. Separación explícita entre datos funcionales (proyecto) y traza técnica (pipeline). | Menciona "trazabilidad", "logs", "estado del PYT" pero NO define tabla de pipeline separada ni su estructura. | **Definido explícitamente** con detalle arquitectónico. |
| D-002 | Catálogo de Funciones (admin side) | Área administrativa previa donde se registran y gestionan funciones estándar reutilizables antes de que usuarios las utilicen. Diccionario de funciones. | No menciona existencia de zona administrativa ni catálogo previo de funciones. | **Definido como componente** de la arquitectura del sistema. |
| D-003 | Zona de definición de Operaciones de Negocio (admin side) | Sección dedicada donde se crean operaciones de negocio seleccionando funciones del catálogo y estableciendo orden de ejecución. | No menciona esta zona de definición. | **Definido como componente** del sistema. |
| D-004 | Ausencia explícita de Autenticación y Permisos (en MVP) | Menciona explícitamente: "No incluyes autenticación ni permisos en esta fase". | No menciona explícitamente la ausencia de autenticación. | **Mencionado explícitamente**. |
| D-005 | Metáfora y lenguaje conceptual | Usa lenguaje abstracto y de analogía ("piezas", "bloques", "encadenamiento") para explicar cómo funciona. | Usa lenguaje específico y técnico (I-JSON, workflow, step.do(), R2, D1, OpenAI API). | explico_LaIdea usa más **abstracción pedagógica**. |
| D-006 | Separación de responsabilidades usuario / admin | Define explícitamente dos espacios: administrador configura funciones/operaciones; usuario ordinario solo elige operación y rellena parámetros. | No hace esta separación explícita. Asume que el usuario ejecuta operaciones, pero no aclara quién configura qué. | **Separación clara en Explico**. |
| D-007 | Persistencia en D1 para "cualquier resultado" | Menciona que "incluso si el resultado es grande, se almacena en D1". | Especifica R2 para archivos Markdown, D1 para JSON de proyecto, pero no generaliza este principio. | Explico genera **principio genérico** de persistencia. |

---

## Tabla: Contenido en VaaIA_ConceptoProyecto.md que NO está en explico_LaIdea.md

| ID | Concepto | Descripción | Presencia en VaaID | Presencia en Explico |
|---|----------|-------------|------------------|-------------------|
| D-008 | Pares analíticos específicos (7 análisis concretos) | Define exactamente: Resumen, Datos clave, Activo físico, estratégico, financiero, regulado (primer trabajo); Inversor, Emprendedor/operador, Propietario (segundo trabajo). | **Definido en detalle**. | No menciona estos análisis específicos porque es genérico. |
| D-009 | I-JSON como estructura de entrada | Define el formato específico de entrada: extracción de datos de anuncio inmobiliario en forma de JSON estructurado (I-JSON). | **Definido explícitamente**. | Habla de "formularios con campos fijos" pero no del I-JSON como tal. |
| D-010 | Perfiles de cliente potencial (Inversor, Emprendedor, Propietario) | Los análisis se generan para tres perfiles específicos de usuario/cliente de la inmobiliaria. | **Definido como pilar**. | No menciona estos perfiles específicos. |
| D-011 | Alcance geográfico (València ciudad) | Especifica deliberadamente geográfica y municipalmente el alcance. | **Mencionado repetidamente**. | No aparece (es genérico). |
| D-012 | Criterios de negocio específicos (local comercial, reconversión, cambio de uso) | Define enfoque en inmuebles comerciales, reconversiones y cambios de uso. | **Definido como foco**. | No aparece (es genérico). |
| D-013 | Comportamiento ante reejecución | Define dos escenarios: reejecución normal (pregunta al usuario), reejecución por error previo (sin preguntar). Sobrescribe Markdown pero preserva JSON. | **Definido operativamente**. | No menciona política de reejecución. |
| D-014 | Estados específicos del proyecto (creado, procesando, error, finalizado) | Define cuatro estados específicos y gestión mediante tabla común de atributos/valores. | **Definido en detalle**. | No especifica estos estados (es genérico). |
| D-015 | Restricciones deliberadas del MVP (qué NO incluir) | Lista explícita y razonada de 15+ funcionalidades excluidas. | **Explícitamente negado**. | No menciona exclusiones (es genérico). |
| D-016 | Riesgos e incógnitas del proyecto (10+ puntos) | Enumera riesgos específicos: calidad input, normativa, complejidad regulatoria, ambigüedad de valor, etc. | **Definidos en detalle**. | No aparecen (es análisis genérico). |
| D-017 | Supuestos técnico-operativos explícitos | Lista 11+ supuestos realizados (ejecución completa o nada, ID de tabla PYT, carpeta exclusiva en R2, preservación JSON, sobrescritura de Markdown, etc.) | **Definidos claramente**. | No aparecen (es análisis genérico). |
| D-018 | Importancia de revisión humana como parte integral | Enfatiza que revisión humana es parte natural e integral del MVP, no como "etapa futura". | **Enfatizado**. | Mencionado pero con menos peso narrativo. |

---

## Resumen de Hallazgos

### Contradicciones Reales
- **C-001**: Existe contradicción sobre si usuario elige operación de negocio (explico_LaIdea dice sí, VaaIA_ConceptoProyecto no menciona esto).
- **C-002**: Existe tensión conceptual entre la genericidad de la plataforma vs. especificidad del caso de VaaIA.

### Diferencias Fundamentales (no contradicción, sino enfoque)
- **explico_LaIdea.md** es un análisis **abstracto, genérico y pedagógico** de la arquitectura tecnológica subyacente.
- **VaaIA_ConceptoProyecto.md** es una **especificación técnica concreta y específica** para el proyecto VaaIA.
- No son contradictorias, sino **complementarias pero en diferentes planos de abstracción**.

### Contenido Único
- **explico_LaIdea**: introduce tabla de pipeline, catálogo de funciones, zona admin, separación responsabilidades.
- **VaaIA_ConceptoProyecto**: define 7 análisis concretos, I-JSON, perfiles, geográfica, riesgos y supuestos específicos.

---

## Conclusión

Existe **UNA contradicción clara (C-001)** que requiere resolución: quién tiene control sobre qué operación de negocio se ejecuta en cada proyecto.

El resto son **diferencias de nivel de abstracción**, no contradicciones.

Ambos documentos son **verídicos en sus propios contextos**, pero necesitan alineamiento sobre el punto C-001.

