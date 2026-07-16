import { buildAnalysisPrompt } from "@/prompt/analysis";
import { analysisResultSchema } from "@/lib/schemas";
import { extractJsonFromResponse } from "@/lib/index";
import type { VisionProvider } from "./types";
import type { AnalysisResult } from "@/types";
import { ProviderError } from "./gemini";

export class OllamaProvider implements VisionProvider {
  readonly name = "ollama";

  private getApiKey(): string {
    const key = process.env.OLLAMA_API_KEY;
    if (!key) throw new Error("OLLAMA_API_KEY is not configured");
    return key;
  }

  private getBaseUrl(): string {
    return process.env.OLLAMA_BASE_URL || "https://ollama.com/v1";
  }

  private getModel(): string {
    return process.env.OLLAMA_MODEL || "minimax-m3";
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
      max_tokens: 8192,
    };

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal,
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      if (res.status === 429) {
        throw new ProviderError("Ollama: Rate limit exceeded", res.status);
      }
      if (res.status === 500 || res.status === 503) {
        throw new ProviderError("Ollama: Server error", res.status);
      }
      throw new ProviderError(`Ollama: HTTP ${res.status} - ${errorText.substring(0, 200)}`, res.status);
    }

    const data = await res.json();
    const rawText = data?.choices?.[0]?.message?.content;

    if (!rawText) {
      throw new ProviderError("Ollama: No text in response", 500);
    }

    const jsonStr = extractJsonFromResponse(rawText);
    const parsed = JSON.parse(jsonStr);
    return analysisResultSchema.parse(parsed);
  }
}