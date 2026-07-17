"use client";

import { type AnalysisResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, difficultyColor, scoreToColor } from "@/lib/index";
import {
  ThumbsUp,
  AlertCircle,
  Sparkles,
  Scissors,
  Shirt,
  Dumbbell,
  Eye,
  Droplets,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

interface RecommendationsProps {
  result: AnalysisResult;
}

function ExpandableCard({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className="border-zinc-800">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-600/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-violet-400" />
          </div>
          <span className="font-medium text-sm text-zinc-200">{title}</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-zinc-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        )}
      </button>
      {open && <CardContent className="px-4 pb-4">{children}</CardContent>}
    </Card>
  );
}

export function Recommendations({ result }: RecommendationsProps) {
  const difficultyIcons = {
    easy: "🟢",
    medium: "🟡",
    hard: "🔴",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-violet-400" />
        <h3 className="text-lg font-semibold text-zinc-100">Recommendations</h3>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-emerald-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-400 flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li
                  key={i}
                  className="text-sm text-zinc-300 flex items-start gap-2"
                >
                  <span className="text-emerald-400 mt-0.5 flex-shrink-0">+</span>
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-amber-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.weaknesses.map((w, i) => (
                <li
                  key={i}
                  className="text-sm text-zinc-300 flex items-start gap-2"
                >
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">-</span>
                  {w}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Looksmaxxing Categories */}
      {result.looksmaxxing.map((cat, idx) => (
        <ExpandableCard
          key={idx}
          title={cat.category}
          icon={Sparkles}
          defaultOpen={idx === 0}
        >
          <div className="flex flex-wrap gap-2 mb-3">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                difficultyColor(cat.difficulty)
              )}
            >
              {difficultyIcons[cat.difficulty]} {cat.difficulty}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border border-zinc-700 text-zinc-400 bg-zinc-800/50">
              Impact: {cat.impact}
            </span>
          </div>
          <ul className="space-y-2">
            {cat.suggestions.map((sug, si) => (
              <li
                key={si}
                className="text-sm text-zinc-300 flex items-start gap-2 bg-zinc-800/30 rounded-xl p-3"
              >
                <Sparkles className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                {sug}
              </li>
            ))}
          </ul>
        </ExpandableCard>
      ))}

      {/* Hairstyles */}
      <ExpandableCard title="Hairstyle Suggestions" icon={Scissors}>
        <div className="grid gap-3 sm:grid-cols-2">
          {result.hairstyles.map((h, idx) => (
            <div
              key={idx}
              className="bg-zinc-800/30 rounded-xl p-3 space-y-1.5"
            >
              <p className="text-sm font-medium text-zinc-200">{h.name}</p>
              <p className="text-xs text-zinc-400">{h.description}</p>
              <div className="flex gap-3 text-xs">
                <span className="text-violet-400">Suitability: {h.suitability}</span>
                <span className="text-zinc-500">Care: {h.maintenance}</span>
              </div>
            </div>
          ))}
        </div>
      </ExpandableCard>

      {/* Beard Styles */}
      <ExpandableCard title="Beard & Facial Hair Suggestions" icon={Shirt}>
        <div className="grid gap-3 sm:grid-cols-2">
          {result.beard_styles.map((b, idx) => (
            <div
              key={idx}
              className="bg-zinc-800/30 rounded-xl p-3 space-y-1.5"
            >
              <p className="text-sm font-medium text-zinc-200">{b.name}</p>
              <p className="text-xs text-zinc-400">{b.description}</p>
              <div className="flex gap-3 text-xs">
                <span className="text-violet-400">Suitability: {b.suitability}</span>
                <span className="text-zinc-500">Care: {b.maintenance}</span>
              </div>
            </div>
          ))}
        </div>
      </ExpandableCard>

      {/* Glasses */}
      <ExpandableCard title="Glasses Recommendations" icon={Eye}>
        <div className="grid gap-3 sm:grid-cols-2">
          {result.glasses.map((g, idx) => (
            <div
              key={idx}
              className="bg-zinc-800/30 rounded-xl p-3 space-y-1.5"
            >
              <p className="text-sm font-medium text-zinc-200">{g.shape}</p>
              <p className="text-xs text-zinc-400">{g.description}</p>
              <p className="text-xs text-violet-400">Suitability: {g.suitability}</p>
            </div>
          ))}
        </div>
      </ExpandableCard>

      {/* Skincare */}
      <ExpandableCard title="Skincare Routine" icon={Droplets}>
        <div className="space-y-2">
          {result.skin_care.map((sc, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 bg-zinc-800/30 rounded-xl p-3"
            >
              <span className="text-xs font-bold text-violet-400 mt-0.5 w-6">
                {idx + 1}.
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-200">{sc.step}</p>
                <p className="text-xs text-zinc-400">
                  {sc.product_type} · {sc.frequency} · Priority: {sc.priority}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ExpandableCard>

      {/* Fitness */}
      <ExpandableCard title="Fitness Recommendations" icon={Dumbbell}>
        <div className="space-y-2">
          {result.fitness.map((f, idx) => (
            <div
              key={idx}
              className="bg-zinc-800/30 rounded-xl p-3 space-y-1"
            >
              <p className="text-sm font-medium text-zinc-200">{f.focus}</p>
              <p className="text-xs text-zinc-400">{f.recommendation}</p>
              <p className="text-xs text-violet-400">Impact: {f.impact}</p>
            </div>
          ))}
        </div>
      </ExpandableCard>

      {/* Detailed Feature Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: "Jawline", data: result.jawline },
          { label: "Eyes", data: result.eyes },
          { label: "Nose", data: result.nose },
          { label: "Lips", data: result.lips },
          { label: "Skin", data: result.skin },
          { label: "Hair", data: result.hair },
          { label: "Eyebrows", data: result.eyebrows },
          { label: "Golden Ratio", data: result.golden_ratio },
        ].map(({ label, data }) => (
          <Card key={label} className="border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-300">
                {label} <span className={scoreToColor(data.score)}>({data.score}/10)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-400 leading-relaxed">{data.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* First Impression & Confidence */}
      <Card className="border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-zinc-300">
            First Impression & Confidence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-zinc-300 italic">
            &quot;{result.first_impression}&quot;
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500">Perceived confidence:</span>
            <span className="text-sm font-semibold text-violet-400">
              {result.confidence}/100
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-violet-500"
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

