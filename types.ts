export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  UNKNOWN = 'Unknown'
}

export interface PatientRecord {
  id: string;
  name: string; // Synthetic name
  age: number;
  gender: string;
  familyHistoryText: string;
}

export interface RiskFactor {
  condition: string;
  relative: string;
  riskAssessment: RiskLevel;
  notes: string;
}

export interface AnalysisResult {
  patientId: string;
  summaryEn: string;
  summaryAr: string;
  riskFactors: RiskFactor[];
  recommendationsEn: string[];
  recommendationsAr: string[];
  dataQualityIssue?: boolean;
}

export interface AnalysisResponse {
  results: AnalysisResult[];
}

export type Language = 'en' | 'ar';

export const SYNTHETIC_DATA_ONLY_MSG = "Synthentic Data Only / Decision Support System";