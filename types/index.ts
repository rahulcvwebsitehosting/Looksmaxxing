export interface AnalysisResult {
  overall_score: number;
  potential_score: number;
  facial_symmetry: {
    score: number;
    left_right_balance: number;
    eye_alignment: number;
    nose_center: number;
    lip_balance: number;
    description: string;
  };
  jawline: {
    score: number;
    definition: string;
    shape: string;
    chin_projection: string;
    gonial_angle: string;
    description: string;
  };
  eyes: {
    score: number;
    shape: string;
    canthal_tilt: string;
    spacing: string;
    size: string;
    description: string;
  };
  nose: {
    score: number;
    shape: string;
    bridge: string;
    tip: string;
    proportions: string;
    description: string;
  };
  lips: {
    score: number;
    fullness: string;
    shape: string;
    cupids_bow: string;
    proportions: string;
    description: string;
  };
  skin: {
    score: number;
    clarity: string;
    texture: string;
    tone: string;
    concerns: string[];
    description: string;
  };
  hair: {
    score: number;
    density: string;
    texture: string;
    hairline: string;
    style_suitability: string;
    description: string;
  };
  eyebrows: {
    score: number;
    shape: string;
    density: string;
    symmetry: string;
    description: string;
  };
  facial_harmony: {
    score: number;
    thirds_balance: string;
    feature_proportion: string;
    overall_blend: string;
    description: string;
  };
  golden_ratio: {
    score: number;
    facial_width_to_height: number;
    eye_to_mouth_distance: number;
    nose_to_chin_ratio: number;
    description: string;
  };
  masculinity: {
    score: number;
    jaw_prominence: number;
    brow_ridge: number;
    chin_strength: number;
    description: string;
  };
  femininity: {
    score: number;
    cheek_fullness: number;
    lip_softness: number;
    eye_expressiveness: number;
    description: string;
  };
  estimated_age: number;
  strengths: string[];
  weaknesses: string[];
  first_impression: string;
  looksmaxxing: {
    category: string;
    suggestions: string[];
    difficulty: "easy" | "medium" | "hard";
    impact: "low" | "medium" | "high";
  }[];
  hairstyles: {
    name: string;
    description: string;
    suitability: string;
    maintenance: string;
  }[];
  beard_styles: {
    name: string;
    description: string;
    suitability: string;
    maintenance: string;
  }[];
  glasses: {
    shape: string;
    description: string;
    suitability: string;
  }[];
  skin_care: {
    step: string;
    product_type: string;
    frequency: string;
    priority: "low" | "medium" | "high";
  }[];
  fitness: {
    focus: string;
    recommendation: string;
    impact: string;
  }[];
  confidence: number;
}

export interface ProviderStatus {
  provider: string;
  available: boolean;
  latency: number;
  lastChecked: number;
}

export interface UploadState {
  imageBase64: string | null;
  imageFile: File | null;
  status: "idle" | "compressing" | "analyzing" | "complete" | "error";
  progress: number;
  currentProvider: string;
  result: AnalysisResult | null;
  error: string | null;
  isCameraMode: boolean;
}