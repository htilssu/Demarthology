import { InitialDiagnosisResponse, QuestionsResponse, FinalDiagnosisResponse } from '../models/diagnosis';
import { ApiService } from '../utils/api';

export class DiagnosisService {
  private static instance: DiagnosisService;
  private apiService: ApiService;
  
  private constructor() {
    this.apiService = ApiService.getInstance();
  }
  
  static getInstance(): DiagnosisService {
    if (!DiagnosisService.instance) {
      DiagnosisService.instance = new DiagnosisService();
    }
    return DiagnosisService.instance;
  }

  async startDiagnosis(userId: string, image: File): Promise<InitialDiagnosisResponse> {
    try {
      const response = await this.apiService.uploadFile<InitialDiagnosisResponse>(
        `/api/diagnosis/start?user_id=${userId}`,
        image,
        'image'
      );
      return response;
    } catch (error: any) {
      console.error('Error starting diagnosis:', error);
      
      // Extract and throw the actual error message from API
      const errorMessage = error?.details?.detail || error?.message || 'Có lỗi xảy ra khi phân tích ảnh. Vui lòng thử lại.';
      throw new Error(errorMessage);
    }
  }

  async getQuestions(userId: string): Promise<QuestionsResponse> {
    try {
      const response = await this.apiService.get<QuestionsResponse>(`/api/diagnosis/${userId}/questions`);
      return response;
    } catch (error: any) {
      console.error('Error fetching questions:', error);
      // Extract and throw the actual error message from API
      const errorMessage = error?.details?.detail || error?.message || 'Không thể tải câu hỏi. Vui lòng thử lại.';
      throw new Error(errorMessage);
    }
  }

  async submitAnswers(userId: string, answers: string[]): Promise<FinalDiagnosisResponse> {
    try {
      const response = await this.apiService.post<FinalDiagnosisResponse>(
        `/api/diagnosis/${userId}/submit?user_answers=${JSON.stringify(answers)}`
      );
      return response;
    } catch (error: any) {
      console.error('Error submitting answers:', error);
      // Extract and throw the actual error message from API
      const errorMessage = error?.details?.detail || error?.message || 'Không thể gửi câu trả lời. Vui lòng thử lại.';
      throw new Error(errorMessage);
    }
  }
}