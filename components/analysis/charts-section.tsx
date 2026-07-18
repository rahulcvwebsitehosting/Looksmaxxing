"use client";

import { type AnalysisResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScribbleIcon } from "@/components/ui/scribble-icon";
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

interface ChartsSectionProps {
  result: AnalysisResult;
}

function scoreToHex(score: number): string {
  if (score >= 8) return "#059669";
  if (score >= 6) return "#2d5da1";
  if (score >= 4) return "#d97706";
  return "#ff4d4d";
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
    <div className="grid gap-5 md:grid-cols-2">
      <Card className="tilt-l">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display font-bold text-pencil-soft flex items-center gap-2 font-mono uppercase tracking-wide">
            <ScribbleIcon name="chart" className="w-4 h-4 stroke-marker" strokeWidth={2.2} />
            Facial Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={RADAR_DATA(result)}>
              <PolarGrid stroke="#e9e0cf" />
              <PolarAngleAxis
                dataKey="feature"
                tick={{ fill: "#2d2d2d", fontSize: 11, fontFamily: "PatrickHand" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 10]}
                tick={{ fill: "#6b6b6b", fontSize: 10 }}
                stroke="#e9e0cf"
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke="#ff4d4d"
                fill="#ff4d4d"
                fillOpacity={0.2}
                strokeWidth={2.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="tilt-r">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display font-bold text-pencil-soft flex items-center gap-2 font-mono uppercase tracking-wide">
            <ScribbleIcon name="face" className="w-4 h-4 stroke-ballpoint" strokeWidth={2.2} />
            Masc / Fem Traits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MASC_FEM_DATA(result)} barCategoryGap="40%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f5efe2" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#2d2d2d", fontSize: 12, fontFamily: "PatrickHand" }}
                stroke="#e9e0cf"
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fill: "#6b6b6b", fontSize: 11 }}
                stroke="#e9e0cf"
              />
              <Tooltip
                cursor={{ fill: "rgba(255,77,77,0.06)" }}
                contentStyle={{
                  backgroundColor: "#fdfbf7",
                  border: "2px solid #2d2d2d",
                  borderRadius: "10px 14px 10px 12px",
                  color: "#2d2d2d",
                  fontFamily: "PatrickHand",
                  boxShadow: "3px 3px 0 0 #2d2d2d",
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={60}>
                {MASC_FEM_DATA(result).map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={scoreToHex(entry.value)}
                    fillOpacity={0.85}
                    stroke="#2d2d2d"
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2">
            <p className="text-sm text-pencil-muted font-body">{result.masculinity.description}</p>
            <p className="text-sm text-pencil-muted font-body">{result.femininity.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
