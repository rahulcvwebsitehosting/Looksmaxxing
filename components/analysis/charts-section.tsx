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
import { scoreToColor } from "@/lib/index";
import { Sparkles } from "lucide-react";

interface ChartsSectionProps {
  result: AnalysisResult;
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
      <Card className="border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            Facial Features Radar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={RADAR_DATA(result)}>
              <PolarGrid stroke="#3f3f46" />
              <PolarAngleAxis
                dataKey="feature"
                tick={{ fill: "#a1a1aa", fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 10]}
                tick={{ fill: "#71717a", fontSize: 10 }}
                stroke="#3f3f46"
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke="#a78bfa"
                fill="#a78bfa"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            Masculine / Feminine Traits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MASC_FEM_DATA(result)} barCategoryGap="40%">
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                stroke="#3f3f46"
              />
              <YAxis domain={[0, 10]} tick={{ fill: "#71717a", fontSize: 11 }} stroke="#3f3f46" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: "12px",
                  color: "#e4e4e7",
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                {MASC_FEM_DATA(result).map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={entry.name === "Masculine" ? "#6366f1" : "#ec4899"}
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2">
            <p className="text-xs text-zinc-500">{result.masculinity.description}</p>
            <p className="text-xs text-zinc-500">{result.femininity.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}