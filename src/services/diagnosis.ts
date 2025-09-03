import { InitialDiagnosisResponse, QuestionsResponse, FinalDiagnosisResponse } from '../models/diagnosis';

export class DiagnosisService {
  private static instance: DiagnosisService;
  
  private constructor() {}
  
  static getInstance(): DiagnosisService {
    if (!DiagnosisService.instance) {
      DiagnosisService.instance = new DiagnosisService();
    }
    return DiagnosisService.instance;
  }

  async startDiagnosis(userId: string, image: File): Promise<InitialDiagnosisResponse> {
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch(`/api/diagnosis/start?user_id=${userId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error starting diagnosis:', error);
      // Return mock data for development/testing
      return {
        description: "Trên vùng da lưng và vai có nhiều tổn thương riêng lẻ phân bố rải rác. Các tổn thương là những sẩn gồ hoặc mụn nước nhỏ, kích thước khoảng 1 đến 3 mm, có màu hồng đỏ. Một số tổn thương có đỉnh lõm hoặc chứa dịch lỏng bên trong, một số khác có dấu hiệu đóng mày. Bờ của từng tổn thương tròn và rõ, tách biệt với vùng da xung quanh. Không quan sát thấy hiện tượng sưng nề lan tỏa, chảy mủ hay lở loét trên vùng da trong ảnh.",
        disease_primary: ["chickenpox", "sarampion", "herpes"],
        normalized_group_name: "virus"
      };
    }
  }

  async getQuestions(userId: string): Promise<QuestionsResponse> {
    try {
      const response = await fetch(`/api/diagnosis/${userId}/questions`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
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
      const response = await fetch(`/api/diagnosis/${userId}/submit?user_answers=${JSON.stringify(answers)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting answers:', error);
      // Return mock data for development/testing
      return {
        final_diagnosis: "Chickenpox"
      };
    }
  }
}