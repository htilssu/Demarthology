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
      
      // Check if the error is about unsupported disease group
      const errorMessage = error?.details?.detail || error?.message || '';
      if (errorMessage.includes('chưa hỗ trợ') || errorMessage.includes('không thể chẩn đoán')) {
        // Re-throw the error so it can be handled properly in the UI
        throw new Error(errorMessage);
      }
      
      // For other errors, return mock data for development/testing
      return {
        description: "Trên vùng da lưng và vai có nhiều tổn thương riêng lẻ phân bố rải rác. Các tổn thương là những sẩn gồ hoặc mụn nước nhỏ, kích thước khoảng 1 đến 3 mm, có màu hồng đỏ. Một số tổn thương có đỉnh lõm hoặc chứa dịch lỏng bên trong, một số khác có dấu hiệu đóng mày. Bờ của từng tổn thương tròn và rõ, tách biệt với vùng da xung quanh. Không quan sát thấy hiện tượng sưng nề lan tỏa, chảy mủ hay lở loét trên vùng da trong ảnh.",
        disease_primary: ["chickenpox", "sarampion", "herpes"],
        normalized_group_name: "virus"
      };
    }
  }

  async getQuestions(userId: string): Promise<QuestionsResponse> {
    try {
      const response = await this.apiService.get<QuestionsResponse>(`/api/diagnosis/${userId}/questions`);
      return response;
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Return mock data for development/testing
      return {
        questions: [
          "Bạn có nhận thấy các mụn nước mới vẫn tiếp tục mọc lên trong khi các nốt cũ đã bắt đầu khô và đóng mày không?",
          "Trước khi các nốt này xuất hiện, bạn có nhìn thấy những đốm trắng nhỏ bên trong má của mình không?",
          "Vùng da này có bị đau rát hoặc châm chích chỉ ở một bên cơ thể vài ngày trước khi phát ban không?"
        ]
      };
    }
  }

  async submitAnswers(userId: string, answers: string[]): Promise<FinalDiagnosisResponse> {
    try {
      const response = await this.apiService.post<FinalDiagnosisResponse>(
        `/api/diagnosis/${userId}/submit?user_answers=${JSON.stringify(answers)}`
      );
      return response;
    } catch (error) {
      console.error('Error submitting answers:', error);
      // Return mock data for development/testing
      return {
        final_diagnosis: "Chickenpox"
      };
    }
  }
}