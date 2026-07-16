import { buildAnalysisPrompt } from "@/prompt/analysis";
import { analysisResultSchema } from "@/lib/schemas";
import { extractJsonFromResponse } from "@/lib/index";
import type { VisionProvider } from "./types";
import type { AnalysisResult } from "@/types";
import { ProviderError } from "./gemini";

const REQUEST_TIMEOUT_MS = 12_000;

export class NvidiaProvider implements VisionProvider {
  readonly name = "nvidia";

  private getApiKey(): string {
    const key = process.env.NVIDIA_API_KEY;
    if (!key) throw new Error("NVIDIA_API_KEY is not configured");
    return key;
  }

  private getBaseUrl(): string {
    return process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
  }

  private getModel(): string {
    return process.env.NVIDIA_MODEL || "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning";
  }

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${this.getBaseUrl()}/models`, {
        headers: { Authorization: `Bearer ${this.getApiKey()}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async analyze(imageBase64: string, mimeType: string, signal?: AbortSignal): Promise<AnalysisResult> {
    const apiKey = this.getApiKey();
    const baseUrl = this.getBaseUrl();
    const model = this.getModel();
    const prompt = buildAnalysisPrompt();

    const body = {
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: `data:${mimeType};base64,${imageBase64}` } },
          ],
        },
      ],
      temperature: 0.4,
      max_tokens: 16384,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    if (signal) {
      signal.addEventListener("abort", () => controller.abort(), { once: true });
    }

    try {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        if (res.status === 429) {
          throw new ProviderError("NVIDIA: Rate limit exceeded", res.status);
        }
        if (res.status === 500 || res.status === 503) {
          throw new ProviderError("NVIDIA: Server error", res.status);
        }
        throw new ProviderError(`NVIDIA: HTTP ${res.status} - ${errorText.substring(0, 200)}`, res.status);
      }

      const data = await res.json();
      const rawText = data?.choices?.[0]?.message?.content;

      if (!rawText) {
        throw new ProviderError("NVIDIA: No text in response", 500);
      }

      const jsonStr = extractJsonFromResponse(rawText);
      const parsed = JSON.parse(jsonStr);
      return analysisResultSchema.parse(parsed);
    } catch (err) {
      if (controller.signal.aborted) {
        throw new ProviderError("NVIDIA: Request timed out", 504);
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }
}
