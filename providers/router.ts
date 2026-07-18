import type { VisionProvider } from "./types";
import type { AnalysisResult } from "@/types";
import { GeminiProvider, ProviderError } from "./gemini";
import { OllamaProvider } from "./ollama";
import { NvidiaProvider } from "./nvidia";

const RETRIABLE_STATUS_CODES = new Set([429, 500, 503]);
const RETRY_DELAY_MS = 1_000;
const PER_PROVIDER_TIMEOUT_MS = 25_000;

export class ProviderRouter {
  private providers: VisionProvider[] = [];

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    const order = process.env.AI_PROVIDER_ORDER || "nvidia,gemini,ollama";
    const names = order.split(",").map((s) => s.trim().toLowerCase());

    const registry: Record<string, () => VisionProvider> = {
      gemini: () => new GeminiProvider(),
      ollama: () => new OllamaProvider(),
      nvidia: () => new NvidiaProvider(),
    };

    for (const name of names) {
      const factory = registry[name];
      if (factory) {
        try {
          this.providers.push(factory());
        } catch {
          // Provider config missing — skip it
        }
      }
    }

    if (this.providers.length === 0) {
      throw new Error("No AI providers configured. Set at least one API key in environment variables.");
    }
  }

  async analyze(imageBase64: string, mimeType: string): Promise<{ result: AnalysisResult; providerUsed: string }> {
    const errors: string[] = [];
    for (const provider of this.providers) {
      for (let attempt = 0; attempt < 2; attempt++) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), PER_PROVIDER_TIMEOUT_MS);
        try {
          const result = await provider.analyze(imageBase64, mimeType, controller.signal);
          clearTimeout(timeout);
          return { result, providerUsed: provider.name };
        } catch (err) {
          clearTimeout(timeout);
          if (err instanceof ProviderError) {
            const shouldRetry = attempt === 0 && RETRIABLE_STATUS_CODES.has(err.statusCode);
            if (shouldRetry) {
              console.warn(`[ProviderRouter] ${provider.name} failed with ${err.statusCode} (attempt ${attempt + 1}): ${err.message}, retrying in ${RETRY_DELAY_MS}ms...`);
              await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
              continue;
            }
            errors.push(`${provider.name}: ${err.message}`);
            console.warn(`[ProviderRouter] ${provider.name} failed: ${err.message}`);
          } else {
            const msg = err instanceof Error ? err.message : String(err);
            errors.push(`${provider.name}: ${msg}`);
            console.warn(`[ProviderRouter] ${provider.name} failed with unexpected error:`, err);
          }
          break;
        }
      }
    }

    throw new Error(
      `All AI providers are currently unavailable. Please try again later. Details: ${errors.join(" | ")}`
    );
  }

  async getProviderStatuses(): Promise<Array<{ provider: string; available: boolean; latency: number; lastChecked: number }>> {
    const results = [];
    for (const provider of this.providers) {
      const start = Date.now();
      let available = false;
      try {
        available = await provider.healthCheck();
      } catch {
        available = false;
      }
      results.push({
        provider: provider.name,
        available,
        latency: Date.now() - start,
        lastChecked: Date.now(),
      });
    }
    return results;
  }
}
