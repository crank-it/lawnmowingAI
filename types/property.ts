export type GradientLevel = "Flat" | "Gentle slope" | "Moderate slope" | "Steep";
export type AccessDifficulty = "Easy" | "Standard" | "Tricky";

export interface PropertyData {
  totalArea: number; // m²
  lawnArea: number; // m²
  gradient: GradientLevel;
  estimatedEdging: number; // metres
  accessDifficulty: AccessDifficulty;
  hedgeLength: number; // metres
}

export interface PropertyAnalysisResult {
  address: string;
  suburb: string;
  propertyData: PropertyData;
  confidence: number; // 0-100
  analyzedAt: Date;
}
