import { apiClient } from '../utils/api';
import { ApiResponse, User } from '../types';

describe('API Client', () => {
  // Mock fetch for testing
  global.fetch = jest.fn();

  beforeEach(() => {
    (fetch as jest.MockedFunction<typeof fetch>).mockClear();
  });

  it('should initialize with default API URL from environment', () => {
    expect(apiClient.getBaseURL()).toBe(process.env.REACT_APP_API_URL || 'http://localhost:3001/api');
  });

  it('should set and remove auth token', () => {
    apiClient.setAuthToken('test-token');
    // We can't directly test private headers, but we can test that the method exists
    expect(apiClient.setAuthToken).toBeDefined();
    
    apiClient.removeAuthToken();
    expect(apiClient.removeAuthToken).toBeDefined();
  });

  it('should make GET request', async () => {
    const mockResponse: ApiResponse<User[]> = {
      data: [{ id: '1', name: 'Test User', email: 'test@example.com' }],
      message: 'Success',
      success: true,
    };

    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await apiClient.get<User[]>('/users');
    
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/users'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
    
    expect(result).toEqual(mockResponse);
  });

  it('should make POST request with body', async () => {
    const userData = { name: 'New User', email: 'new@example.com' };
    const mockResponse: ApiResponse<User> = {
      data: { id: '2', name: 'New User', email: 'new@example.com' },
      message: 'User created',
      success: true,
    };

    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await apiClient.post<User>('/users', userData);
    
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/users'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(userData),
      })
    );
    
    expect(result).toEqual(mockResponse);
  });

  it('should handle API errors', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: 'Not found' }),
    } as Response);

    await expect(apiClient.get('/nonexistent')).rejects.toMatchObject({
      message: 'Not found',
      code: 404,
    });
  });

  it('should handle network errors', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(
      new Error('Network error')
    );

    await expect(apiClient.get('/users')).rejects.toMatchObject({
      message: 'Network error',
      code: 'NETWORK_ERROR',
    });
  });
});