import { useState, useCallback } from 'react';

// Export all custom hooks
export * from './useUsers';
export * from './useProducts';

// Generic API operation hook
interface UseApiOperationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOperationActions<T, P> {
  execute: (params: P) => Promise<T>;
  reset: () => void;
  clearError: () => void;
}

export type UseApiOperationReturn<T, P> = UseApiOperationState<T> & UseApiOperationActions<T, P>;

/**
 * Generic hook for API operations with loading and error handling
 */
export function useApiOperation<T, P = void>(
  operation: (params: P) => Promise<T>
): UseApiOperationReturn<T, P> {
  const [state, setState] = useState<UseApiOperationState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async (params: P): Promise<T> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await operation(params);
      setState(prev => ({ ...prev, data: result, loading: false }));
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Operation failed';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, [operation]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    clearError
  };
}

// Async state hook for handling promises
interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseAsyncActions {
  run: () => Promise<void>;
  reset: () => void;
}

export type UseAsyncReturn<T> = UseAsyncState<T> & UseAsyncActions;

/**
 * Hook for handling async operations with automatic state management
 */
export function useAsync<T>(asyncFunction: () => Promise<T>): UseAsyncReturn<T> {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const run = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await asyncFunction();
      setState(prev => ({ ...prev, data: result, loading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error : new Error('Unknown error'),
        loading: false 
      }));
    }
  }, [asyncFunction]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    run,
    reset
  };
}