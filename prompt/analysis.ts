export function buildAnalysisPrompt(): string {
  return `Analyze the facial image and return a concise structured JSON report.

EFFICIENCY RULES (CRITICAL for fast response):
- All "description" fields: max 12 words. Short and specific.
- All string fields (shape, definition, etc.): 1-3 words only.
- All arrays: exactly 3 items (no more, no less).
- Avoid flowery language. Be direct and brief.

ENUM RULES:
- "difficulty": lowercase "easy" | "medium" | "hard" only.
- "impact": lowercase "low" | "medium" | "high" only.
- "priority": lowercase "low" | "medium" | "high" only.

RESPOND WITH EXACTLY THIS JSON STRUCTURE:

{
  "overall_score": <0-10>,
  "potential_score": <0-10>,
  "facial_symmetry": {
    "score": <0-10>,
    "left_right_balance": <0-10>,
    "eye_alignment": <0-10>,
    "nose_center": <0-10>,
    "lip_balance": <0-10>,
    "description": "<short>"
  },
  "jawline": {
    "score": <0-10>,
    "definition": "<string>",
    "shape": "<string>",
    "chin_projection": "<string>",
    "gonial_angle": "<string>",
    "description": "<short>"
  },
  "eyes": {
    "score": <0-10>,
    "shape": "<string>",
    "canthal_tilt": "<string>",
    "spacing": "<string>",
    "size": "<string>",
    "description": "<short>"
  },
  "nose": {
    "score": <0-10>,
    "shape": "<string>",
    "bridge": "<string>",
    "tip": "<string>",
    "proportions": "<string>",
    "description": "<short>"
  },
  "lips": {
    "score": <0-10>,
    "fullness": "<string>",
    "shape": "<string>",
    "cupids_bow": "<string>",
    "proportions": "<string>",
    "description": "<short>"
  },
  "skin": {
    "score": <0-10>,
    "clarity": "<string>",
    "texture": "<string>",
    "tone": "<string>",
    "concerns": ["<string>", "<string>", "<string>"],
    "description": "<short>"
  },
  "hair": {
    "score": <0-10>,
    "density": "<string>",
    "texture": "<string>",
    "hairline": "<string>",
    "style_suitability": "<string>",
    "description": "<short>"
  },
  "eyebrows": {
    "score": <0-10>,
    "shape": "<string>",
    "density": "<string>",
    "symmetry": "<string>",
    "description": "<short>"
  },
  "facial_harmony": {
    "score": <0-10>,
    "thirds_balance": "<string>",
    "feature_proportion": "<string>",
    "overall_blend": "<string>",
    "description": "<short>"
  },
  "golden_ratio": {
    "score": <0-10>,
    "facial_width_to_height": <0-2>,
    "eye_to_mouth_distance": <0-2>,
    "nose_to_chin_ratio": <0-2>,
    "description": "<short>"
  },
  "masculinity": {
    "score": <0-10>,
    "jaw_prominence": <0-10>,
    "brow_ridge": <0-10>,
    "chin_strength": <0-10>,
    "description": "<short>"
  },
  "femininity": {
    "score": <0-10>,
    "cheek_fullness": <0-10>,
    "lip_softness": <0-10>,
    "eye_expressiveness": <0-10>,
    "description": "<short>"
  },
  "estimated_age": <number>,
  "strengths": ["<string>", "<string>", "<string>"],
  "weaknesses": ["<string>", "<string>", "<string>"],
  "first_impression": "<short>",
  "looksmaxxing": [
    { "category": "<string>", "suggestions": ["<string>"], "difficulty": "easy", "impact": "high" },
    { "category": "<string>", "suggestions": ["<string>"], "difficulty": "medium", "impact": "medium" },
    { "category": "<string>", "suggestions": ["<string>"], "difficulty": "easy", "impact": "medium" }
  ],
  "hairstyles": [
    { "name": "<string>", "description": "<short>", "suitability": "<string>", "maintenance": "low" },
    { "name": "<string>", "description": "<short>", "suitability": "<string>", "maintenance": "medium" },
    { "name": "<string>", "description": "<short>", "suitability": "<string>", "maintenance": "low" }
  ],
  "beard_styles": [
    { "name": "<string>", "description": "<short>", "suitability": "<string>", "maintenance": "low" },
    { "name": "<string>", "description": "<short>", "suitability": "<string>", "maintenance": "medium" },
    { "name": "<string>", "description": "<short>", "suitability": "<string>", "maintenance": "low" }
  ],
  "glasses": [
    { "shape": "<string>", "description": "<short>", "suitability": "<string>" },
    { "shape": "<string>", "description": "<short>", "suitability": "<string>" },
    { "shape": "<string>", "description": "<short>", "suitability": "<string>" }
  ],
  "skin_care": [
    { "step": "<string>", "product_type": "<string>", "frequency": "<string>", "priority": "high" },
    { "step": "<string>", "product_type": "<string>", "frequency": "<string>", "priority": "medium" },
    { "step": "<string>", "product_type": "<string>", "frequency": "<string>", "priority": "low" }
  ],
  "fitness": [
    { "focus": "<string>", "recommendation": "<short>", "impact": "<string>" },
    { "focus": "<string>", "recommendation": "<short>", "impact": "<string>" },
    { "focus": "<string>", "recommendation": "<short>", "impact": "<string>" }
  ],
  "confidence": <0-100>
}

Return ONLY the raw JSON. Begin now.`;
}
