"use client";

import { useAppStore } from "@/hooks/store";
import { ScoreCards } from "./score-cards";
import { ChartsSection } from "./charts-section";
import { Recommendations } from "./recommendations";
import { Button } from "@/components/ui/button";
import { ScribbleIcon } from "@/components/ui/scribble-icon";
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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8 max-w-5xl mx-auto"
    >
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={() => reset()}
          className="gap-2"
        >
          <ScribbleIcon name="arrow" className="w-4 h-4 scale-x-[-1]" strokeWidth={2.4} />
          New analysis
        </Button>
        <span className="px-3 py-1.5 wobble-sm bg-postit pencil-border font-mono text-xs font-bold text-pencil hard-shadow-sm">
          {currentProvider}
        </span>
      </div>

      {/* Image preview + heading */}
      <div className="flex flex-wrap items-start gap-6">
        {imageBase64 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-24 h-24 wobble-sm overflow-hidden flex-shrink-0 pencil-border hard-shadow-sm tilt-l"
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
          <h2 className="text-3xl font-display font-bold text-pencil flex items-center gap-2">
            <ScribbleIcon name="spark" className="w-7 h-7 stroke-marker" strokeWidth={2.4} />
            Your <span className="scribble-underline">report</span>.
          </h2>
          <div className="flex flex-wrap gap-4 text-sm text-pencil-soft font-body">
            <span className="flex items-center gap-1.5">
              <ScribbleIcon name="face" className="w-4 h-4" strokeWidth={2.2} />
              Est. age: <span className="font-bold text-pencil font-mono">{result.estimated_age}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ScribbleIcon name="clock" className="w-4 h-4" strokeWidth={2.2} />
              Analyzed by <span className="font-bold text-pencil font-mono">{currentProvider}</span>
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="gap-2"
        >
          <ScribbleIcon name="upload" className="w-4 h-4 scale-y-[-1]" strokeWidth={2.4} />
          Export
        </Button>
      </div>

      <ScoreCards result={result} />
      <ChartsSection result={result} />
      <Recommendations result={result} />
    </motion.div>
  );
}
