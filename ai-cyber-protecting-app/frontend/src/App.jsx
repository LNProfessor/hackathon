import React, { useState } from 'react';
import GlobeBackground from './components/GlobeBackground';
import HeaderNav from './components/HeaderNav';
import Hero from './components/Hero';
import { FeatureGrid } from './components/FeatureCard';
import HowItWorks from './components/HowItWorks';
import StatusDisplay from './components/StatusDisplay';
import Footer from './components/Footer';

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

  const handleGetStarted = () => {
    // Scroll to hero section or trigger security check
    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetApp = () => {
    setSecurityStatus(null);
    setError(null);
    setIsLoading(false);
  };

  // Feature data for the grid
  const features = [
    {
      icon: '🌍',
      title: 'Location Analysis',
      description: 'Risk assessment based on your current location and distance from safe zones'
    },
    {
      icon: '📡',
      title: 'Network Security',
      description: 'WiFi network analysis to identify potentially unsafe connections'
    },
    {
      icon: '🎯',
      title: 'Threat Intelligence',
      description: 'Real-time cyber threat monitoring for your geographic area'
    }
  ];

  return (
    <div className="min-h-screen relative bg-transparent">
      {/* Vanta.js Globe Background */}
      <GlobeBackground />
      
      {/* Navigation */}
      <div className="content-layer">
        <HeaderNav 
          onGetStarted={handleGetStarted} 
          onHomeClick={() => {
            setSecurityStatus(null);
            setError(null);
            setIsLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Main content */}
        <main className="bg-transparent">
        {/* Hero section */}
        {!securityStatus && !error && (
          <div id="hero">
            <Hero 
              onCheckSecurity={checkSecurity} 
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Feature grid */}
        {!securityStatus && !error && (
          <FeatureGrid features={features} />
        )}

        {/* How It Works section */}
        {!securityStatus && !error && (
          <HowItWorks />
        )}

        {/* Error Display */}
        {error && (
          <section className="py-24">
            <div className="max-w-commuter mx-auto px-6 lg:px-8">
              <div className="max-w-2xl mx-auto">
                <div className="bg-commuter-card border border-commuter-danger rounded-2xl p-8 text-center">
                  <div className="text-4xl mb-4">⚠️</div>
                  <h3 className="text-xl font-semibold text-commuter-text mb-4">Security Check Failed</h3>
                  <p className="text-commuter-muted mb-6 leading-relaxed">{error}</p>
                  <button
                    onClick={resetApp}
                    className="
                      bg-commuter-danger hover:bg-red-600 text-white font-medium 
                      py-3 px-6 rounded-lg transition-colors duration-200 ease-out
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-commuter-ring
                      focus-visible:ring-offset-2 focus-visible:ring-offset-commuter-bg
                    "
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Security Status Display */}
        {securityStatus && (
          <StatusDisplay 
            securityStatus={securityStatus} 
            onNewAnalysis={checkSecurity}
          />
        )}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default App;
