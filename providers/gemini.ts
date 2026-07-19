import { buildAnalysisPrompt } from "@/prompt/analysis";
import { analysisResultSchema } from "@/lib/schemas";
import { extractJsonFromResponse } from "@/lib/index";
import type { VisionProvider } from "./types";
import type { AnalysisResult } from "@/types";

const REQUEST_TIMEOUT_MS = 16_000;

export class GeminiProvider implements VisionProvider {
  readonly name = "gemini";

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
  }

  private getApiKey(): string {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is not configured");
    return key;
  }

  private getModel(): string {
    return process.env.GEMINI_MODEL || "gemini-2.5-flash";
  }

  async healthCheck(): Promise<boolean> {
    try {
      const key = this.getApiKey();
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.getModel()}:generateContent?key=${key}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Reply with just the word 'OK'." }] }],
        }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text !== undefined;
    } catch {
      return false;
    }
  }

  async analyze(imageBase64: string, mimeType: string, signal?: AbortSignal): Promise<AnalysisResult> {
    const apiKey = this.getApiKey();
    const model = this.getModel();
    const prompt = buildAnalysisPrompt();

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const body = {
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { mimeType, data: imageBase64 } },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2500,
        responseMimeType: "application/json",
      },
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
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        if (res.status === 429) {
          throw new ProviderError("Gemini: Rate limit exceeded", res.status);
        }
        if (res.status === 500 || res.status === 503) {
          throw new ProviderError("Gemini: Server error", res.status);
        }
        throw new ProviderError(`Gemini: HTTP ${res.status} - ${errorText.substring(0, 200)}`, res.status);
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new ProviderError("Gemini: No text in response", 500);
      }

      const jsonStr = extractJsonFromResponse(rawText);
      let parsed: unknown;
      try {
        parsed = JSON.parse(jsonStr);
      } catch {
        throw new ProviderError("Gemini: Malformed JSON in model response", 500);
      }
      try {
        return analysisResultSchema.parse(parsed);
      } catch (err) {
        const detail = err instanceof Error ? err.message.substring(0, 300) : "schema mismatch";
        throw new ProviderError(`Gemini: Response failed schema validation: ${detail}`, 500);
      }
    } catch (err) {
      if (controller.signal.aborted) {
        throw new ProviderError(
          signal?.aborted
            ? "Gemini: Request cancelled by upstream caller"
            : "Gemini: Request timed out",
          504
        );
      }
      if (err instanceof ProviderError) throw err;
      throw new ProviderError(
        `Gemini: ${err instanceof Error ? err.message : "Unexpected error"}`,
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

export class ProviderError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "ProviderError";
  }
}
