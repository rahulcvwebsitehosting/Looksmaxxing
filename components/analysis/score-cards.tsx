"use client";

import { type AnalysisResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { scoreToColor, scoreToBgColor, cn } from "@/lib/index";
import { Star, TrendingUp } from "lucide-react";

interface ScoreCardsProps {
  result: AnalysisResult;
}

function ScoreRing({ score, size = "lg" }: { score: number; size?: "sm" | "lg" }) {
  const dims = size === "lg" ? "w-28 h-28" : "w-20 h-20";
  const txtSize = size === "lg" ? "text-3xl" : "text-xl";
  const strokeWidth = size === "lg" ? 6 : 5;
  const r = size === "lg" ? 44 : 32;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 10) * circ;

  return (
    <div className={cn("relative flex items-center justify-center", dims)}>
      <svg className="absolute inset-0 -rotate-90" viewBox={size === "lg" ? "0 0 100 100" : "0 0 72 72"}>
        <circle
          cx={size === "lg" ? 50 : 36}
          cy={size === "lg" ? 50 : 36}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/[0.08]"
        />
        <circle
          cx={size === "lg" ? 50 : 36}
          cy={size === "lg" ? 50 : 36}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={scoreToColor(score)}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <span className={cn("font-bold", txtSize, scoreToColor(score))}>
        {score.toFixed(1)}
      </span>
    </div>
  );
}

function FeatureBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-ink-300">{label}</span>
        <span className={cn("font-semibold font-mono", scoreToColor(score))}>{score.toFixed(1)}</span>
      </div>
      <Progress
        value={score * 10}
        indicatorClassName={cn(scoreToBgColor(score))}
      />
    </div>
  );
}

export function ScoreCards({ result }: ScoreCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="border-brand-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-ink-300 flex items-center gap-2 font-mono">
            <Star className="w-4 h-4 text-amber-400" />
            Overall Score
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2">
          <ScoreRing score={result.overall_score} />
          <p className="text-xs text-ink-400 text-center mt-1">
            Current appearance rating
          </p>
        </CardContent>
      </Card>

      <Card className="border-brand-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-ink-300 flex items-center gap-2 font-mono">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Potential Score
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2">
          <ScoreRing score={result.potential_score} />
          <p className="text-xs text-ink-400 text-center mt-1">
            Achievable with improvements
          </p>
        </CardContent>
      </Card>

      <Card className="sm:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-ink-300 font-mono">
            Feature Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FeatureBar label="Symmetry" score={result.facial_symmetry.score} />
          <FeatureBar label="Jawline" score={result.jawline.score} />
          <FeatureBar label="Eyes" score={result.eyes.score} />
          <FeatureBar label="Skin" score={result.skin.score} />
          <FeatureBar label="Hair" score={result.hair.score} />
          <FeatureBar label="Harmony" score={result.facial_harmony.score} />
        </CardContent>
      </Card>
    </div>
  );
}