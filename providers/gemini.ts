import { buildAnalysisPrompt } from "@/prompt/analysis";
import { analysisResultSchema } from "@/lib/schemas";
import { extractJsonFromResponse } from "@/lib/index";
import type { VisionProvider } from "./types";
import type { AnalysisResult } from "@/types";

export class GeminiProvider implements VisionProvider {
  readonly name = "gemini";

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
        maxOutputTokens: 8192,
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
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
    const parsed = JSON.parse(jsonStr);
    return analysisResultSchema.parse(parsed);
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