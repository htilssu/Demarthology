import { useState, useCallback } from 'react';
import { checkProcessService } from '../services/check-process';
import { authService } from '../services/auth';
import { 
  CheckProcessState,
  CheckProcessHistory,
  TrackCheckProcessResponse
} from '../models/check-process';

export function useCheckProcessController() {
  const [state, setState] = useState<CheckProcessState>({
    isLoading: false,
    currentProcess: null,
    comparison: null,
    history: checkProcessService.getHistory(),
    error: null
  });

  const [sliderPosition, setSliderPosition] = useState(50);

  // Step 1: Upload first image and create check process
  const createCheckProcess = useCallback(async (image: File) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Get current user
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Vui lòng đăng nhập để sử dụng tính năng này');
      }

      const result = await checkProcessService.createCheckProcess(currentUser._id, image);
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        currentProcess: result,
        comparison: null 
      }));

      return result;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message 
      }));
      throw error;
    }
  }, []);

  // Step 2: Upload second image and track check process
  const trackCheckProcess = useCallback(async (image: File) => {
    try {
      if (!state.currentProcess) {
        throw new Error('Vui lòng tạo quá trình kiểm tra trước');
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Get current user
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Vui lòng đăng nhập để sử dụng tính năng này');
      }

      const result = await checkProcessService.trackCheckProcess(
        state.currentProcess.id,
        currentUser._id,
        image
      );
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        comparison: result,
        history: checkProcessService.getHistory() // Refresh history
      }));

      return result;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message 
      }));
      throw error;
    }
  }, [state.currentProcess]);

  // Reset the process to start over
  const resetProcess = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentProcess: null,
      comparison: null,
      error: null
    }));
    setSliderPosition(50);
  }, [setSliderPosition]);

  // Load history item for viewing
  const loadHistoryItem = useCallback((historyItem: CheckProcessHistory) => {
    const comparison: TrackCheckProcessResponse = {
      first_image: historyItem.firstImage,
      latest_image: historyItem.latestImage
    };

    setState(prev => ({
      ...prev,
      comparison,
      currentProcess: null,
      error: null
    }));
    setSliderPosition(50);
  }, [setSliderPosition]);

  // Remove history item
  const removeHistoryItem = useCallback((historyId: string) => {
    checkProcessService.removeHistoryItem(historyId);
    setState(prev => ({
      ...prev,
      history: checkProcessService.getHistory()
    }));
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    checkProcessService.clearHistory();
    setState(prev => ({
      ...prev,
      history: []
    }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Get user specific history
  const getUserHistory = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        return [];
      }
      return checkProcessService.getUserHistory(currentUser._id);
    } catch (error) {
      console.error('Failed to get user history:', error);
      return [];
    }
  }, []);

  return {
    // State
    state,
    sliderPosition,
    setSliderPosition,

    // Actions
    createCheckProcess,
    trackCheckProcess,
    resetProcess,
    loadHistoryItem,
    removeHistoryItem,
    clearHistory,
    clearError,
    getUserHistory,

    // Computed
    isStep1Complete: !!state.currentProcess,
    isStep2Complete: !!state.comparison,
    canShowComparison: !!state.comparison,
    hasHistory: state.history.length > 0
  };
}