import React from 'react';
import Button from './components/Button';
import ApiDemo from './components/ApiDemo';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to React + Tailwind CSS
          </h1>
          <p className="text-lg text-gray-600">
            Your TypeScript React application is ready!
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              🚀 React
            </h2>
            <p className="text-gray-600">
              A JavaScript library for building user interfaces
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              🎨 Tailwind CSS
            </h2>
            <p className="text-gray-600">
              A utility-first CSS framework for rapid UI development
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              📝 TypeScript
            </h2>
            <p className="text-gray-600">
              Typed JavaScript for better development experience
            </p>
          </div>
        </div>

        <div className="mt-8">
          <ApiDemo />
        </div>
        
        <div className="mt-8 text-center space-x-4">
          <Button variant="primary" size="lg">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App; 