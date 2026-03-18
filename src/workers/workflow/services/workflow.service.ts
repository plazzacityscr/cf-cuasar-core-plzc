/**
 * Workflow Service - D1 Database Operations
 *
 * Service for managing workflow executions, steps, and project states in D1 database.
 * Handles creation, updates, and queries for the analysis workflow.
 */

import { D1Database } from "@cloudflare/workers-types";

/**
 * Execution state enum
 */
export enum ExecutionState {
  INICIADA = "iniciada",
  EN_EJECUCION = "en_ejecucion",
  FINALIZADA_CORRECTAMENTE = "finalizada_correctamente",
  FINALIZADA_CON_ERROR = "finalizada_con_error",
}

/**
 * Step state enum
 */
export enum StepState {
  PENDIENTE = "pendiente",
  EN_EJECUCION = "en_ejecucion",
  CORRECTO = "correcto",
  ERROR = "error",
}

/**
 * Project state enum
 */
export enum ProjectState {
  CREADO = "creado",
  PROCESANDO_ANALISIS = "procesando_analisis",
  ANALISIS_CON_ERROR = "analisis_con_error",
  ANALISIS_FINALIZADO = "analisis_finalizado",
}

/**
 * Step type enum - 9 analysis steps
 */
export enum StepType {
  RESUMEN = "resumen",
  DATOS_CLAVE = "datos_clave",
  ACTIVO_FISICO = "activo_fisico",
  ACTIVO_ESTRATEGICO = "activo_estrategico",
  ACTIVO_FINANCIERO = "activo_financiero",
  ACTIVO_REGULADO = "activo_regulado",
  LECTURA_INVERSOR = "lectura_inversor",
  LECTURA_EMPRENDEDOR = "lectura_emprendedor",
  LECTURA_PROPIETARIO = "lectura_propietario",
}

/**
 * Execution record from D1
 */
export interface ExecutionRecord {
  id: string;
  proyecto_id: string;
  estado: ExecutionState;
  fecha_inicio: string;
  fecha_fin?: string;
  error_mensaje?: string;
}

/**
 * Step record from D1
 */
export interface StepRecord {
  id: string;
  ejecucion_id: string;
  tipo_paso: StepType;
  orden: number;
  estado: StepState;
  fecha_inicio: string;
  fecha_fin?: string;
  error_mensaje?: string;
  ruta_archivo_r2?: string;
}

/**
 * Instruction record from D1
 */
export interface InstructionRecord {
  id: string;
  nombre: string;
  tipo_paso: StepType;
  orden: number;
  prompt_desarrollador: string;
  fecha_creacion: string;
}

/**
 * Workflow Service Class
 *
 * Handles all D1 database operations for workflow execution.
 */
export class WorkflowService {
  constructor(private db: D1Database) {}

  /**
   * Create a new execution record in D1
   *
   * @param projectId - Project ID
   * @returns Created execution record
   */
  async createExecution(projectId: string): Promise<ExecutionRecord> {
    const executionId = crypto.randomUUID();
    const now = new Date().toISOString();

    const result = await this.db
      .prepare(`
        INSERT INTO ani_ejecuciones (id, proyecto_id, estado, fecha_inicio)
        VALUES (?, ?, ?, ?)
      `)
      .bind(executionId, projectId, ExecutionState.INICIADA, now)
      .run();

    if (!result.success) {
      throw new Error(`Failed to create execution: ${result.error}`);
    }

    return {
      id: executionId,
      proyecto_id: projectId,
      estado: ExecutionState.INICIADA,
      fecha_inicio: now,
    };
  }

  /**
   * Update execution state
   *
   * @param executionId - Execution ID
   * @param state - New execution state
   * @param errorMessage - Optional error message
   * @returns Updated execution record
   */
  async updateExecutionState(
    executionId: string,
    state: ExecutionState,
    errorMessage?: string
  ): Promise<void> {
    const now = new Date().toISOString();
    const isFinished = state === ExecutionState.FINALIZADA_CORRECTAMENTE || 
                       state === ExecutionState.FINALIZADA_CON_ERROR;

    let query = `
      UPDATE ani_ejecuciones
      SET estado = ?, fecha_fin = ?
    `;
    const bindings: (string | null)[] = [state, isFinished ? now : null];

    if (errorMessage) {
      query += `, error_mensaje = ?`;
      bindings.push(errorMessage);
    }

    query += ` WHERE id = ?`;
    bindings.push(executionId);

    const result = await this.db.prepare(query).bind(...bindings).run();

    if (!result.success) {
      throw new Error(`Failed to update execution state: ${result.error}`);
    }
  }

  /**
   * Create 9 steps for an execution
   *
   * @param executionId - Execution ID
   * @returns Array of created step records
   */
  async createSteps(executionId: string): Promise<StepRecord[]> {
    const now = new Date().toISOString();
    const steps: StepRecord[] = [];

    // Define the 9 step types in order
    const stepTypes: StepType[] = [
      StepType.RESUMEN,
      StepType.DATOS_CLAVE,
      StepType.ACTIVO_FISICO,
      StepType.ACTIVO_ESTRATEGICO,
      StepType.ACTIVO_FINANCIERO,
      StepType.ACTIVO_REGULADO,
      StepType.LECTURA_INVERSOR,
      StepType.LECTURA_EMPRENDEDOR,
      StepType.LECTURA_PROPIETARIO,
    ];

    for (let i = 0; i < stepTypes.length; i++) {
      const stepId = crypto.randomUUID();
      const stepType = stepTypes[i];
      const order = i + 1;

      const result = await this.db
        .prepare(`
          INSERT INTO ani_pasos (id, ejecucion_id, tipo_paso, orden, estado, fecha_inicio)
          VALUES (?, ?, ?, ?, ?, ?)
        `)
        .bind(stepId, executionId, stepType, order, StepState.PENDIENTE, now)
        .run();

      if (!result.success) {
        throw new Error(`Failed to create step ${order}: ${result.error}`);
      }

      steps.push({
        id: stepId,
        ejecucion_id: executionId,
        tipo_paso: stepType,
        orden: order,
        estado: StepState.PENDIENTE,
        fecha_inicio: now,
      });
    }

    return steps;
  }

  /**
   * Update step state
   *
   * @param stepId - Step ID
   * @param state - New step state
   * @param errorMessage - Optional error message
   * @param r2Path - Optional R2 file path
   * @returns void
   */
  async updateStepState(
    stepId: string,
    state: StepState,
    errorMessage?: string,
    r2Path?: string
  ): Promise<void> {
    const now = new Date().toISOString();
    const isFinished = state === StepState.CORRECTO || state === StepState.ERROR;

    let query = `
      UPDATE ani_pasos
      SET estado = ?, fecha_fin = ?
    `;
    const bindings: (string | null)[] = [state, isFinished ? now : null];

    if (errorMessage) {
      query += `, error_mensaje = ?`;
      bindings.push(errorMessage);
    }

    if (r2Path) {
      query += `, ruta_archivo_r2 = ?`;
      bindings.push(r2Path);
    }

    query += ` WHERE id = ?`;
    bindings.push(stepId);

    const result = await this.db.prepare(query).bind(...bindings).run();

    if (!result.success) {
      throw new Error(`Failed to update step state: ${result.error}`);
    }
  }

  /**
   * Get step by execution ID and order
   *
   * @param executionId - Execution ID
   * @param order - Step order (1-9)
   * @returns Step record or null
   */
  async getStepByOrder(executionId: string, order: number): Promise<StepRecord | null> {
    const result = await this.db
      .prepare(`
        SELECT * FROM ani_pasos
        WHERE ejecucion_id = ? AND orden = ?
      `)
      .bind(executionId, order)
      .first();

    return result as StepRecord | null;
  }

  /**
   * Get all steps for an execution
   *
   * @param executionId - Execution ID
   * @returns Array of step records
   */
  async getStepsByExecution(executionId: string): Promise<StepRecord[]> {
    const result = await this.db
      .prepare(`
        SELECT * FROM ani_pasos
        WHERE ejecucion_id = ?
        ORDER BY orden ASC
      `)
      .bind(executionId)
      .all();

    return (result.results || []) as unknown as StepRecord[];
  }

  /**
   * Get instruction by step type
   *
   * @param stepType - Step type
   * @returns Instruction record or null
   */
  async getInstructionByStepType(stepType: StepType): Promise<InstructionRecord | null> {
    const result = await this.db
      .prepare(`
        SELECT * FROM ani_instrucciones
        WHERE tipo_paso = ?
        ORDER BY orden ASC
        LIMIT 1
      `)
      .bind(stepType)
      .first();

    return result as InstructionRecord | null;
  }

  /**
   * Get all instructions
   *
   * @returns Array of instruction records
   */
  async getAllInstructions(): Promise<InstructionRecord[]> {
    const result = await this.db
      .prepare(`
        SELECT * FROM ani_instrucciones
        ORDER BY orden ASC
      `)
      .all();

    return (result.results || []) as unknown as InstructionRecord[];
  }

  /**
   * Update project state
   *
   * @param projectId - Project ID
   * @param state - New project state
   * @returns void
   */
  async updateProjectState(projectId: string, state: ProjectState): Promise<void> {
    const now = new Date().toISOString();

    let query = `
      UPDATE ani_proyectos
      SET estado = ?, fecha_actualizacion = ?
    `;
    const bindings: string[] = [state, now];

    // Set analysis start/end dates based on state
    if (state === ProjectState.PROCESANDO_ANALISIS) {
      query += `, fecha_analisis_inicio = ?`;
      bindings.push(now);
    } else if (state === ProjectState.ANALISIS_FINALIZADO || 
               state === ProjectState.ANALISIS_CON_ERROR) {
      query += `, fecha_analisis_fin = ?`;
      bindings.push(now);
    }

    query += ` WHERE id = ?`;
    bindings.push(projectId);

    const result = await this.db.prepare(query).bind(...bindings).run();

    if (!result.success) {
      throw new Error(`Failed to update project state: ${result.error}`);
    }
  }

  /**
   * Get project by ID
   *
   * @param projectId - Project ID
   * @returns Project record or null
   */
  async getProject(projectId: string): Promise<any | null> {
    const result = await this.db
      .prepare(`
        SELECT * FROM ani_proyectos
        WHERE id = ?
      `)
      .bind(projectId)
      .first();

    return result;
  }

  /**
   * Get execution by ID
   *
   * @param executionId - Execution ID
   * @returns Execution record or null
   */
  async getExecution(executionId: string): Promise<ExecutionRecord | null> {
    const result = await this.db
      .prepare(`
        SELECT * FROM ani_ejecuciones
        WHERE id = ?
      `)
      .bind(executionId)
      .first();

    return result as ExecutionRecord | null;
  }
}
