/**
 * OpenAI Service - Integration with OpenAI Responses API
 *
 * Service for generating Markdown reports using OpenAI Responses API.
 * Handles API key retrieval, HTTP requests, rate limiting, timeouts,
 * and response processing for the 9-step property analysis workflow.
 */

import { StepType } from "./workflow.service";

/**
 * KV Namespace type for secrets storage
 */
export interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string; limit?: number }): Promise<{ keys: Array<{ name: string }> }>;
}

/**
 * OpenAI API Configuration
 */
export const OPENAI_CONFIG = {
  endpoint: "https://api.openai.com/v1/responses",
  model: "gpt-5.2",
  maxTokens: 4000,
  temperature: 0.7,
  timeout: 60000, // 60 seconds in milliseconds
  maxRetries: 3,
  retryBaseDelay: 1000, // 1 second base delay for exponential backoff
} as const;

/**
 * OpenAI API Request Body
 */
export interface OpenAIRequestBody {
  model: string;
  max_tokens: number;
  temperature: number;
  instructions: string;
  input: string | Record<string, unknown>;
}

/**
 * OpenAI API Response
 */
export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices?: Array<{
    index: number;
    message?: {
      role: string;
      content: string;
    };
    text?: string;
    finish_reason: string;
  }>;
  output?: Array<{
    type: string;
    text?: string;
    content?: Array<{
      type: string;
      text?: string;
    }>;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: {
    message: string;
    type: string;
    code?: string;
  };
}

/**
 * Step execution context
 */
export interface StepExecutionContext {
  stepType: StepType;
  iJson: Record<string, unknown>;
  instructionPrompt: string;
  previousMarkdowns?: Map<StepType, string>;
}

/**
 * Step execution result
 */
export interface StepExecutionResult {
  success: boolean;
  markdownContent?: string;
  errorMessage?: string;
  retryCount?: number;
}

/**
 * OpenAI Service Class
 *
 * Handles all interactions with OpenAI Responses API including
 * API key retrieval, request construction, rate limiting, and response processing.
 */
export class OpenAIService {
  private apiKey: string | null = null;

  constructor(private kvSecrets: KVNamespace) {}

  /**
   * Get OpenAI API Key from KV namespace
   *
   * Retrieves the API key from KV namespace `secrets-api-inmo` with key `OPENAI_API_KEY`.
   * Caches the key for subsequent calls to avoid repeated KV lookups.
   *
   * @returns OpenAI API key
   * @throws Error if API key is not found in KV
   */
  async getApiKey(): Promise<string> {
    if (this.apiKey) {
      return this.apiKey;
    }

    const apiKey = await this.kvSecrets.get("OPENAI_API_KEY");
    
    if (!apiKey) {
      throw new Error("OpenAI API key not found in KV namespace 'secrets-api-inmo'");
    }

    this.apiKey = apiKey;
    return apiKey;
  }

  /**
   * Build prompt for a specific step type
   *
   * Constructs the appropriate prompt based on the step type.
   * Steps 1-6 use only I-JSON as input.
   * Steps 7-9 use I-JSON plus previous Markdown outputs.
   *
   * @param context - Step execution context
   * @returns Complete prompt for OpenAI API
   */
  buildPrompt(context: StepExecutionContext): string {
    const { stepType, iJson, instructionPrompt, previousMarkdowns } = context;

    // Steps 1-6: Only I-JSON as input
    if (this.isJsonOnlyStep(stepType)) {
      return `${instructionPrompt}\n\nProperty data:\n${JSON.stringify(iJson, null, 2)}`;
    }

    // Steps 7-9: I-JSON + previous Markdowns
    if (!previousMarkdowns) {
      throw new Error(`Previous Markdowns required for step type: ${stepType}`);
    }

    let prompt = `${instructionPrompt}\n\n`;

    // Add I-JSON
    prompt += `<property_data>\n${JSON.stringify(iJson, null, 2)}\n</property_data>\n\n`;

    // Add relevant previous Markdowns
    const requiredPreviousSteps = this.getRequiredPreviousSteps(stepType);
    for (const prevStep of requiredPreviousSteps) {
      const markdown = previousMarkdowns.get(prevStep);
      if (markdown) {
        prompt += `<${prevStep}>\n${markdown}\n</${prevStep}>\n\n`;
      }
    }

    return prompt;
  }

  /**
   * Execute request to OpenAI API with retry logic
   *
   * Implements exponential backoff for rate limiting and transient errors.
   * Handles timeout and aborts request if it exceeds configured timeout.
   *
   * @param context - Step execution context
   * @returns Step execution result with Markdown content
   */
  async executeRequest(context: StepExecutionContext): Promise<StepExecutionResult> {
    const apiKey = await this.getApiKey();
    const prompt = this.buildPrompt(context);

    let lastError: Error | null = null;
    let retryCount = 0;

    for (retryCount = 0; retryCount <= OPENAI_CONFIG.maxRetries; retryCount++) {
      try {
        // Create AbortController for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), OPENAI_CONFIG.timeout);

        // Build request body
        const requestBody: OpenAIRequestBody = {
          model: OPENAI_CONFIG.model,
          max_tokens: OPENAI_CONFIG.maxTokens,
          temperature: OPENAI_CONFIG.temperature,
          instructions: context.instructionPrompt,
          input: prompt,
        };

        // Make HTTP request to OpenAI API
        const response = await fetch(OPENAI_CONFIG.endpoint, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "User-Agent": "wk-proceso-inmo",
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        // Clear timeout
        clearTimeout(timeoutId);

        // Handle response
        if (!response.ok) {
          const errorText = await response.text();
          const error = new Error(`OpenAI API error: ${response.status} - ${errorText}`);
          
          // Check if error is retryable
          if (this.isRetryableError(response.status, errorText)) {
            lastError = error;
            await this.delay(this.calculateBackoffDelay(retryCount));
            continue;
          }
          
          throw error;
        }

        // Parse response
        const data = (await response.json()) as OpenAIResponse;

        // Process response and extract Markdown
        const markdownContent = this.processResponse(data);

        return {
          success: true,
          markdownContent,
          retryCount,
        };

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Check if error is retryable
        if (error instanceof Error && this.isRetryableException(error)) {
          if (retryCount < OPENAI_CONFIG.maxRetries) {
            await this.delay(this.calculateBackoffDelay(retryCount));
            continue;
          }
        }

        // Non-retryable error or max retries exceeded
        break;
      }
    }

    // All retries exhausted
    return {
      success: false,
      errorMessage: lastError?.message || "Unknown error occurred",
      retryCount,
    };
  }

  /**
   * Process OpenAI API response and extract Markdown content
   *
   * Handles different response formats from OpenAI Responses API.
   * Extracts text content from various response structures.
   *
   * @param response - OpenAI API response
   * @returns Extracted Markdown content
   * @throws Error if response is invalid or contains an error
   */
  processResponse(response: OpenAIResponse): string {
    // Check for API error in response
    if (response.error) {
      throw new Error(`OpenAI API error: ${response.error.message}`);
    }

    // Try to extract content from different response formats
    // Format 1: choices array with message
    if (response.choices && response.choices.length > 0) {
      const choice = response.choices[0];
      if (choice.message?.content) {
        return choice.message.content;
      }
      if (choice.text) {
        return choice.text;
      }
    }

    // Format 2: output array
    if (response.output && response.output.length > 0) {
      const output = response.output[0];
      if (output.text) {
        return output.text;
      }
      if (output.content && output.content.length > 0) {
        const content = output.content[0];
        if (content.text) {
          return content.text;
        }
      }
    }

    throw new Error("Invalid response from OpenAI API: no content found");
  }

  /**
   * Check if step type uses only I-JSON as input (steps 1-6)
   *
   * @param stepType - Step type to check
   * @returns True if step uses only I-JSON
   */
  private isJsonOnlyStep(stepType: StepType): boolean {
    const jsonOnlySteps: StepType[] = [
      StepType.RESUMEN,
      StepType.DATOS_CLAVE,
      StepType.ACTIVO_FISICO,
      StepType.ACTIVO_ESTRATEGICO,
      StepType.ACTIVO_FINANCIERO,
      StepType.ACTIVO_REGULADO,
    ];
    return jsonOnlySteps.includes(stepType);
  }

  /**
   * Get required previous steps for a given step type
   *
   * Steps 7-9 require previous Markdown outputs:
   * - lectura_inversor: requires steps 1-6
   * - lectura_emprendedor: requires steps 1-7
   * - lectura_propietario: requires steps 1-8
   *
   * @param stepType - Step type to get required previous steps for
   * @returns Array of required previous step types
   */
  private getRequiredPreviousSteps(stepType: StepType): StepType[] {
    switch (stepType) {
      case StepType.LECTURA_INVERSOR:
        return [
          StepType.RESUMEN,
          StepType.DATOS_CLAVE,
          StepType.ACTIVO_FISICO,
          StepType.ACTIVO_ESTRATEGICO,
          StepType.ACTIVO_FINANCIERO,
          StepType.ACTIVO_REGULADO,
        ];
      case StepType.LECTURA_EMPRENDEDOR:
        return [
          StepType.RESUMEN,
          StepType.DATOS_CLAVE,
          StepType.ACTIVO_FISICO,
          StepType.ACTIVO_ESTRATEGICO,
          StepType.ACTIVO_FINANCIERO,
          StepType.ACTIVO_REGULADO,
          StepType.LECTURA_INVERSOR,
        ];
      case StepType.LECTURA_PROPIETARIO:
        return [
          StepType.RESUMEN,
          StepType.DATOS_CLAVE,
          StepType.ACTIVO_FISICO,
          StepType.ACTIVO_ESTRATEGICO,
          StepType.ACTIVO_FINANCIERO,
          StepType.ACTIVO_REGULADO,
          StepType.LECTURA_INVERSOR,
          StepType.LECTURA_EMPRENDEDOR,
        ];
      default:
        return [];
    }
  }

  /**
   * Check if HTTP error status is retryable
   *
   * @param status - HTTP status code
   * @param errorText - Error response text
   * @returns True if error is retryable
   */
  private isRetryableError(status: number, errorText: string): boolean {
    // Rate limit errors (429)
    if (status === 429) {
      return true;
    }

    // Server errors (5xx)
    if (status >= 500 && status < 600) {
      return true;
    }

    // Check for specific error types in error text
    const retryableErrorTypes = [
      "rate_limit_exceeded",
      "insufficient_quota",
      "timeout",
      "service_unavailable",
    ];

    return retryableErrorTypes.some(errorType => 
      errorText.toLowerCase().includes(errorType)
    );
  }

  /**
   * Check if exception is retryable
   *
   * @param error - Error to check
   * @returns True if exception is retryable
   */
  private isRetryableException(error: Error): boolean {
    // AbortError (timeout)
    if (error.name === "AbortError") {
      return true;
    }

    // Network errors
    const retryableErrorNames = [
      "NetworkError",
      "TimeoutError",
      "FetchError",
    ];

    return retryableErrorNames.includes(error.name);
  }

  /**
   * Calculate exponential backoff delay
   *
   * Implements exponential backoff with jitter to avoid thundering herd.
   * Delay = baseDelay * (2 ^ retryCount) + random jitter
   *
   * @param retryCount - Current retry attempt
   * @returns Delay in milliseconds
   */
  private calculateBackoffDelay(retryCount: number): number {
    const exponentialDelay = OPENAI_CONFIG.retryBaseDelay * Math.pow(2, retryCount);
    const jitter = Math.random() * 1000; // Up to 1 second of jitter
    return exponentialDelay + jitter;
  }

  /**
   * Delay execution for specified milliseconds
   *
   * @param ms - Milliseconds to delay
   * @returns Promise that resolves after delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Call OpenAI API for a specific step (convenience method)
   *
   * This is a convenience method that combines all the steps needed
   * to execute a single step in the workflow.
   *
   * @param stepType - Step type to execute
   * @param iJson - I-JSON property data
   * @param instructionPrompt - Instruction prompt from D1
   * @param previousMarkdowns - Optional map of previous Markdown outputs
   * @returns Step execution result
   */
  async callOpenAI(
    stepType: StepType,
    iJson: Record<string, unknown>,
    instructionPrompt: string,
    previousMarkdowns?: Map<StepType, string>
  ): Promise<StepExecutionResult> {
    const context: StepExecutionContext = {
      stepType,
      iJson,
      instructionPrompt,
      previousMarkdowns,
    };

    return await this.executeRequest(context);
  }
}
