import { NextResponse } from "next/server";

export const maxDuration = 60;
export const runtime = "nodejs";

export async function GET() {
  const results: Array<{
    provider: string;
    status: number | string;
    latencyMs: number;
    snippet: string;
    envStatus: Record<string, boolean>;
  }> = [];

  const env = {
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    geminiKeyPrefix: process.env.GEMINI_API_KEY?.substring(0, 6) + "..." || "MISSING",
    geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash (default)",
    hasNvidiaKey: !!process.env.NVIDIA_API_KEY,
    nvidiaKeyPrefix: process.env.NVIDIA_API_KEY?.substring(0, 6) + "..." || "MISSING",
    nvidiaModel: process.env.NVIDIA_MODEL || "meta/llama-3.2-11b-vision-instruct (default)",
    hasOllamaKey: !!process.env.OLLAMA_API_KEY,
    ollamaModel: process.env.OLLAMA_MODEL || "minimax-m3 (default)",
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL || "https://ollama.com/v1 (default)",
    aiProviderOrder: process.env.AI_PROVIDER_ORDER || "nvidia,gemini,ollama (default)",
  };
  results.push({
    provider: "ENV",
    status: "info",
    latencyMs: 0,
    snippet: JSON.stringify(env, null, 2),
    envStatus: {},
  });

  await Promise.all([
    pingGemini().then((r) => results.push(r)),
    pingNvidia().then((r) => results.push(r)),
    pingOllama().then((r) => results.push(r)),
  ]);

  return NextResponse.json({ results });
}

async function pingGemini(): Promise<{
  provider: string;
  status: number | string;
  latencyMs: number;
  snippet: string;
  envStatus: Record<string, boolean>;
}> {
  const start = Date.now();
  const key = process.env.GEMINI_API_KEY!;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Reply with the single word: OK" }] }],
        generationConfig: { maxOutputTokens: 16 },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const text = await res.text();
    return {
      provider: "gemini",
      status: res.status,
      latencyMs: Date.now() - start,
      snippet: text.substring(0, 600),
      envStatus: {},
    };
  } catch (err) {
    return {
      provider: "gemini",
      status: "error",
      latencyMs: Date.now() - start,
      snippet: err instanceof Error ? `${err.name}: ${err.message}` : String(err),
      envStatus: {},
    };
  }
}

async function pingNvidia(): Promise<{
  provider: string;
  status: number | string;
  latencyMs: number;
  snippet: string;
  envStatus: Record<string, boolean>;
}> {
  const start = Date.now();
  const key = process.env.NVIDIA_API_KEY!;
  const baseUrl = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
  const model = process.env.NVIDIA_MODEL || "meta/llama-3.2-11b-vision-instruct";
  const url = `${baseUrl}/chat/completions`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: "Reply with the single word: OK" }],
        max_tokens: 16,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const text = await res.text();
    return {
      provider: "nvidia",
      status: res.status,
      latencyMs: Date.now() - start,
      snippet: text.substring(0, 600),
      envStatus: {},
    };
  } catch (err) {
    return {
      provider: "nvidia",
      status: "error",
      latencyMs: Date.now() - start,
      snippet: err instanceof Error ? `${err.name}: ${err.message}` : String(err),
      envStatus: {},
    };
  }
}

async function pingOllama(): Promise<{
  provider: string;
  status: number | string;
  latencyMs: number;
  snippet: string;
  envStatus: Record<string, boolean>;
}> {
  const start = Date.now();
  const key = process.env.OLLAMA_API_KEY || "";
  const baseUrl = process.env.OLLAMA_BASE_URL || "https://ollama.com/v1";
  const model = process.env.OLLAMA_MODEL || "minimax-m3";
  const url = `${baseUrl}/chat/completions`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (key) headers.Authorization = `Bearer ${key}`;
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: "Reply with the single word: OK" }],
        max_tokens: 16,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const text = await res.text();
    return {
      provider: "ollama",
      status: res.status,
      latencyMs: Date.now() - start,
      snippet: text.substring(0, 600),
      envStatus: {},
    };
  } catch (err) {
    return {
      provider: "ollama",
      status: "error",
      latencyMs: Date.now() - start,
      snippet: err instanceof Error ? `${err.name}: ${err.message}` : String(err),
      envStatus: {},
    };
  }
}
