export * from "./schemas";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractJsonFromResponse(raw: string): string {
  let cleaned = raw.trim();
  const jsonBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (jsonBlockMatch) {
    cleaned = jsonBlockMatch[1].trim();
  }
  const braceStart = cleaned.indexOf("{");
  const braceEnd = cleaned.lastIndexOf("}");
  const bracketStart = cleaned.indexOf("[");
  const bracketEnd = cleaned.lastIndexOf("]");
  if (braceStart !== -1 && braceEnd > braceStart) {
    cleaned = cleaned.substring(braceStart, braceEnd + 1);
  } else if (bracketStart !== -1 && bracketEnd > bracketStart) {
    cleaned = cleaned.substring(bracketStart, bracketEnd + 1);
  }
  return cleaned;
}

export function formatConfidence(value: number): string {
  if (value >= 80) return "Very High";
  if (value >= 60) return "High";
  if (value >= 40) return "Moderate";
  if (value >= 20) return "Low";
  return "Very Low";
}

export function scoreToColor(score: number): string {
  if (score >= 8) return "text-emerald-400";
  if (score >= 6) return "text-blue-400";
  if (score >= 4) return "text-amber-400";
  return "text-red-400";
}

export function scoreToBgColor(score: number): string {
  if (score >= 8) return "bg-emerald-500";
  if (score >= 6) return "bg-blue-500";
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
      return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
  }
}