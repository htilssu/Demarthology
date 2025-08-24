// User management hook - Controller for user state and operations
import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services';
import { User, UserModel, CreateUserRequest, UpdateUserRequest, UserListParams } from '../models';

interface UseUsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UseUsersActions {
  fetchUsers: (params?: UserListParams) => Promise<void>;
  createUser: (userData: CreateUserRequest) => Promise<UserModel>;
  updateUser: (id: string, updates: UpdateUserRequest) => Promise<UserModel>;
  deleteUser: (id: string) => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  clearError: () => void;
  refreshUsers: () => Promise<void>;
}

export type UseUsersReturn = UseUsersState & UseUsersActions;

/**
 * Custom hook for managing users state and operations
 */
export function useUsers(initialParams: UserListParams = {}): UseUsersReturn {
  const [state, setState] = useState<UseUsersState>({
    users: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    }
  });

  const [currentParams, setCurrentParams] = useState<UserListParams>(initialParams);

  // Fetch users
  const fetchUsers = useCallback(async (params: UserListParams = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const newParams = { ...currentParams, ...params };
      setCurrentParams(newParams);
      
      const response = await userService.getUsers(newParams);
      
      setState(prev => ({
        ...prev,
        users: response.data,
        pagination: response.pagination,
        loading: false
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to fetch users',
        loading: false
      }));
    }
  }, [currentParams]);

  // Create user
  const createUser = useCallback(async (userData: CreateUserRequest): Promise<UserModel> => {
    setState(prev => ({ ...prev, error: null }));
    
    try {
      const newUser = await userService.createUser(userData);
      
      // Refresh the list
      await fetchUsers();
      
      return newUser;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to create user'
      }));
      throw error;
    }
  }, [fetchUsers]);

  // Update user
  const updateUser = useCallback(async (id: string, updates: UpdateUserRequest): Promise<UserModel> => {
    setState(prev => ({ ...prev, error: null }));
    
    try {
      const updatedUser = await userService.updateUser(id, updates);
      
      // Update the user in the local state
      setState(prev => ({
        ...prev,
        users: prev.users.map(user => 
          user.id === id ? updatedUser.getData() : user
        )
      }));
      
      return updatedUser;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to update user'
      }));
      throw error;
    }
  }, []);

  // Delete user
  const deleteUser = useCallback(async (id: string): Promise<void> => {
    setState(prev => ({ ...prev, error: null }));
    
    try {
      await userService.deleteUser(id);
      
      // Remove the user from the local state
      setState(prev => ({
        ...prev,
        users: prev.users.filter(user => user.id !== id),
        pagination: {
          ...prev.pagination,
          total: prev.pagination.total - 1
        }
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to delete user'
      }));
      throw error;
    }
  }, []);

  // Search users
  const searchUsers = useCallback(async (query: string): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const users = await userService.searchUsers(query);
      
      setState(prev => ({
        ...prev,
        users,
        loading: false,
        pagination: {
          page: 1,
          limit: users.length,
          total: users.length,
          totalPages: 1
        }
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to search users',
        loading: false
      }));
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Refresh users with current parameters
  const refreshUsers = useCallback(async (): Promise<void> => {
    await fetchUsers(currentParams);
  }, [fetchUsers, currentParams]);

  // Initial load
  useEffect(() => {
    fetchUsers(initialParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return {
    ...state,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    clearError,
    refreshUsers
  };
}

// Hook for managing a single user
interface UseUserState {
  user: UserModel | null;
  loading: boolean;
  error: string | null;
}

interface UseUserActions {
  fetchUser: (id: string) => Promise<void>;
  updateUser: (updates: UpdateUserRequest) => Promise<UserModel>;
  clearError: () => void;
  clearUser: () => void;
}

export type UseUserReturn = UseUserState & UseUserActions;

/**
 * Custom hook for managing a single user
 */
export function useUser(userId?: string): UseUserReturn {
  const [state, setState] = useState<UseUserState>({
    user: null,
    loading: false,
    error: null
  });

  // Fetch user by ID
  const fetchUser = useCallback(async (id: string): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const user = await userService.getUserById(id);
      setState(prev => ({ ...prev, user, loading: false }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to fetch user',
        loading: false
      }));
    }
  }, []);

  // Update user
  const updateUser = useCallback(async (updates: UpdateUserRequest): Promise<UserModel> => {
    if (!state.user) {
      throw new Error('No user loaded');
    }

    setState(prev => ({ ...prev, error: null }));
    
    try {
      const updatedUser = await userService.updateUser(state.user.getData().id, updates);
      setState(prev => ({ ...prev, user: updatedUser }));
      return updatedUser;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to update user'
      }));
      throw error;
    }
  }, [state.user]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Clear user
  const clearUser = useCallback(() => {
    setState({ user: null, loading: false, error: null });
  }, []);

  // Load user on mount if userId provided
  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId, fetchUser]);

  return {
    ...state,
    fetchUser,
    updateUser,
    clearError,
    clearUser
  };
}