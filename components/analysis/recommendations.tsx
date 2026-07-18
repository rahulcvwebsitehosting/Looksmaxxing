"use client";

import { type AnalysisResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScribbleIcon, type ScribbleIconName } from "@/components/ui/scribble-icon";
import { cn, difficultyColor, scoreToColor } from "@/lib/index";
import { useState } from "react";

interface RecommendationsProps {
  result: AnalysisResult;
}

function ExpandableCard({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: ScribbleIconName;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className={`${open ? "" : "tilt-l"} transition-transform`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="wobble-sm bg-paper-aged pencil-border p-2 hard-shadow-sm">
            <ScribbleIcon name={icon} className="w-5 h-5 stroke-marker" strokeWidth={2.2} />
          </div>
          <span className="font-display font-bold text-lg text-pencil">{title}</span>
        </div>
        <ScribbleIcon
          name="arrow"
          className={`w-5 h-5 stroke-pencil transition-transform ${open ? "rotate-90" : ""}`}
          strokeWidth={2.4}
        />
      </button>
      {open && <CardContent className="px-4 pb-4">{children}</CardContent>}
    </Card>
  );
}

export function Recommendations({ result }: RecommendationsProps) {
  const difficultyDots: Record<string, string> = {
    easy: "bg-emerald",
    medium: "bg-amber",
    hard: "bg-marker",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <ScribbleIcon name="spark" className="w-5 h-5 stroke-marker" strokeWidth={2.4} />
        <h3 className="text-2xl font-display font-bold text-pencil">
          Your <span className="scribble-underline">looksmaxxing</span> plan.
        </h3>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Card className="tilt-l">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display font-bold text-emerald flex items-center gap-2 font-mono uppercase tracking-wide">
              <ScribbleIcon name="check" className="w-4 h-4 stroke-emerald" strokeWidth={2.4} />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {result.strengths.map((s, i) => (
                <li
                  key={i}
                  className="text-base text-pencil-soft flex items-start gap-2 font-body"
                >
                  <ScribbleIcon name="check" className="w-4 h-4 mt-1 flex-shrink-0 stroke-emerald" strokeWidth={2.4} />
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="tilt-r">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display font-bold text-marker flex items-center gap-2 font-mono uppercase tracking-wide">
              <ScribbleIcon name="alert" className="w-4 h-4 stroke-marker" strokeWidth={2.4} />
              To Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {result.weaknesses.map((w, i) => (
                <li
                  key={i}
                  className="text-base text-pencil-soft flex items-start gap-2 font-body"
                >
                  <ScribbleIcon name="alert" className="w-4 h-4 mt-1 flex-shrink-0 stroke-marker" strokeWidth={2.4} />
                  {w}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Looksmaxxing Categories */}
      {result.looksmaxxing.map((cat, idx) => {
        const iconKey = cat.category.toLowerCase().includes("hair")
          ? "scissors"
          : cat.category.toLowerCase().includes("fit")
            ? "dumbbell"
            : cat.category.toLowerCase().includes("skin")
              ? "droplet"
              : cat.category.toLowerCase().includes("groom") ||
                  cat.category.toLowerCase().includes("beard") ||
                  cat.category.toLowerCase().includes("style")
                ? "shirt"
                : "spark";
        return (
          <ExpandableCard
            key={idx}
            title={cat.category}
            icon={iconKey as ScribbleIconName}
            defaultOpen={idx === 0}
          >
            <div className="flex flex-wrap gap-2 mb-3">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 wobble-sm text-xs font-display font-bold border font-mono uppercase",
                  difficultyColor(cat.difficulty)
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", difficultyDots[cat.difficulty])} />
                {cat.difficulty}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 wobble-sm text-xs font-display font-bold border border-pencil text-pencil-soft bg-paper-aged font-mono uppercase hard-shadow-sm">
                Impact: {cat.impact}
              </span>
            </div>
            <ul className="space-y-2.5">
              {cat.suggestions.map((sug, si) => (
                <li
                  key={si}
                  className="text-base text-pencil-soft flex items-start gap-3 bg-paper-aged pencil-border wobble-sm px-4 py-3 font-body leading-relaxed"
                >
                  <ScribbleIcon name="spark" className="w-4 h-4 mt-1 flex-shrink-0 stroke-marker" strokeWidth={2.2} />
                  {sug}
                </li>
              ))}
            </ul>
          </ExpandableCard>
        );
      })}

      {/* Hairstyles */}
      <ExpandableCard title="Hairstyle suggestions" icon="scissors">
        <div className="grid gap-3 sm:grid-cols-2">
          {result.hairstyles.map((h, idx) => (
            <div
              key={idx}
              className="bg-paper-aged pencil-border wobble-sm px-4 py-3 space-y-1.5 hard-shadow-sm"
            >
              <p className="text-base font-display font-bold text-pencil">{h.name}</p>
              <p className="text-sm text-pencil-soft font-body">{h.description}</p>
              <div className="flex gap-3 text-xs font-mono font-bold">
                <span className="text-marker">Match: {h.suitability}</span>
                <span className="text-pencil-muted">Care: {h.maintenance}</span>
              </div>
            </div>
          ))}
        </div>
      </ExpandableCard>

      {/* Beard Styles */}
      <ExpandableCard title="Beard & facial hair" icon="shirt">
        <div className="grid gap-3 sm:grid-cols-2">
          {result.beard_styles.map((b, idx) => (
            <div
              key={idx}
              className="bg-paper-aged pencil-border wobble-sm px-4 py-3 space-y-1.5 hard-shadow-sm"
            >
              <p className="text-base font-display font-bold text-pencil">{b.name}</p>
              <p className="text-sm text-pencil-soft font-body">{b.description}</p>
              <div className="flex gap-3 text-xs font-mono font-bold">
                <span className="text-marker">Match: {b.suitability}</span>
                <span className="text-pencil-muted">Care: {b.maintenance}</span>
              </div>
            </div>
          ))}
        </div>
      </ExpandableCard>

      {/* Glasses */}
      <ExpandableCard title="Glasses recommendations" icon="glasses">
        <div className="grid gap-3 sm:grid-cols-2">
          {result.glasses.map((g, idx) => (
            <div
              key={idx}
              className="bg-paper-aged pencil-border wobble-sm px-4 py-3 space-y-1.5 hard-shadow-sm"
            >
              <p className="text-base font-display font-bold text-pencil flex items-center gap-2">
                <ScribbleIcon name="glasses" className="w-4 h-4" strokeWidth={2.2} />
                {g.shape}
              </p>
              <p className="text-sm text-pencil-soft font-body">{g.description}</p>
              <p className="text-xs text-marker font-mono font-bold">Match: {g.suitability}</p>
            </div>
          ))}
        </div>
      </ExpandableCard>

      {/* Skincare */}
      <ExpandableCard title="Skincare routine" icon="droplet">
        <div className="space-y-2.5">
          {result.skin_care.map((sc, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 bg-paper-aged pencil-border wobble-sm px-4 py-3 hard-shadow-sm"
            >
              <span className="text-lg font-display font-bold text-marker mt-0.5 w-6 font-mono">
                {idx + 1}.
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-base font-display font-bold text-pencil">{sc.step}</p>
                <p className="text-xs text-pencil-soft font-mono">
                  {sc.product_type} · {sc.frequency} · Priority: {sc.priority}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ExpandableCard>

      {/* Fitness */}
      <ExpandableCard title="Fitness focus" icon="dumbbell">
        <div className="space-y-2.5">
          {result.fitness.map((f, idx) => (
            <div
              key={idx}
              className="bg-paper-aged pencil-border wobble-sm px-4 py-3 space-y-1 hard-shadow-sm"
            >
              <p className="text-base font-display font-bold text-pencil">{f.focus}</p>
              <p className="text-sm text-pencil-soft font-body">{f.recommendation}</p>
              <p className="text-xs text-marker font-mono font-bold">Impact: {f.impact}</p>
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
        ].map(({ label, data }, idx) => (
          <Card key={label} className={idx % 2 === 0 ? "tilt-l" : "tilt-r"}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display font-bold text-pencil flex items-center justify-between">
                {label}
                <span className={cn("font-mono", scoreToColor(data.score))}>
                  {data.score}/10
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-pencil-soft leading-relaxed font-body">{data.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* First Impression & Confidence */}
      <Card className="tilt-l-2 dashed-border-marker hard-shadow-marker">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display font-bold text-pencil">
            First impression & confidence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-base text-pencil-soft italic font-body">
            &ldquo;{result.first_impression}&rdquo;
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-pencil-muted font-mono">Confidence:</span>
            <span className="text-lg font-display font-bold text-marker font-mono">
              {result.confidence}/100
            </span>
            <div className="flex-1 h-3 min-w-[120px] bg-paper-aged pencil-border rounded-[8px_10px_8px_12px] overflow-hidden">
              <div
                className="h-full bg-marker transition-all duration-700 ease-out"
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
