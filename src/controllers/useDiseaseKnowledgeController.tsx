import { useState, useCallback } from 'react';
import { DiseaseInfo, DiseaseSearchParams } from '../models/disease';
import { DiseaseKnowledgeService } from '../services/disease-knowledge';

/**
 * Controller for disease knowledge lookup functionality
 */
export function useDiseaseKnowledgeController() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [diseaseInfo, setDiseaseInfo] = useState<DiseaseInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const diseaseService = DiseaseKnowledgeService.getInstance();

  /**
   * Search for disease information
   */
  const searchDisease = useCallback(async (query: string) => {
    if (!query.trim()) {
      setError('Vui lòng nhập tên bệnh để tìm kiếm');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const params: DiseaseSearchParams = {
        disease_name: query.trim()
      };

      const response = await diseaseService.searchDisease(params);
      
      if (response.disease_info && response.disease_info.length > 0) {
        setDiseaseInfo(response.disease_info);
      } else {
        setDiseaseInfo([]);
        setError('Không tìm thấy thông tin về bệnh này. Vui lòng thử với tên bệnh khác.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tìm kiếm');
      setDiseaseInfo([]);
    } finally {
      setLoading(false);
    }
  }, [diseaseService]);

  /**
   * Handle search form submission
   */
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    searchDisease(searchQuery);
  }, [searchQuery, searchDisease]);

  /**
   * Clear search results and reset state
   */
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDiseaseInfo([]);
    setError(null);
    setHasSearched(false);
  }, []);

  return {
    // State
    searchQuery,
    diseaseInfo,
    loading,
    error,
    hasSearched,
    
    // Actions
    setSearchQuery,
    searchDisease,
    handleSearch,
    clearSearch
  };
}