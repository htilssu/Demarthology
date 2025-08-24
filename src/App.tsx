import React, { useState } from 'react';
import Button from './components/Button';
import ApiDemo from './components/ApiDemo';
import MVCDemo from './components/MVCDemo';

function App() {
  const [activeDemo, setActiveDemo] = useState<'welcome' | 'api' | 'mvc'>('welcome');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Demarthology - MVC Architecture Demo
          </h1>
          <p className="text-lg text-gray-600">
            Complete TypeScript React application with MVC pattern, Axios integration, and modern architecture
          </p>
        </header>

        {/* Navigation */}
        <div className="flex justify-center space-x-2 mb-8">
          <Button
            onClick={() => setActiveDemo('welcome')}
            variant={activeDemo === 'welcome' ? 'primary' : 'outline'}
            size="sm"
          >
            🏠 Welcome
          </Button>
          <Button
            onClick={() => setActiveDemo('api')}
            variant={activeDemo === 'api' ? 'primary' : 'outline'}
            size="sm"
          >
            🌐 API Demo
          </Button>
          <Button
            onClick={() => setActiveDemo('mvc')}
            variant={activeDemo === 'mvc' ? 'primary' : 'outline'}
            size="sm"
          >
            🏗️ MVC Demo
          </Button>
        </div>

        {/* Content */}
        <div className="mb-8">
          {activeDemo === 'welcome' && (
            <div className="space-y-8">
              {/* Technology Stack */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    ⚛️ React 19
                  </h2>
                  <p className="text-gray-600">
                    Latest React with hooks and modern patterns
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    📝 TypeScript
                  </h2>
                  <p className="text-gray-600">
                    Fully typed for better development experience
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    🌐 Axios
                  </h2>
                  <p className="text-gray-600">
                    Modern HTTP client with interceptors
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    🎨 Tailwind CSS
                  </h2>
                  <p className="text-gray-600">
                    Utility-first CSS framework
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                  🚀 Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-blue-600 mb-3">MVC Architecture</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>✅ <strong>Models:</strong> Data structures with business logic</li>
                      <li>✅ <strong>Views:</strong> React components for UI</li>
                      <li>✅ <strong>Controllers:</strong> Custom hooks and services</li>
                      <li>✅ Complete separation of concerns</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-green-600 mb-3">API Integration</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>✅ <strong>Axios client:</strong> Modern HTTP requests</li>
                      <li>✅ <strong>Environment config:</strong> Flexible API URLs</li>
                      <li>✅ <strong>Error handling:</strong> Comprehensive interceptors</li>
                      <li>✅ <strong>TypeScript:</strong> Fully typed responses</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Getting Started */}
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Explore the Implementation
                </h2>
                <div className="flex justify-center gap-4">
                  <Button onClick={() => setActiveDemo('api')} variant="primary" size="lg">
                    🌐 API Integration
                  </Button>
                  <Button onClick={() => setActiveDemo('mvc')} variant="outline" size="lg">
                    🏗️ MVC Pattern
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeDemo === 'api' && <ApiDemo />}
          {activeDemo === 'mvc' && <MVCDemo />}
        </div>
      </div>
    </div>
  );
}

export default App; 