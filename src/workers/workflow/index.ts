/**
 * Workflow Worker - Analysis Workflow
 *
 * This worker orchestrates the 9-step analysis workflow for property analysis.
 * It integrates with OpenAI API using the Responses API for each analysis step.
 *
 * Workflow Steps:
 * 1. Property Summary (Resumen del inmueble)
 * 2. Key Property Data (Datos clave del inmueble)
 * 3. Physical Analysis (Análisis físico)
 * 4. Strategic Analysis (Análisis estratégico)
 * 5. Financial Analysis (Análisis financiero)
 * 6. Regulatory Analysis (Análisis regulatorio)
 * 7. Investor Reading (Lectura para inversor)
 * 8. Entrepreneur Reading (Lectura para emprendedor)
 * 9. Owner Reading (Lectura para propietario)
 */

import { WorkflowEntrypoint } from "cloudflare:workers";
import { WorkflowOrchestrator } from "./orchestration";

/**
 * Environment bindings for the Workflow Worker
 */
export interface Env {
  /** Workflow binding for AnalysisWorkflow */
  ANALYSIS_WORKFLOW: Workflow;
  /** KV namespace for secrets (OpenAI API key) */
  CF_B_KV_SECRETS: KVNamespace;
  /** D1 database for instructions and results */
  CF_B_DB_INMO: D1Database;
  /** R2 bucket for storing analysis results */
  CF_B_R2_INMO: R2Bucket;
}

/**
 * Parameters for the Analysis Workflow
 */
export interface Params {
  /** Project ID from D1 database */
  projectId: string;
  /** Property JSON data (I-JSON format) */
  propertyData: Record<string, unknown>;
  /** User ID who initiated the workflow */
  userId?: string;
}

/**
 * Analysis Workflow Class
 *
 * Orchestrates the 9-step property analysis workflow using Cloudflare Workflows.
 * Each step calls OpenAI API with instructions from the D1 database.
 */
export class AnalysisWorkflow extends WorkflowEntrypoint<Env, Params> {
  /**
   * Main workflow execution method
   *
   * @param event - Workflow event containing parameters and instance ID
   * @param step - Workflow step for executing workflow logic
   * @returns Array of workflow steps (for workflow orchestration)
   */
  async run(event: any, step: any): Promise<any[]> {
    const { projectId, propertyData } = event.params;

    // Step 1: Get OpenAI API key from KV
    const apiKey = await step.do("get-openai-api-key", async () => {
      const key = await this.env.CF_B_KV_SECRETS.get("OPENAI_API_KEY");
      if (!key) {
        throw new Error("OpenAI API key not found in KV namespace");
      }
      return key;
    });

    // Step 2: Execute workflow orchestration
    await step.do("execute-workflow-orchestration", async () => {
      const orchestrator = new WorkflowOrchestrator(
        this.env,
        projectId,
        propertyData,
        apiKey
      );
      return await orchestrator.execute();
    });

    // Return empty array to complete workflow
    return [];
  }
}

/**
 * Default export for Cloudflare Workers
 *
 * This is required for Cloudflare Workers to recognize the workflow class.
 */
export default {
  async fetch(_request: Request, _env: Env): Promise<Response> {
    const url = new URL(_request.url);
    
    // Health check endpoint
    if (url.pathname === "/health") {
      return Response.json({
        status: "ok",
        workflow: "AnalysisWorkflow",
        timestamp: new Date().toISOString(),
      });
    }

    return new Response("Workflow Worker - Use the API Worker to trigger workflows", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  },
};
