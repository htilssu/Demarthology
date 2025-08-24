// MVC Demo Component - Comprehensive example showing the MVC pattern
import React, { useState } from 'react';
import UserList from './UserList';
import ProductList from './ProductList';
import Button from './Button';

const MVCDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'products' | 'explanation'>('explanation');

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          🏗️ MVC Architecture Demo
        </h1>
        <p className="text-gray-600">
          Complete Model-View-Controller pattern implementation with React, TypeScript, and Axios
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-1 mb-6">
        <Button
          onClick={() => setActiveTab('explanation')}
          variant={activeTab === 'explanation' ? 'primary' : 'outline'}
          size="sm"
        >
          📚 Architecture
        </Button>
        <Button
          onClick={() => setActiveTab('users')}
          variant={activeTab === 'users' ? 'primary' : 'outline'}
          size="sm"
        >
          👥 Users
        </Button>
        <Button
          onClick={() => setActiveTab('products')}
          variant={activeTab === 'products' ? 'primary' : 'outline'}
          size="sm"
        >
          📦 Products
        </Button>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'explanation' && (
          <div className="space-y-6">
            {/* MVC Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                🎯 MVC Pattern Implementation
              </h2>
              <p className="text-gray-700 mb-4">
                This project implements a complete Model-View-Controller (MVC) architecture pattern
                designed for scalable React applications with TypeScript and Axios.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Model */}
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h3 className="font-semibold text-blue-600 mb-2">📋 Model Layer</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Data structures & interfaces</li>
                    <li>• Business logic & validation</li>
                    <li>• Type definitions</li>
                    <li>• Model classes with methods</li>
                  </ul>
                  <div className="mt-2 text-xs text-gray-500">
                    <strong>Files:</strong> src/models/
                  </div>
                </div>

                {/* View */}
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h3 className="font-semibold text-green-600 mb-2">🎨 View Layer</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• React components</li>
                    <li>• UI presentation logic</li>
                    <li>• User interactions</li>
                    <li>• Form handling</li>
                  </ul>
                  <div className="mt-2 text-xs text-gray-500">
                    <strong>Files:</strong> src/components/
                  </div>
                </div>

                {/* Controller */}
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h3 className="font-semibold text-purple-600 mb-2">🎮 Controller Layer</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Custom React hooks</li>
                    <li>• API service classes</li>
                    <li>• State management</li>
                    <li>• Business operations</li>
                  </ul>
                  <div className="mt-2 text-xs text-gray-500">
                    <strong>Files:</strong> src/hooks/, src/services/
                  </div>
                </div>
              </div>
            </div>

            {/* API Architecture */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                🌐 API Integration with Axios
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-green-600 mb-3">API Client Features</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>✅ <strong>Axios-powered HTTP client</strong> - Modern, feature-rich</li>
                    <li>✅ <strong>Environment configuration</strong> - Reads from REACT_APP_API_URL</li>
                    <li>✅ <strong>Complete HTTP methods</strong> - GET, POST, PUT, DELETE, PATCH</li>
                    <li>✅ <strong>Authentication support</strong> - Token management</li>
                    <li>✅ <strong>Error handling</strong> - Comprehensive with interceptors</li>
                    <li>✅ <strong>TypeScript support</strong> - Fully typed responses</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-green-600 mb-3">Service Layer Pattern</h3>
                  <div className="bg-white p-3 rounded-md text-sm">
                    <pre className="text-gray-700">{`// Example API call through service
import { userService } from '../services';

const users = await userService.getUsers({
  page: 1,
  limit: 10,
  role: 'user'
});

const newUser = await userService.createUser({
  username: 'john_doe',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'secure123'
});`}</pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Implementation Example */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                💻 Implementation Example
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-purple-600 mb-2">User Management Flow</h3>
                  <div className="bg-white p-4 rounded-md text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <strong className="text-blue-600">1. Model (User.ts)</strong>
                        <pre className="text-xs text-gray-600 mt-1">{`interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

class UserModel {
  get fullName(): string
  get isAdmin(): boolean
  static validate(): string[]
}`}</pre>
                      </div>
                      <div>
                        <strong className="text-green-600">2. Controller</strong>
                        <pre className="text-xs text-gray-600 mt-1">{`// UserService.ts
class UserService {
  async getUsers(params)
  async createUser(data)
  async updateUser(id, data)
}

// useUsers.ts
const {
  users, loading, error,
  createUser, updateUser
} = useUsers();`}</pre>
                      </div>
                      <div>
                        <strong className="text-purple-600">3. View (UserList.tsx)</strong>
                        <pre className="text-xs text-gray-600 mt-1">{`const UserList = () => {
  const { users, createUser } = useUsers();
  
  const handleCreate = async (data) => {
    await createUser(data);
  };
  
  return <div>...</div>;
};`}</pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-md">
                  <h3 className="font-medium text-yellow-700 mb-2">🚀 Benefits of This Architecture</h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• <strong>Separation of Concerns:</strong> Each layer has a clear responsibility</li>
                    <li>• <strong>Reusability:</strong> Services and hooks can be used across components</li>
                    <li>• <strong>Testability:</strong> Each layer can be tested independently</li>
                    <li>• <strong>Maintainability:</strong> Changes in one layer don't affect others</li>
                    <li>• <strong>Scalability:</strong> Easy to add new features and functionality</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Try It Out */}
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Try out the live examples by clicking the tabs above!
              </p>
              <div className="flex justify-center gap-3">
                <Button onClick={() => setActiveTab('users')} variant="primary">
                  👥 Explore User Management
                </Button>
                <Button onClick={() => setActiveTab('products')} variant="outline">
                  📦 Explore Product Management
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && <UserList />}
        {activeTab === 'products' && <ProductList />}
      </div>
    </div>
  );
};

export default MVCDemo;