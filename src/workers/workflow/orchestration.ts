/**
 * Workflow Orchestration - Analysis Workflow Logic
 *
 * Orchestrates the 9-step property analysis workflow.
 * Handles execution creation, step execution, state management, and error handling.
 */

import { WorkflowService, ExecutionState, StepState, ProjectState, StepType } from "./services/workflow.service";
import { OpenAIService } from "./services/openai.service";
import { Env } from "./index";

/**
 * Step execution result
 */
export interface StepExecutionResult {
  stepId: string;
  stepType: StepType;
  order: number;
  success: boolean;
  markdownContent?: string;
  r2Path?: string;
  errorMessage?: string;
}

/**
 * Workflow execution result
 */
export interface WorkflowExecutionResult {
  executionId: string;
  projectId: string;
  success: boolean;
  steps: StepExecutionResult[];
  errorMessage?: string;
}

/**
 * Workflow Orchestrator Class
 *
 * Orchestrates the 9-step analysis workflow with proper state management
 * and error handling.
 */
export class WorkflowOrchestrator {
  private workflowService: WorkflowService;
  private openaiService: OpenAIService;
  private projectId: string;
  private executionId: string;
  // @ts-expect-error - propertyData is kept for API compatibility but not used directly
  private _propertyData: Record<string, unknown>;
  private logMessages: string[] = [];
  private previousMarkdowns: Map<StepType, string> = new Map();

  constructor(
    private env: Env,
    projectId: string,
    _propertyData: Record<string, unknown>,
    _apiKey: string
  ) {
    this.workflowService = new WorkflowService(env.CF_B_DB_INMO);
    this.openaiService = new OpenAIService(env.CF_B_KV_SECRETS);
    this.projectId = projectId;
    this._propertyData = _propertyData;
    this.executionId = "";
  }

  /**
   * Execute the complete workflow
   *
   * @returns Workflow execution result
   */
  async execute(): Promise<WorkflowExecutionResult> {
    try {
      this.log("Starting workflow execution");

      // Step 1: Create execution in D1
      const execution = await this.workflowService.createExecution(this.projectId);
      this.executionId = execution.id;
      this.log(`Created execution: ${this.executionId}`);

      // Step 2: Update project state to processing
      await this.workflowService.updateProjectState(this.projectId, ProjectState.PROCESANDO_ANALISIS);
      this.log(`Updated project state to: ${ProjectState.PROCESANDO_ANALISIS}`);


      // Step 3: Update execution state to running
      await this.workflowService.updateExecutionState(this.executionId, ExecutionState.EN_EJECUCION);
      this.log(`Updated execution state to: ${ExecutionState.EN_EJECUCION}`);

      // Step 4: Create 9 steps in D1
      const steps = await this.workflowService.createSteps(this.executionId);
      this.log(`Created ${steps.length} steps`);

      // Step 5: Execute steps sequentially
      const stepResults: StepExecutionResult[] = [];
      let hasError = false;

      for (const step of steps) {
        const result = await this.executeStep(step);
        stepResults.push(result);

        if (!result.success) {
          hasError = true;
          this.log(`Step ${step.orden} failed: ${result.errorMessage}`);
          break; // Stop execution on error
        }
      }

      // Step 6: Update final states
      if (hasError) {
        await this.handleWorkflowError(stepResults);
      } else {
        await this.handleWorkflowSuccess(stepResults);
      }

      // Step 7: Store log in R2
      await this.storeLogInR2();

      return {
        executionId: this.executionId,
        projectId: this.projectId,
        success: !hasError,
        steps: stepResults,
        errorMessage: hasError ? stepResults.find(r => !r.success)?.errorMessage : undefined,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      this.log(`Workflow execution failed: ${errorMessage}`);

      // Try to update states even on error
      try {
        await this.workflowService.updateExecutionState(
          this.executionId,
          ExecutionState.FINALIZADA_CON_ERROR,
          errorMessage
        );
        await this.workflowService.updateProjectState(this.projectId, ProjectState.ANALISIS_CON_ERROR);
      } catch (updateError) {
        this.log(`Failed to update error states: ${updateError}`);
      }

      return {
        executionId: this.executionId,
        projectId: this.projectId,
        success: false,
        steps: [],
        errorMessage,
      };
    }
  }

  /**
   * Execute a single step
   *
   * @param step - Step record
   * @returns Step execution result
   */
  private async executeStep(step: { id: string; tipo_paso: StepType; orden: number }): Promise<StepExecutionResult> {
    this.log(`Executing step ${step.orden}: ${step.tipo_paso}`);

    try {
      // Update step state to executing
      await this.workflowService.updateStepState(step.id, StepState.EN_EJECUCION);

      // Get instruction from D1
      const instruction = await this.workflowService.getInstructionByStepType(step.tipo_paso);
      if (!instruction) {
        throw new Error(`Instruction not found for step type: ${step.tipo_paso}`);
      }

      // Read I-JSON from R2
      const iJson = await this.readIJsonFromR2();

      // Call OpenAI API using OpenAIService
      const result = await this.openaiService.callOpenAI(
        step.tipo_paso,
        iJson,
        instruction.prompt_desarrollador,
        this.previousMarkdowns
      );

      if (!result.success || !result.markdownContent) {
        throw new Error(result.errorMessage || "Failed to generate Markdown content");
      }

      const markdownContent = result.markdownContent;

      // Store report in R2
      const r2Path = await this.storeReportInR2(step.tipo_paso, markdownContent);

      // Store Markdown for subsequent steps
      this.previousMarkdowns.set(step.tipo_paso, markdownContent);

      // Update step state to correct
      await this.workflowService.updateStepState(
        step.id,
        StepState.CORRECTO,
        undefined,
        r2Path
      );

      this.log(`Step ${step.orden} completed successfully`);

      return {
        stepId: step.id,
        stepType: step.tipo_paso,
        order: step.orden,
        success: true,
        markdownContent,
        r2Path,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      this.log(`Step ${step.orden} failed: ${errorMessage}`);

      // Update step state to error
      await this.workflowService.updateStepState(
        step.id,
        StepState.ERROR,
        errorMessage
      );

      return {
        stepId: step.id,
        stepType: step.tipo_paso,
        order: step.orden,
        success: false,
        errorMessage,
      };
    }
  }

  /**
   * Handle workflow success
   *
   * @param _stepResults - Array of step execution results
   */
  private async handleWorkflowSuccess(_stepResults: StepExecutionResult[]): Promise<void> {
    this.log("Workflow completed successfully");

    // Update execution state
    await this.workflowService.updateExecutionState(
      this.executionId,
      ExecutionState.FINALIZADA_CORRECTAMENTE
    );

    // Update project state
    await this.workflowService.updateProjectState(
      this.projectId,
      ProjectState.ANALISIS_FINALIZADO
    );
  }

  /**
   * Handle workflow error
   *
   * @param stepResults - Array of step execution results
   */
  private async handleWorkflowError(stepResults: StepExecutionResult[]): Promise<void> {
    const failedStep = stepResults.find(r => !r.success);
    const errorMessage = failedStep?.errorMessage || "Unknown error";

    this.log(`Workflow failed: ${errorMessage}`);

    // Update execution state
    await this.workflowService.updateExecutionState(
      this.executionId,
      ExecutionState.FINALIZADA_CON_ERROR,
      errorMessage
    );

    // Update project state
    await this.workflowService.updateProjectState(
      this.projectId,
      ProjectState.ANALISIS_CON_ERROR
    );
  }

  /**
   * Read I-JSON from R2
   *
   * @returns I-JSON content
   */
  private async readIJsonFromR2(): Promise<Record<string, unknown>> {
    const key = `dir-api-inmo/${this.projectId}/${this.projectId}.json`;
    const object = await this.env.CF_B_R2_INMO.get(key);

    if (!object) {
      throw new Error(`I-JSON not found in R2: ${key}`);
    }

    const content = await object.text();
    return JSON.parse(content) as Record<string, unknown>;
  }

  /**
   * Store report in R2
   *
   * @param stepType - Step type
   * @param markdownContent - Markdown content to store
   * @returns R2 path
   */
  private async storeReportInR2(stepType: StepType, markdownContent: string): Promise<string> {
    const key = `dir-api-inmo/${this.projectId}/${stepType}.md`;
    
    await this.env.CF_B_R2_INMO.put(key, markdownContent, {
      httpMetadata: {
        contentType: "text/markdown",
      },
    });

    return key;
  }

  /**
   * Store log in R2
   */
  private async storeLogInR2(): Promise<void> {
    const key = `dir-api-inmo/${this.projectId}/log.txt`;
    const logContent = this.logMessages.join("\n");
    
    await this.env.CF_B_R2_INMO.put(key, logContent, {
      httpMetadata: {
        contentType: "text/plain",
      },
    });
  }

  /**
   * Add log message
   *
   * @param message - Log message
   */
  private log(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    this.logMessages.push(logMessage);
    console.log(logMessage);
  }
}
