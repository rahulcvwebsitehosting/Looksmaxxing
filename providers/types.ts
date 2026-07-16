import type { AnalysisResult } from "@/types";

export interface VisionProvider {
  readonly name: string;
  analyze(imageBase64: string, mimeType: string): Promise<AnalysisResult>;
  healthCheck(): Promise<boolean>;
}