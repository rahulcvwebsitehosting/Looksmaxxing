"use client";

import { useAppStore } from "@/hooks/store";
import { ScoreCards } from "./score-cards";
import { ChartsSection } from "./charts-section";
import { Recommendations } from "./recommendations";
import { Button } from "@/components/ui/button";
import {
  Download,
  ArrowLeft,
  Sparkles,
  User,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

export function Dashboard() {
  const { result, currentProvider, reset, imageBase64 } = useAppStore();

  if (!result) return null;

  const handleDownload = () => {
    const report = JSON.stringify(result, null, 2);
    const blob = new Blob([report], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "looksmax-report.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-8 max-w-5xl mx-auto"
    >
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={() => reset()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            New Analysis
          </Button>
          <div className="flex gap-2 items-center text-xs text-ink-muted">
            <span className="px-2 py-1 rounded-full accent-soft font-mono">
              {currentProvider}
            </span>
          </div>
        </div>

        {/* Image preview + meta */}
        <div className="flex flex-wrap items-start gap-6">
          {imageBase64 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 ring-2 ring-accent-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/jpeg;base64,${imageBase64}`}
                alt="Analyzed"
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
          <div className="flex-1 space-y-2">
            <h2 className="text-2xl font-bold text-ink font-display flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent-600" />
              Your Analysis Report
            </h2>
            <div className="flex flex-wrap gap-3 text-xs text-ink-muted font-mono">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                Estimated age: {result.estimated_age}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Analyzed by {currentProvider}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Score Cards */}
        <ScoreCards result={result} />

        {/* Charts */}
        <ChartsSection result={result} />

        {/* Recommendations */}
        <Recommendations result={result} />
    </motion.div>
  );
}