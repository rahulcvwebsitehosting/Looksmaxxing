import type { VisionProvider } from "./types";
import type { AnalysisResult } from "@/types";
import { GeminiProvider, ProviderError } from "./gemini";
import { OllamaProvider } from "./ollama";
import { NvidiaProvider } from "./nvidia";

export class ProviderRouter {
  private providers: VisionProvider[] = [];

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    const order = process.env.AI_PROVIDER_ORDER || "gemini,ollama,nvidia";
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
    for (const provider of this.providers) {
      for (let attempt = 0; attempt < 2; attempt++) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30_000);
        try {
          const result = await provider.analyze(imageBase64, mimeType, controller.signal);
          clearTimeout(timeout);
          return { result, providerUsed: provider.name };
        } catch (err) {
          clearTimeout(timeout);
          if (err instanceof ProviderError) {
            if (attempt === 0) {
              console.warn(`[ProviderRouter] ${provider.name} failed (attempt ${attempt + 1}): ${err.message}, retrying...`);
              continue;
            }
            console.warn(`[ProviderRouter] ${provider.name} failed: ${err.message}`);
          } else {
            console.warn(`[ProviderRouter] ${provider.name} failed with unexpected error:`, err);
          }
          break;
        }
      }
    }

    throw new Error("All AI providers are currently unavailable. Please try again later.");
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