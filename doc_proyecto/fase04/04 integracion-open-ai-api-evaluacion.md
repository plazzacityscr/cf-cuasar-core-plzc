# Evaluación: Integración con OpenAI API

> **Documento:** FASE 4 — Evaluación de Integración con OpenAI API  
> **Fuente principal:** [`04 integracion-open-ai-api.md`](./04%20integracion-open-ai-api.md)  
> **Versión:** 1.0  
> **Fecha:** 2026-03-18

---

## Resumen Ejecutivo

El documento de integración con OpenAI API recomienda un cambio significativo en la arquitectura del proyecto:

**Cambio principal:** Usar **Cloudflare Workflows con Responses API de OpenAI** en lugar de la implementación original de ejecución manual.

**Impacto:** Este cambio afecta la arquitectura, el modelo de datos, los diagramas de secuencia, el contrato de API y las tareas de implementación.

---

## Análisis de la Recomendación

### Arquitectura Recomendada

#### Componentes Principales

| Componente | Tecnología | Descripción |
|-------------|-------------|-------------|
| **Orquestación** | Cloudflare Workflows | Encadenar 9 pasos lógicos con reintentos automáticos y persistencia de estado |
| **Configuración de Instrucciones** | D1 Database | Almacenar configuración editable de cada instrucción (modelo, temperatura, prompt) |
| **Almacenamiento de I/O** | R2 Bucket | Guardar JSON original, Markdowns generados y logs de auditoría |
| **Secrets** | Workers KV | Almacenar clave de API de OpenAI |
| **Integración OpenAI** | Responses API | Usar `instructions` + `input` para generación de texto |

#### Flujo de Ejecución

```
1. Workflow inicia → 2. Lee configuración de instrucción desde D1
3. Lee I-JSON desde R2 → 4. Llama a OpenAI con instructions + input
5. Guarda Markdown en R2 → 6. Actualiza estado en D1
7. Repite para pasos 2-9 → 8. Actualiza estado final del proyecto
```

---

## Impacto en Documentación Existente

### Documentos que Requieren Modificación

#### 1. Arquitectura del Sistema

**Archivo:** [`doc_proyecto/fase03/01 architecture.md`](../fase03/01%20architecture.md)

**Cambios requeridos:**

| Sección | Cambio | Justificación |
|---------|---------|---------------|
| **Arquitectura de Backend** | Actualizar para usar Cloudflare Workflows | El workflow ahora es orquestado por Cloudflare Workflows en lugar de ejecución manual |
| **Componentes de Integración** | Añadir Workers KV para configuración de instrucciones | La configuración editable de instrucciones requiere almacenamiento en KV o D1 |
| **Flujo de Ejecución** | Actualizar diagrama de flujo con Cloudflare Workflows | El flujo ahora usa Workflows con Responses API |
| **Manejo de Errores** | Actualizar para incluir reintentos automáticos de Workflows | Cloudflare Workflows maneja reintentos automáticamente |

---

#### 2. Diagramas de Secuencia

**Archivo:** [`doc_proyecto/fase03/04 sequence-diagrams.md`](../fase03/04%20sequence-diagrams.md)

**Cambios requeridos:**

| Diagrama | Cambio | Justificación |
|----------|---------|---------------|
| **Ejecución de Workflow** | Actualizar para mostrar orquestación con Cloudflare Workflows | El flujo ahora usa Workflows en lugar de ejecución manual |
| **Integración con OpenAI** | Actualizar para mostrar Responses API | La integración ahora usa Responses API en lugar de llamadas directas |
| **Gestión de Configuración** | Añadir diagrama de lectura de configuración desde D1 | Las instrucciones ahora se configuran en D1 |
| **Almacenamiento de Resultados** | Actualizar para mostrar almacenamiento en R2 | Los resultados ahora se guardan en R2 |

---

#### 3. Especificación del Feature

**Archivo:** [`doc_proyecto/fase02/01 feature-workflow-analisis.spec.md`](../fase02/01%20feature-workflow-analisis.spec.md)

**Cambios requeridos:**

| Sección | Cambio | Justificación |
|---------|---------|---------------|
| **Requisitos Funcionales** | Actualizar para incluir configuración editable de instrucciones | Las instrucciones ahora son configurables en D1 |
| **Flujo de Ejecución** | Actualizar para describir orquestación con Cloudflare Workflows | El flujo ahora usa Workflows con Responses API |
| **Requisitos No Funcionales** | Añadir requisitos de idempotencia y reintentos | Cloudflare Workflows requiere que cada paso sea idempotente |
| **Requisitos de Configuración** | Añadir requisitos de gestión de configuración de instrucciones | Las instrucciones ahora se configuran en D1 |

---

#### 4. Contrato de API

**Archivo:** [`doc_proyecto/fase02/02 api-contract.md`](../fase02/02%20api-contract.md)

**Cambios requeridos:**

| Sección | Cambio | Justificación |
|---------|---------|---------------|
| **Endpoints de Workflows** | Actualizar para incluir endpoints de configuración de instrucciones | Se necesitan nuevos endpoints para gestionar configuración |
| **Modelo de Datos** | Actualizar para incluir tabla de instrucciones | Se necesita una nueva tabla para almacenar configuración de instrucciones |
| **Contratos de Respuesta** | Actualizar para incluirResponses API de OpenAI | La integración ahora usa Responses API |

---

#### 5. Tareas de Implementación

**Archivo:** [`doc_proyecto/fase04/02 sprints-tasks.md`](./02%20sprints-tasks.md)

**Cambios requeridos en Sprint 3:**

| Tarea | Cambio | Justificación |
|--------|---------|---------------|
| **3.1: Configurar Proyecto Cloudflare Workflows** | Actualizar para usar Responses API de OpenAI | La integración ahora usa Responses API |
| **3.2: Implementar Lógica de Orquestación** | Actualizar para leer configuración desde D1 | Las instrucciones ahora se configuran en D1 |
| **3.3: Implementar Integración con OpenAI** | Actualizar para usar Responses API | La integración ahora usa Responses API en lugar de llamadas directas |
| **3.4: Implementar Almacenamiento de Resultados** | Actualizar para guardar JSON y Markdowns en R2 | Los resultados ahora se guardan en R2 |
| **3.5: Implementar Manejo de Errores en Workflow** | Actualizar para incluir idempotencia | Cloudflare Workflows requiere que cada paso sea idempotente |

---

## Cambios en Modelo de Datos

### Nueva Tabla Requerida

**Tabla:** `ani_instrucciones` (en D1)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INTEGER PRIMARY KEY | Identificador único de la instrucción |
| `nombre` | TEXT | Nombre de la instrucción (ej: "resumen_ejecutivo_inmueble") |
| `version` | INTEGER | Versión de la instrucción |
| `activa` | BOOLEAN | Estado activo de la instrucción |
| `modelo` | TEXT | Modelo de OpenAI a usar (ej: "gpt-4o-mini") |
| `temperatura` | REAL | Temperatura para la respuesta (ej: 0.7) |
| `maximo_tokens_salida` | INTEGER | Máximo de tokens de salida (ej: 4000) |
| `formato_salida` | TEXT | Formato de salida (ej: "markdown") |
| `tipo_entrada` | TEXT | Tipo de entrada (ej: "json", "json_mas_markdown") |
| `prompt_desarrollador` | TEXT | Texto del prompt desarrollador |
| `notas` | TEXT | Notas de cambio |
| `fecha_vigencia` | TEXT | Fecha de vigencia de la instrucción |
| `fecha_creacion` | TEXT | Fecha de creación de la instrucción |
| `fecha_actualizacion` | TEXT | Fecha de última actualización |

### Actualización de Tablas Existentes

**Tabla:** `ani_pasos`

| Campo | Cambio | Justificación |
|-------|---------|---------------|
| `configuracion_id` | Añadir campo INTEGER | Referencia a la instrucción configurada en `ani_instrucciones` |
| `entrada_ruta` | Añadir campo TEXT | Ruta del JSON de entrada en R2 |
| `salida_ruta` | Añadir campo TEXT | Ruta del Markdown de salida en R2 |
| `peticion_cruda` | Añadir campo TEXT | Petición cruda a OpenAI para auditoría |
| `respuesta_cruda` | Añadir campo TEXT | Respuesta cruda de OpenAI para auditoría |

---

## Preguntas para el Usuario

### 1. Aprobación de Cambios

¿Aprueba la recomendación de usar **Cloudflare Workflows con Responses API de OpenAI** en lugar de la implementación original?

**Opciones:**
- **Opción A:** Aprobar cambios recomendados (usar Cloudflare Workflows + Responses API)
- **Opción B:** Rechazar cambios y mantener implementación original
- **Opción C:** Solicitar evaluación adicional antes de decidir

---

### 2. Nombres de Recursos (R1)

Si se aprueban los cambios, se requieren los siguientes nombres:

| Recurso | Valor en Plan | Sugerencia | Justificación |
|----------|---------------|-------------|---------------|
| **Tabla de instrucciones** | `ani_instrucciones` | `ani_instrucciones` | Nombre sugerido en documento |
| **Workflow** | `wk-proceso-inmo` | `wk-proceso-inmo` | Ya confirmado |
| **Workers KV para configuración** | No especificado | `CF_KV_INSTRUCCIONES` | Para almacenar configuración de instrucciones |

---

### 3. Modelo de OpenAI

El documento de integración sugiere usar Responses API de OpenAI, pero no especifica el modelo exacto.

**Pregunta:** ¿Qué modelo de OpenAI usar para la generación de informes?

**Opciones:**
- **Opción A:** `gpt-4o-mini` (sugerido en documento original)
- **Opción B:** `gpt-4o` (más potente, más costoso)
- **Opción C:** `gpt-3.5-turbo` (más económico)

---

### 4. Configuración Inicial de Instrucciones

Si se aprueban los cambios, se requiere configurar las 9 instrucciones iniciales en D1.

**Pregunta:** ¿Desea configurar las 9 instrucciones iniciales ahora o más tarde?

**Instrucciones requeridas:**
1. `resumen_ejecutivo_inmueble` (paso 1)
2. `datos_clave_inmueble` (paso 2)
3. `activo_fisico` (paso 3)
4. `activo_estrategico` (paso 4)
5. `activo_financiero` (paso 5)
6. `activo_regulado` (paso 6)
7. `lectura_inversor` (paso 7)
8. `lectura_emprendedor` (paso 8)
9. `lectura_propietario` (paso 9)

---

## Recomendaciones de Implementación

### 1. Migración de Schema de Base de Datos

Si se aprueban los cambios, se requiere:

1. Crear archivo de migración `002-add-instrucciones-table.sql`
2. Añadir tabla `ani_instrucciones`
3. Modificar tabla `ani_pasos` para añadir nuevos campos
4. Ejecutar migración en D1

### 2. Actualización de Documentación

Si se aprueban los cambios, se requiere actualizar:

1. `doc_proyecto/fase03/01 architecture.md`
2. `doc_proyecto/fase03/04 sequence-diagrams.md`
3. `doc_proyecto/fase02/01 feature-workflow-analisis.spec.md`
4. `doc_proyecto/fase02/02 api-contract.md`
5. `doc_proyecto/fase04/02 sprints-tasks.md`

### 3. Implementación de Sprint 3

Si se aprueban los cambios, el Sprint 3 debe actualizarse para:

1. Usar Cloudflare Workflows en lugar de ejecución manual
2. Implementar lectura de configuración desde D1
3. Implementar Responses API de OpenAI
4. Implementar almacenamiento en R2

---

## Referencias

| Referencia | Enlace |
|-----------|--------|
| Cloudflare Workflows Docs | https://developers.cloudflare.com/workflows/ |
| OpenAI Responses API | https://developers.openai.com/api/docs/guides/text/ |
| Cloudflare D1 | https://developers.cloudflare.com/d1/ |
| Cloudflare R2 | https://developers.cloudflare.com/r2/ |
| Cloudflare Workers KV | https://developers.cloudflare.com/kv/ |

---

## Conclusión

El documento de integración con OpenAI API recomienda un cambio significativo en la arquitectura del proyecto que afecta múltiples documentos de la fase 3 y fase 4.

**Próximos pasos:**
1. El usuario debe aprobar o rechazar los cambios recomendados
2. Si se aprueban, actualizar los documentos afectados
3. Si se aprueban, actualizar el modelo de datos
4. Si se aprueban, actualizar las tareas del Sprint 3
5. Si se aprueban, proceder con la implementación del Sprint 3

---

> **Nota:** Esta evaluación se ha generado basándose en el documento [`04 integracion-open-ai-api.md`](./04%20integracion-open-ai-api.md) y en la documentación existente del proyecto.
