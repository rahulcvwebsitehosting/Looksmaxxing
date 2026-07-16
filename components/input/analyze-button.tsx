"use client";

import { useAppStore } from "@/hooks/store";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
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

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120_000);
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeout);

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
      setProgress(0);
      toast.error(msg);
    }
  }, [imageBase64, imageFile, setStatus, setProgress, setCurrentProvider, setResult, setError]);

  if (status === "analyzing") {
    const provider = useAppStore.getState().currentProvider;
    const models = [
      { name: "Gemini", active: !provider || provider === "gemini" },
      { name: "Ollama", active: provider === "ollama" },
      { name: "NVIDIA", active: provider === "nvidia" },
    ];
    return (
      <Card className="w-full max-w-lg mx-auto border-violet-800/30 overflow-hidden">
        <div className="h-1 bg-zinc-800">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(useAppStore.getState().progress, 90)}%` }}
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
                className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                  model.active
                    ? "bg-violet-600/20 border-violet-500/40 text-violet-300"
                    : "bg-zinc-800/50 border-zinc-700/30 text-zinc-500"
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
              <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
            </motion.div>
          </div>

          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-pink-600/20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-violet-600/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-violet-300" />
              </div>
            </div>
            <motion.div
              className="absolute -inset-2 rounded-full border-2 border-violet-500/20"
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
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
                className="text-base font-medium text-zinc-200"
              >
                {LOADING_MESSAGES[messageIdx]}
              </motion.p>
            </AnimatePresence>
            <p className="text-xs text-zinc-500">
              {provider
                ? `Analysis in progress...`
                : "Waking up AI models..."}
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