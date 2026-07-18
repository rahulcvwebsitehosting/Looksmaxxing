"use client";

import { type AnalysisResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { Sparkles } from "lucide-react";

interface ChartsSectionProps {
  result: AnalysisResult;
}

function scoreToHex(score: number): string {
  if (score >= 8) return "#34d399";
  if (score >= 6) return "#6366f1";
  if (score >= 4) return "#f59e0b";
  return "#ef4444";
}

const RADAR_DATA = (result: AnalysisResult) => [
  { feature: "Symmetry", value: result.facial_symmetry.score },
  { feature: "Jawline", value: result.jawline.score },
  { feature: "Eyes", value: result.eyes.score },
  { feature: "Nose", value: result.nose.score },
  { feature: "Lips", value: result.lips.score },
  { feature: "Skin", value: result.skin.score },
  { feature: "Hair", value: result.hair.score },
  { feature: "Harmony", value: result.facial_harmony.score },
];

const MASC_FEM_DATA = (result: AnalysisResult) => [
  { name: "Masculine", value: result.masculinity.score },
  { name: "Feminine", value: result.femininity.score },
];

export function ChartsSection({ result }: ChartsSectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-ink-soft flex items-center gap-2 font-mono">
            <Sparkles className="w-4 h-4 text-accent-600" />
            Facial Features Radar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={RADAR_DATA(result)}>
              <PolarGrid stroke="#e6e8ec" />
              <PolarAngleAxis
                dataKey="feature"
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 10]}
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                stroke="#e6e8ec"
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.18}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-ink-soft flex items-center gap-2 font-mono">
            <Sparkles className="w-4 h-4 text-accent-600" />
            Masculine / Feminine Traits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MASC_FEM_DATA(result)} barCategoryGap="40%">
              <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#334155", fontSize: 12 }}
                stroke="#e6e8ec"
              />
              <YAxis domain={[0, 10]} tick={{ fill: "#64748b", fontSize: 11 }} stroke="#e6e8ec" />
              <Tooltip
                cursor={{ fill: "rgba(37,99,235,0.06)" }}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e6e8ec",
                  borderRadius: "12px",
                  color: "#0f172a",
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                {MASC_FEM_DATA(result).map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={scoreToHex(entry.value)}
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2">
            <p className="text-xs text-ink-muted">{result.masculinity.description}</p>
            <p className="text-xs text-ink-muted">{result.femininity.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
