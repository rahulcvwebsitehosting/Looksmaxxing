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
    <Card className="hover:shadow-md transition-all duration-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-50 border border-accent-100 flex items-center justify-center">
            <Icon className="w-4 h-4 text-accent-600" />
          </div>
          <span className="font-medium text-sm text-ink font-display">{title}</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-ink-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-ink-muted" />
        )}
      </button>
      {open && <CardContent className="px-4 pb-4">{children}</CardContent>}
    </Card>
  );
}

export function Recommendations({ result }: RecommendationsProps) {
  const difficultyDots = {
    easy: "bg-emerald-500",
    medium: "bg-amber-500",
    hard: "bg-red-500",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-accent-600" />
        <h3 className="text-lg font-semibold text-ink font-display">Recommendations</h3>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-emerald-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600 flex items-center gap-2 font-mono">
              <ThumbsUp className="w-4 h-4" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li
                  key={i}
                  className="text-sm text-ink-soft flex items-start gap-2"
                >
                  <span className="text-emerald-500 mt-0.5 flex-shrink-0">+</span>
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-600 flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4" />
              Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.weaknesses.map((w, i) => (
                <li
                  key={i}
                  className="text-sm text-ink-soft flex items-start gap-2"
                >
                  <span className="text-amber-500 mt-0.5 flex-shrink-0">-</span>
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
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border border-line text-ink-muted bg-surface-2 font-mono">
              Impact: {cat.impact}
            </span>
          </div>
          <ul className="space-y-2">
            {cat.suggestions.map((sug, si) => (
              <li
                key={si}
                className="text-sm text-ink-soft flex items-start gap-2 bg-surface-2 rounded-xl p-3 border border-line"
              >
                <Sparkles className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" />
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
              className="bg-surface-2 rounded-xl p-3 space-y-1.5 border border-line"
            >
              <p className="text-sm font-medium text-ink font-display">{h.name}</p>
              <p className="text-xs text-ink-soft">{h.description}</p>
              <div className="flex gap-3 text-xs font-mono">
                <span className="text-accent-600">Suitability: {h.suitability}</span>
                <span className="text-ink-muted">Care: {h.maintenance}</span>
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
              className="bg-surface-2 rounded-xl p-3 space-y-1.5 border border-line"
            >
              <p className="text-sm font-medium text-ink font-display">{b.name}</p>
              <p className="text-xs text-ink-soft">{b.description}</p>
              <div className="flex gap-3 text-xs font-mono">
                <span className="text-accent-600">Suitability: {b.suitability}</span>
                <span className="text-ink-muted">Care: {b.maintenance}</span>
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
              className="bg-surface-2 rounded-xl p-3 space-y-1.5 border border-line"
            >
              <p className="text-sm font-medium text-ink font-display">{g.shape}</p>
              <p className="text-xs text-ink-soft">{g.description}</p>
              <p className="text-xs text-accent-600 font-mono">Suitability: {g.suitability}</p>
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
              className="flex items-start gap-3 bg-surface-2 rounded-xl p-3 border border-line"
            >
              <span className="text-xs font-bold text-accent-600 mt-0.5 w-6 font-mono">
                {idx + 1}.
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink font-display">{sc.step}</p>
                <p className="text-xs text-ink-soft font-mono">
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
              className="bg-surface-2 rounded-xl p-3 space-y-1 border border-line"
            >
              <p className="text-sm font-medium text-ink font-display">{f.focus}</p>
              <p className="text-xs text-ink-soft">{f.recommendation}</p>
              <p className="text-xs text-accent-600 font-mono">Impact: {f.impact}</p>
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
          <Card key={label} className="hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-ink-soft font-display">
                {label} <span className={cn("font-mono", scoreToColor(data.score))}>({data.score}/10)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-ink-soft leading-relaxed">{data.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* First Impression & Confidence */}
      <Card className="hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-ink-soft font-display">
            First Impression & Confidence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-ink-soft italic">
            &ldquo;{result.first_impression}&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-muted font-mono">Perceived confidence:</span>
            <span className="text-sm font-semibold text-accent-600 font-mono">
              {result.confidence}/100
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-surface-3">
              <div
                className="h-full rounded-full bg-accent-600"
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
