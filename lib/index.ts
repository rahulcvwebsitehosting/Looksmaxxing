export * from "./schemas";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractJsonFromResponse(raw: string): string {
  const cleaned = raw
    .replace(/<think[\s\S]*?<\/think>/gi, "")
    .replace(/<thinking[\s\S]*?<\/thinking>/gi, "")
    .trim();

  const objects: string[] = [];

  for (let i = 0; i < cleaned.length; i++) {
    if (cleaned[i] !== "{") continue;

    let depth = 0;
    let inString = false;
    let escape = false;

    for (let j = i; j < cleaned.length; j++) {
      const char = cleaned[j];

      if (escape) {
        escape = false;
      } else if (char === "\\") {
        escape = true;
      } else if (char === '"') {
        inString = !inString;
      } else if (!inString) {
        if (char === "{") {
          depth++;
        } else if (char === "}") {
          depth--;
          if (depth === 0) {
            objects.push(cleaned.slice(i, j + 1));
            break;
          }
        }
      }
    }
  }

  for (let k = objects.length - 1; k >= 0; k--) {
    try {
      JSON.parse(objects[k]);
      return objects[k];
    } catch {
      // Not valid JSON, keep searching backwards
    }
  }

  throw new Error("No valid JSON object found in response");
}

export function formatConfidence(value: number): string {
  if (value >= 80) return "Very High";
  if (value >= 60) return "High";
  if (value >= 40) return "Moderate";
  if (value >= 20) return "Low";
  return "Very Low";
}

export function scoreToColor(score: number): string {
  if (score >= 8) return "text-emerald-600";
  if (score >= 6) return "text-accent-600";
  if (score >= 4) return "text-amber-600";
  return "text-red-600";
}

export function scoreToBgColor(score: number): string {
  if (score >= 8) return "bg-emerald-500";
  if (score >= 6) return "bg-accent-500";
  if (score >= 4) return "bg-amber-500";
  return "bg-red-500";
}

export function difficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "easy":
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "medium":
      return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    case "hard":
      return "text-red-400 bg-red-500/10 border-red-500/20";
    default:
      return "text-ink-300 bg-white/[0.04] border-white/10";
  }
}
