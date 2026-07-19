import { create } from "zustand";
import type { AnalysisResult } from "@/types";

interface AppState {
  imageBase64: string | null;
  imageFile: File | null;
  status: "idle" | "compressing" | "analyzing" | "complete" | "error";
  progress: number;
  currentProvider: string;
  result: AnalysisResult | null;
  error: string | null;
  isCameraMode: boolean;
  providerStatuses: Array<{
    provider: string;
    available: boolean;
    latency: number;
    lastChecked: number;
  }>;

  setImage: (base64: string, file: File) => void;
  setImageFromCamera: (base64: string) => void;
  setStatus: (status: AppState["status"]) => void;
  setProgress: (progress: number | ((prev: number) => number)) => void;
  setCurrentProvider: (provider: string) => void;
  setResult: (result: AnalysisResult | null) => void;
  clearResult: () => void;
  setError: (error: string | null) => void;
  setProviderStatuses: (statuses: AppState["providerStatuses"]) => void;
  reset: () => void;
  clearImage: () => void;
}

const initialState = {
  imageBase64: null,
  imageFile: null,
  status: "idle" as const,
  progress: 0,
  currentProvider: "",
  result: null,
  error: null,
  isCameraMode: false,
  providerStatuses: [],
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  setImage: (base64, file) =>
    set({
      imageBase64: base64,
      imageFile: file,
      isCameraMode: false,
      status: "idle",
      error: null,
    }),

  setImageFromCamera: (base64) =>
    set({
      imageBase64: base64,
      imageFile: null,
      isCameraMode: true,
      status: "idle",
      error: null,
    }),

  setStatus: (status) => set({ status }),
  setProgress: (progress) =>
    set((state) => ({
      progress:
        typeof progress === "function" ? progress(state.progress) : progress,
    })),
  setCurrentProvider: (provider) => set({ currentProvider: provider }),
  setResult: (result) =>
    set(
      result === null
        ? { result: null }
        : { result, status: "complete" as const }
    ),
  clearResult: () => set({ result: null }),
  setError: (error) => set({ error, status: "error" }),
  setProviderStatuses: (statuses) => set({ providerStatuses: statuses }),

  reset: () => set(initialState),

  clearImage: () =>
    set({
      imageBase64: null,
      imageFile: null,
      isCameraMode: false,
      status: "idle",
      result: null,
      error: null,
    }),
}));