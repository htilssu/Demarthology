export interface InitialDiagnosisResponse {
  description: string;
  disease_primary: string[];
  normalized_group_name: string;
}

export interface QuestionsResponse {
  questions: string[];
}

export interface FinalDiagnosisResponse {
  final_diagnosis: string;
}

export interface DiagnosisState {
  step: 'upload' | 'initial' | 'questions' | 'final';
  userId?: string;
  uploadedImage?: File;
  initialResult?: InitialDiagnosisResponse;
  questions?: string[];
  answers?: string[];
  currentQuestionIndex?: number;
  finalResult?: FinalDiagnosisResponse;
  diseaseInfo?: import('../models/disease').DiseaseInfo[];
  diseaseInfoLoading?: boolean;
  diseaseInfoError?: string;
  loading: boolean;
  error?: string;
}