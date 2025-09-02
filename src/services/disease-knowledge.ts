import { ApiService } from '../utils/api';
import { DiseaseKnowledgeResponse, DiseaseSearchParams } from '../models/disease';

/**
 * Disease Knowledge Service for looking up disease information
 */
export class DiseaseKnowledgeService {
  private static instance: DiseaseKnowledgeService;
  private apiService: ApiService;

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  static getInstance(): DiseaseKnowledgeService {
    if (!DiseaseKnowledgeService.instance) {
      DiseaseKnowledgeService.instance = new DiseaseKnowledgeService();
    }
    return DiseaseKnowledgeService.instance;
  }

  /**
   * Search for disease information by name with translation
   * @param params Disease search parameters
   * @returns Promise with disease information including translated name
   */
  async searchDisease(params: DiseaseSearchParams): Promise<DiseaseKnowledgeResponse> {
    try {
      const response = await this.apiService.get<DiseaseKnowledgeResponse>(
        '/api/knowledge/translate',
        {
          disease_name: params.disease_name
        }
      );
      return response;
    } catch (error) {
      console.error('Error searching disease:', error);
      throw new Error('Không thể tìm kiếm thông tin bệnh. Vui lòng thử lại sau.');
    }
  }
}