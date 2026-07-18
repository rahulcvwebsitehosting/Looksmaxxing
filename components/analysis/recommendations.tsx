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
    <Card className="hover:border-white/15 transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600/20 to-flush-500/15 border border-brand-500/20 flex items-center justify-center">
            <Icon className="w-4 h-4 text-brand-300" />
          </div>
          <span className="font-medium text-sm text-ink-100 font-display">{title}</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-ink-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-ink-400" />
        )}
      </button>
      {open && <CardContent className="px-4 pb-4">{children}</CardContent>}
    </Card>
  );
}

export function Recommendations({ result }: RecommendationsProps) {
  const difficultyDots = {
    easy: "bg-emerald-400",
    medium: "bg-amber-400",
    hard: "bg-red-400",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-brand-400" />
        <h3 className="text-lg font-semibold text-ink-100 font-display">Recommendations</h3>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-400 flex items-center gap-2 font-mono">
              <ThumbsUp className="w-4 h-4" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li
                  key={i}
                  className="text-sm text-ink-200 flex items-start gap-2"
                >
                  <span className="text-emerald-400 mt-0.5 flex-shrink-0">+</span>
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-400 flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4" />
              Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.weaknesses.map((w, i) => (
                <li
                  key={i}
                  className="text-sm text-ink-200 flex items-start gap-2"
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
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border font-mono",
                difficultyColor(cat.difficulty)
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", difficultyDots[cat.difficulty])} />
              {cat.difficulty}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border border-white/10 text-ink-300 bg-white/[0.04] font-mono">
              Impact: {cat.impact}
            </span>
          </div>
          <ul className="space-y-2">
            {cat.suggestions.map((sug, si) => (
              <li
                key={si}
                className="text-sm text-ink-200 flex items-start gap-2 bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]"
              >
                <Sparkles className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
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
              className="bg-white/[0.03] rounded-xl p-3 space-y-1.5 border border-white/[0.06]"
            >
              <p className="text-sm font-medium text-ink-100 font-display">{h.name}</p>
              <p className="text-xs text-ink-300">{h.description}</p>
              <div className="flex gap-3 text-xs font-mono">
                <span className="text-brand-400">Suitability: {h.suitability}</span>
                <span className="text-ink-400">Care: {h.maintenance}</span>
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
              className="bg-white/[0.03] rounded-xl p-3 space-y-1.5 border border-white/[0.06]"
            >
              <p className="text-sm font-medium text-ink-100 font-display">{b.name}</p>
              <p className="text-xs text-ink-300">{b.description}</p>
              <div className="flex gap-3 text-xs font-mono">
                <span className="text-brand-400">Suitability: {b.suitability}</span>
                <span className="text-ink-400">Care: {b.maintenance}</span>
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
              className="bg-white/[0.03] rounded-xl p-3 space-y-1.5 border border-white/[0.06]"
            >
              <p className="text-sm font-medium text-ink-100 font-display">{g.shape}</p>
              <p className="text-xs text-ink-300">{g.description}</p>
              <p className="text-xs text-brand-400 font-mono">Suitability: {g.suitability}</p>
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
              className="flex items-start gap-3 bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]"
            >
              <span className="text-xs font-bold text-brand-400 mt-0.5 w-6 font-mono">
                {idx + 1}.
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink-100 font-display">{sc.step}</p>
                <p className="text-xs text-ink-300 font-mono">
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
              className="bg-white/[0.03] rounded-xl p-3 space-y-1 border border-white/[0.06]"
            >
              <p className="text-sm font-medium text-ink-100 font-display">{f.focus}</p>
              <p className="text-xs text-ink-300">{f.recommendation}</p>
              <p className="text-xs text-brand-400 font-mono">Impact: {f.impact}</p>
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
          <Card key={label} className="hover:border-white/15 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-ink-200 font-display">
                {label} <span className={cn("font-mono", scoreToColor(data.score))}>({data.score}/10)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-ink-300 leading-relaxed">{data.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* First Impression & Confidence */}
      <Card className="hover:border-white/15 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-ink-200 font-display">
            First Impression & Confidence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-ink-200 italic">
            &ldquo;{result.first_impression}&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-400 font-mono">Perceived confidence:</span>
            <span className="text-sm font-semibold text-brand-400 font-mono">
              {result.confidence}/100
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-flush-500"
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
