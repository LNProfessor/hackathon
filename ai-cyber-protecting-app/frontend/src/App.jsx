import React, { useState } from 'react';
import ActionButton from './components/ActionButton';
import StatusDisplay from './components/StatusDisplay';

// Backend API configuration
const API_BASE_URL = 'http://localhost:5000';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [securityStatus, setSecurityStatus] = useState(null);
  const [error, setError] = useState(null);

  const checkSecurity = async (latitude, longitude, wifiSSID) => {
    setIsLoading(true);
    setError(null);
    setSecurityStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/check-security`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude,
          longitude,
          wifiSSID
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setSecurityStatus(data);

    } catch (err) {
      console.error('Security check failed:', err);
      
      let errorMessage = 'Unable to perform security check. ';
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage += 'Please ensure the backend server is running on http://localhost:5000';
      } else {
        errorMessage += err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetApp = () => {
    setSecurityStatus(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🛡️</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Cyber Protecting App</h1>
                <p className="text-sm text-gray-600">Personal Security Co-pilot</p>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-sm text-gray-500">Real-time Security Assessment</div>
              <div className="text-xs text-gray-400">v1.0.0</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        {!securityStatus && !error && (
          <div className="text-center mb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Assess Your Digital & Physical Security Risk
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Get instant, AI-powered security recommendations based on your current location, 
                network connection, and local cyber threat intelligence.
              </p>
              
              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="text-3xl mb-4">🌍</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Location Analysis</h3>
                  <p className="text-gray-600 text-sm">Risk assessment based on your current location and distance from safe zones</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="text-3xl mb-4">📡</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Network Security</h3>
                  <p className="text-gray-600 text-sm">WiFi network analysis to identify potentially unsafe connections</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="text-3xl mb-4">🎯</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Threat Intelligence</h3>
                  <p className="text-gray-600 text-sm">Real-time cyber threat monitoring for your geographic area</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        {!securityStatus && !error && (
          <ActionButton isLoading={isLoading} onCheckSecurity={checkSecurity} />
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">❌</div>
              <h3 className="text-xl font-semibold text-red-800 mb-4">Security Check Failed</h3>
              <p className="text-red-700 mb-6">{error}</p>
              <button
                onClick={resetApp}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Security Status Display */}
        {securityStatus && (
          <StatusDisplay securityStatus={securityStatus} />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="animate-pulse-slow text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Analyzing Your Security Environment</h3>
              <div className="space-y-2 text-gray-600">
                <p>📍 Processing location data...</p>
                <p>🌐 Checking network security...</p>
                <p>🎯 Gathering threat intelligence...</p>
                <p>🤖 Generating AI recommendations...</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-2xl">🛡️</span>
              <span className="text-lg font-semibold">AI Cyber Protecting App</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your Personal Security Co-pilot for Digital & Physical Safety
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <span>🔒 Privacy-First Design</span>
              <span>🚀 Real-time Analysis</span>
              <span>🤖 AI-Powered Recommendations</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
