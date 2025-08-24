import React, { useState } from 'react';
import { apiClient } from '../utils/api';
import { ApiError } from '../types';
import Button from './Button';

const ApiDemo: React.FC = () => {
  const [apiUrl, setApiUrl] = useState(apiClient.getBaseURL());
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testApiConnection = async () => {
    setLoading(true);
    setResponse('');
    
    try {
      // Try to make a simple GET request
      const result = await apiClient.get('/health');
      setResponse(`✅ API Connected Successfully!\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      const apiError = error as ApiError;
      setResponse(`❌ API Connection Failed:\n${apiError.message}\n\nThis is expected as no API server is running.`);
    } finally {
      setLoading(false);
    }
  };

  const updateApiUrl = () => {
    apiClient.setBaseURL(apiUrl);
    setResponse(`🔄 API URL updated to: ${apiUrl}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        🌐 API Client Demo
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current API URL:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter API URL"
            />
            <Button onClick={updateApiUrl} size="sm">
              Update
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Reads from REACT_APP_API_URL environment variable
          </p>
        </div>

        <div>
          <Button 
            onClick={testApiConnection} 
            disabled={loading}
            className="w-full"
          >
            {loading ? '🔄 Testing Connection...' : '🚀 Test API Connection'}
          </Button>
        </div>

        {response && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response:
            </label>
            <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto max-h-64 whitespace-pre-wrap">
              {response}
            </pre>
          </div>
        )}

        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
          <h3 className="font-medium mb-2">📚 Available API Methods:</h3>
          <ul className="space-y-1">
            <li>• <code>apiClient.get(endpoint)</code> - GET request</li>
            <li>• <code>apiClient.post(endpoint, data)</code> - POST request</li>
            <li>• <code>apiClient.put(endpoint, data)</code> - PUT request</li>
            <li>• <code>apiClient.delete(endpoint)</code> - DELETE request</li>
            <li>• <code>apiClient.patch(endpoint, data)</code> - PATCH request</li>
            <li>• <code>apiClient.setAuthToken(token)</code> - Set auth token</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApiDemo;