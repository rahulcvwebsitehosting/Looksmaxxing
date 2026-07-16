"use client";

import { useAppStore } from "@/hooks/store";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const LOADING_MESSAGES = [
  "Preparing your image...",
  "Analyzing facial features...",
  "Evaluating symmetry...",
  "Checking golden ratios...",
  "Assessing skin quality...",
  "Studying facial harmony...",
  "Generating recommendations...",
  "Compiling your report...",
];

export function AnalyzeButton() {
  const {
    imageBase64,
    imageFile,
    status,
    setStatus,
    setProgress,
    setCurrentProvider,
    setResult,
    setError,
    result,
    error,
  } = useAppStore();

  const [messageIdx, setMessageIdx] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === "analyzing" && intervalRef.current === null) {
      intervalRef.current = window.setInterval(() => {
        setMessageIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
        useAppStore.getState().setProgress(
          Math.min(useAppStore.getState().progress + 8, 90)
        );
      }, 1200);
    }
    if (status !== "analyzing" && intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [status]);

  const handleAnalyze = useCallback(async () => {
    if (!imageBase64) {
      toast.error("Please upload or capture an image first.");
      return;
    }

    setStatus("analyzing");
    setProgress(0);
    setCurrentProvider("");
    setError(null);
    setResult(null);

    try {
      const fileToSend = imageFile || new File([], "capture.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      const byteChars = atob(imageBase64);
      const byteNums = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteNums[i] = byteChars.charCodeAt(i);
      }
      const byteArr = new Uint8Array(byteNums);
      const blob = new Blob([byteArr], { type: "image/jpeg" });
      formData.append("image", blob, fileToSend.name || "photo.jpg");

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(body.error || `Server error: ${res.status}`);
      }

      const data = await res.json();
      if (!data.success || !data.result) {
        throw new Error(data.error || "Analysis returned no result");
      }

      setProgress(100);
      setCurrentProvider(data.provider || "unknown");
      setResult(data.result);
      toast.success("Analysis complete!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Analysis failed";
      setError(msg);
      setProgress(0);
      toast.error(msg);
    }
  }, [imageBase64, imageFile, setStatus, setProgress, setCurrentProvider, setResult, setError]);

  if (status === "analyzing") {
    return (
      <Card className="w-full max-w-lg mx-auto border-violet-800/30">
        <CardContent className="flex flex-col items-center gap-6 py-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-violet-600/10 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-violet-300" />
            </div>
          </div>
          <div className="text-center space-y-2 w-full">
            <p className="text-base font-medium text-zinc-200">
              {LOADING_MESSAGES[messageIdx]}
            </p>
            <p className="text-xs text-zinc-500">
              {useAppStore.getState().currentProvider
                ? `Using ${useAppStore.getState().currentProvider}...`
                : "Selecting best AI model..."}
            </p>
            <Progress
              value={useAppStore.getState().progress}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card className="w-full max-w-lg mx-auto border-red-800/30">
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <div className="w-16 h-16 rounded-2xl bg-red-600/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-sm text-red-400 text-center">{error}</p>
          <div className="flex gap-3">
            <Button onClick={handleAnalyze} variant="default">
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                useAppStore.getState().reset();
              }}
            >
              Start Over
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button onClick={handleAnalyze} size="lg" className="w-full max-w-lg mx-auto gap-2">
      <Sparkles className="w-5 h-5" />
      Analyze My Look
    </Button>
  );
}

// Need to import Button here
import { Button } from "@/components/ui/button";