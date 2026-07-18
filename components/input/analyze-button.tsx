"use client";

import { useAppStore } from "@/hooks/store";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_MESSAGES = [
  "Waking up the AI models...",
  "Gemini is scanning your facial symmetry...",
  "Ollama is analyzing your features...",
  "NVIDIA is evaluating your proportions...",
  "AI models are collaborating on your rating...",
  "Checking golden ratios across models...",
  "Cross-referencing beauty benchmarks...",
  "Compiling your personalized report...",
];

export function AnalyzeButton() {
  const {
    imageBase64,
    imageFile,
    status,
    progress,
    currentProvider,
    setStatus,
    setProgress,
    setCurrentProvider,
    setResult,
    clearResult,
    setError,
    error,
  } = useAppStore();

  const [messageIdx, setMessageIdx] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === "analyzing" && intervalRef.current === null) {
      intervalRef.current = window.setInterval(() => {
        setMessageIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
        setProgress((p) => Math.min(p + 8, 90));
      }, 1200);
    }
    if (status !== "analyzing" && intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [status, setProgress]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!imageBase64) {
      toast.error("Please upload or capture an image first.");
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setStatus("analyzing");
    setProgress(0);
    setCurrentProvider("");
    setError(null);
    clearResult();

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 120_000);
    timeoutRef.current = timeout;

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
        signal: controller.signal,
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
      let msg = err instanceof Error ? err.message : "Analysis failed";
      if (err instanceof DOMException && err.name === "AbortError") {
        msg = "Request timed out. Our AI models are taking longer than expected — please try again.";
      }
      setError(msg);
      toast.error(msg);
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      abortControllerRef.current = null;
    }
  }, [imageBase64, imageFile, setStatus, setProgress, setCurrentProvider, setResult, clearResult, setError]);

  if (status === "analyzing") {

    const models = [
      { name: "Gemini", active: !currentProvider || currentProvider === "gemini" },
      { name: "Ollama", active: currentProvider === "ollama" },
      { name: "NVIDIA", active: currentProvider === "nvidia" },
    ];
    return (
      <Card className="w-full max-w-lg mx-auto border-accent-200 overflow-hidden">
        <div className="h-1 bg-surface-3">
          <motion.div
            className="h-full bg-accent-600"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(progress, 90)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <CardContent className="flex flex-col items-center gap-6 py-10">
          <div className="flex items-center gap-3">
            {models.map((model, i) => (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: model.active ? 1 : 0.4,
                  scale: model.active ? 1 : 0.85,
                }}
                transition={{ delay: i * 0.2, duration: 0.4 }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border font-mono ${
                  model.active
                    ? "bg-accent-50 border-accent-200 text-accent-700"
                    : "bg-surface-2 border-line text-ink-muted"
                }`}
              >
                {model.name}
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Loader2 className="w-4 h-4 text-accent-600 animate-spin" />
            </motion.div>
          </div>

          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-accent-50 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-accent-100/60 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-accent-600" />
              </div>
            </div>
            <motion.div
              className="absolute -inset-2 rounded-full border-2 border-accent-200"
              animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.15, 0.4] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            />
          </div>

          <div className="text-center space-y-2 w-full">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-base font-medium text-ink"
              >
                {LOADING_MESSAGES[messageIdx]}
              </motion.p>
            </AnimatePresence>
            <p className="text-xs text-ink-faint font-mono">
              {currentProvider
                ? `Analysis in progress...`
                : "Waking up AI models..."}
            </p>
            <Progress
              value={progress}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card className="w-full max-w-lg mx-auto border-red-200">
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-sm text-red-600 text-center">{error}</p>
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