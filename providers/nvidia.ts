import { buildAnalysisPrompt } from "@/prompt/analysis";
import { analysisResultSchema } from "@/lib/schemas";
import { extractJsonFromResponse } from "@/lib/index";
import type { VisionProvider } from "./types";
import type { AnalysisResult } from "@/types";
import { ProviderError } from "./gemini";

const REQUEST_TIMEOUT_MS = 16_000;

export class NvidiaProvider implements VisionProvider {
  readonly name = "nvidia";

  constructor() {
    if (!process.env.NVIDIA_API_KEY) {
      throw new Error("NVIDIA_API_KEY is not configured");
    }
  }

  private getApiKey(): string {
    const key = process.env.NVIDIA_API_KEY;
    if (!key) throw new Error("NVIDIA_API_KEY is not configured");
    return key;
  }

  private getBaseUrl(): string {
    return process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
  }

  private getModel(): string {
    return process.env.NVIDIA_MODEL || "meta/llama-3.2-11b-vision-instruct";
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
      max_tokens: 2500,
      response_format: { type: "json_object" },
    };

    const controller = new AbortController();
    const onParentAbort = () => controller.abort();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    if (signal?.aborted) {
      controller.abort();
    } else if (signal) {
      signal.addEventListener("abort", onParentAbort, { once: true });
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
      let parsed: unknown;
      try {
        parsed = JSON.parse(jsonStr);
      } catch {
        throw new ProviderError("NVIDIA: Malformed JSON in model response", 500);
      }
      try {
        return analysisResultSchema.parse(parsed);
      } catch (err) {
        const detail = err instanceof Error ? err.message.substring(0, 300) : "schema mismatch";
        throw new ProviderError(`NVIDIA: Response failed schema validation: ${detail}`, 500);
      }
    } catch (err) {
      if (controller.signal.aborted) {
        throw new ProviderError(
          signal?.aborted
            ? "NVIDIA: Request cancelled by upstream caller"
            : "NVIDIA: Request timed out",
          504
        );
      }
      if (err instanceof ProviderError) throw err;
      throw new ProviderError(
        `NVIDIA: ${err instanceof Error ? err.message : "Unexpected error"}`,
        500
      );
    } finally {
      clearTimeout(timeout);
      if (signal) {
        signal.removeEventListener("abort", onParentAbort);
      }
    }
  }
}
