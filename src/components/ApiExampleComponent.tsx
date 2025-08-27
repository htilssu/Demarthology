import React, { useState, useEffect } from 'react';
import { authService } from '../services';
import { apiService, AuthUtils } from '../utils';
import { AuthUser } from '../types';

/**
 * Example component demonstrating API service usage
 * This component shows how to use the implemented Axios API instance
 */
const ApiExampleComponent: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // Check if user is already authenticated on component mount
  useEffect(() => {
    if (AuthUtils.isAuthenticated()) {
      loadCurrentUser();
    }
  }, []);

  const loadCurrentUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err: any) {
      setError(`Failed to load user: ${err.message}`);
      console.error('Failed to load current user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(loginForm);
      console.log('Login successful:', result);
      await loadCurrentUser(); // Load user data after successful login
    } catch (err: any) {
      setError(`Login failed: ${err.message}`);
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err: any) {
      console.error('Logout failed:', err);
      // Clear local state even if API call fails
      AuthUtils.clearTokens();
      setUser(null);
    }
  };

  const testApiCalls = async () => {
    setLoading(true);
    setError(null);

    try {
      // Example API calls using different HTTP methods
      console.log('Testing API calls...');

      // GET request example
      const publicData = await apiService.get('/public/info', {}, { skipAuth: true });
      console.log('Public data:', publicData);

      // GET with parameters
      const users = await apiService.get('/users', { page: 1, limit: 10 });
      console.log('Users:', users);

      // POST request example
      const newPost = await apiService.post('/posts', {
        title: 'Test Post',
        content: 'This is a test post'
      });
      console.log('New post:', newPost);

      // PUT request example
      const updatedPost = await apiService.put('/posts/1', {
        title: 'Updated Test Post'
      });
      console.log('Updated post:', updatedPost);

      // DELETE request example
      await apiService.delete('/posts/1');
      console.log('Post deleted successfully');

      setError('API tests completed successfully (check console for details)');
    } catch (err: any) {
      setError(`API test failed: ${err.message}`);
      console.error('API test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const testFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const uploadResult = await apiService.uploadFile(
        '/users/me/avatar',
        file,
        'avatar',
        { description: 'User avatar' }
      );
      console.log('File uploaded:', uploadResult);
      setError('File uploaded successfully');
    } catch (err: any) {
      setError(`File upload failed: ${err.message}`);
      console.error('File upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      testFileUpload(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">API Service Example</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          Loading...
        </div>
      )}

      {/* Authentication Status */}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Authentication Status</h3>
        <p>Authenticated: {AuthUtils.isAuthenticated() ? 'Yes' : 'No'}</p>
        <p>Token: {AuthUtils.getAuthToken() ? 'Present' : 'None'}</p>
        {user && (
          <div className="mt-2">
            <p>User: {user.name} ({user.email})</p>
            <p>Role: {user.role}</p>
          </div>
        )}
      </div>

      {/* Login Form */}
      {!user && (
        <form onSubmit={handleLogin} className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Login</h3>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Login
          </button>
        </form>
      )}

      {/* Logout Button */}
      {user && (
        <div className="mb-6">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}

      {/* API Test Buttons */}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-3">API Testing</h3>
        <div className="space-x-2 mb-3">
          <button
            onClick={testApiCalls}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            Test API Calls
          </button>
        </div>
        
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test File Upload:
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            disabled={loading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>

      {/* Configuration Info */}
      <div className="p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Configuration</h3>
        <pre className="text-sm text-gray-600">
          {JSON.stringify(apiService.getConfig(), null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ApiExampleComponent;