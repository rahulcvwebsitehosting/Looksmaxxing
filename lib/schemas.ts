import { z } from "zod";



export const analysisResultSchema = z.object({
  overall_score: z.number().min(0).max(10),
  potential_score: z.number().min(0).max(10),
  facial_symmetry: z.object({
    score: z.number().min(0).max(10),
    left_right_balance: z.number().min(0).max(10),
    eye_alignment: z.number().min(0).max(10),
    nose_center: z.number().min(0).max(10),
    lip_balance: z.number().min(0).max(10),
    description: z.string(),
  }),
  jawline: z.object({
    score: z.number().min(0).max(10),
    definition: z.string(),
    shape: z.string(),
    chin_projection: z.string(),
    gonial_angle: z.string(),
    description: z.string(),
  }),
  eyes: z.object({
    score: z.number().min(0).max(10),
    shape: z.string(),
    canthal_tilt: z.string(),
    spacing: z.string(),
    size: z.string(),
    description: z.string(),
  }),
  nose: z.object({
    score: z.number().min(0).max(10),
    shape: z.string(),
    bridge: z.string(),
    tip: z.string(),
    proportions: z.string(),
    description: z.string(),
  }),
  lips: z.object({
    score: z.number().min(0).max(10),
    fullness: z.string(),
    shape: z.string(),
    cupids_bow: z.string(),
    proportions: z.string(),
    description: z.string(),
  }),
  skin: z.object({
    score: z.number().min(0).max(10),
    clarity: z.string(),
    texture: z.string(),
    tone: z.string(),
    concerns: z.array(z.string()),
    description: z.string(),
  }),
  hair: z.object({
    score: z.number().min(0).max(10),
    density: z.string(),
    texture: z.string(),
    hairline: z.string(),
    style_suitability: z.string(),
    description: z.string(),
  }),
  eyebrows: z.object({
    score: z.number().min(0).max(10),
    shape: z.string(),
    density: z.string(),
    symmetry: z.string(),
    description: z.string(),
  }),
  facial_harmony: z.object({
    score: z.number().min(0).max(10),
    thirds_balance: z.string(),
    feature_proportion: z.string(),
    overall_blend: z.string(),
    description: z.string(),
  }),
  golden_ratio: z.object({
    score: z.number().min(0).max(10),
    facial_width_to_height: z.number().min(0).max(2),
    eye_to_mouth_distance: z.number().min(0).max(2),
    nose_to_chin_ratio: z.number().min(0).max(2),
    description: z.string(),
  }),
  masculinity: z.object({
    score: z.number().min(0).max(10),
    jaw_prominence: z.number().min(0).max(10),
    brow_ridge: z.number().min(0).max(10),
    chin_strength: z.number().min(0).max(10),
    description: z.string(),
  }),
  femininity: z.object({
    score: z.number().min(0).max(10),
    cheek_fullness: z.number().min(0).max(10),
    lip_softness: z.number().min(0).max(10),
    eye_expressiveness: z.number().min(0).max(10),
    description: z.string(),
  }),
  estimated_age: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  first_impression: z.string(),
  looksmaxxing: z.array(
    z.object({
      category: z.string(),
      suggestions: z.array(z.string()),
      difficulty: z.enum(["easy", "medium", "hard"]),
      impact: z.enum(["low", "medium", "high"]),
    })
  ),
  hairstyles: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      suitability: z.string(),
      maintenance: z.string(),
    })
  ),
  beard_styles: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      suitability: z.string(),
      maintenance: z.string(),
    })
  ),
  glasses: z.array(
    z.object({
      shape: z.string(),
      description: z.string(),
      suitability: z.string(),
    })
  ),
  skin_care: z.array(
    z.object({
      step: z.string(),
      product_type: z.string(),
      frequency: z.string(),
      priority: z.enum(["low", "medium", "high"]),
    })
  ),
  fitness: z.array(
    z.object({
      focus: z.string(),
      recommendation: z.string(),
      impact: z.string(),
    })
  ),
  confidence: z.number().min(0).max(100),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;
