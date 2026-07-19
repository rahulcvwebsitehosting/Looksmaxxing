"use client";

import { useAppStore } from "@/hooks/store";
import { Button } from "@/components/ui/button";
import { ScribbleIcon } from "@/components/ui/scribble-icon";
import { FaceScanAnimation } from "@/components/input/face-scan-animation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_MESSAGES = [
  "Waking up the AI models...",
  "Gemini is scanning your symmetry...",
  "Ollama is analyzing your features...",
  "NVIDIA is evaluating proportions...",
  "Models are collaborating on your rating...",
  "Checking golden ratios...",
  "Cross-referencing beauty benchmarks...",
  "Compiling your report...",
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

    if (abortControllerRef.current) abortControllerRef.current.abort();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
      <Card className="w-full max-w-lg mx-auto border-blue-500/30 bg-slate-950/40 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center gap-8 py-10">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {models.map((model) => (
              <div
                key={model.name}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold border transition-all ${
                  model.active
                    ? "bg-blue-500/20 border-blue-400/50 text-blue-300 shadow-lg shadow-blue-500/20"
                    : "bg-slate-800/50 border-slate-700/50 text-slate-500 opacity-50"
                }`}
              >
                {model.name}
              </div>
            ))}
          </div>

          <FaceScanAnimation
            imageBase64={imageBase64 || ""}
            messageIdx={messageIdx}
            messages={LOADING_MESSAGES}
          />

          <div className="text-center space-y-2 w-full max-w-sm">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-mono text-blue-300"
              >
                {LOADING_MESSAGES[messageIdx]}
              </motion.p>
            </AnimatePresence>
            <p className="text-xs text-slate-500 font-mono">
              {currentProvider ? `Analysis in progress...` : "Waking up AI models..."}
            </p>
            <Progress value={progress} className="mt-3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card className="w-full max-w-lg mx-auto tilt-r dashed-border-marker">
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <div className="wobble-sm bg-paper-aged pencil-border p-4 hard-shadow-sm">
            <ScribbleIcon name="alert" className="w-9 h-9 stroke-marker" strokeWidth={2.4} />
          </div>
          <p className="text-base text-marker text-center font-body max-w-sm">{error}</p>
          <div className="flex gap-3">
            <Button onClick={handleAnalyze} variant="marker" className="gap-2">
              <ScribbleIcon name="spark" className="w-4 h-4 stroke-white" strokeWidth={2.4} />
              Try again
            </Button>
            <Button
              variant="outline"
              onClick={() => useAppStore.getState().reset()}
              className="gap-2"
            >
              <ScribbleIcon name="trash" className="w-4 h-4" strokeWidth={2.4} />
              Start over
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button onClick={handleAnalyze} size="lg" variant="marker" className="w-full max-w-lg mx-auto gap-2">
      <ScribbleIcon name="spark" className="w-5 h-5 stroke-white" strokeWidth={2.4} />
      Analyze my look
    </Button>
  );
}
