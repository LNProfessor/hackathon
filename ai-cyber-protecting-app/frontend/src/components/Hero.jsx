import React, { useState, useEffect } from 'react';

/**
 * Hero - Main landing section with badge, headline, CTA, and trust row
 * Features:
 * - Security Analysis badge with gradient pill
 * - Large display headline with proper hierarchy
 * - Primary CTA with loading states
 * - Secondary "How it works" CTA
 * - Trust indicators row with icons
 */
const Hero = ({ onCheckSecurity, isLoading }) => {
  const [progress, setProgress] = useState(0);
  const [userConfig, setUserConfig] = useState({
    hasEmail: false,
    hasAddresses: false,
    isConfigured: false
  });
  
  // Check if user has required configuration
  const checkUserConfiguration = () => {
    const savedAddresses = localStorage.getItem('userHomeAddresses');
    const savedEmail = localStorage.getItem('user2FAEmail');
    
    let homeAddresses = [];
    if (savedAddresses) {
      try {
        homeAddresses = JSON.parse(savedAddresses);
      } catch (e) {
        homeAddresses = [];
      }
    }
    
    return {
      hasEmail: !!savedEmail,
      hasAddresses: homeAddresses.length > 0,
      isConfigured: !!savedEmail && homeAddresses.length > 0
    };
  };

  // Update configuration on component mount and when localStorage changes
  useEffect(() => {
    const updateConfig = () => {
      const newConfig = checkUserConfiguration();
      setUserConfig(newConfig);
      console.log('Configuration updated:', newConfig); // Debug log
    };

    // Initial check
    updateConfig();

    // Listen for storage changes (when user saves configuration)
    window.addEventListener('storage', updateConfig);
    
    // Also listen for a custom event we'll dispatch when config changes
    window.addEventListener('configurationUpdated', updateConfig);

    // Force update every few seconds to catch any missed updates (fallback)
    const interval = setInterval(updateConfig, 2000);

    return () => {
      window.removeEventListener('storage', updateConfig);
      window.removeEventListener('configurationUpdated', updateConfig);
      clearInterval(interval);
    };
  }, []);

  const handlePrimaryCTA = async () => {
    if (isLoading) return;
    
    // Check configuration before proceeding
    if (!userConfig.isConfigured) {
      return; // Button should be disabled, but just in case
    }

    // Simulate progress for demo
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Request user's location using browser geolocation API
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      });

      const { latitude, longitude } = position.coords;

      // Get saved home addresses
      const savedAddresses = localStorage.getItem('userHomeAddresses');
      let homeAddresses = [];
      if (savedAddresses) {
        try {
          homeAddresses = JSON.parse(savedAddresses);
        } catch (e) {
          homeAddresses = [];
        }
      }

      // Call the security check
      await onCheckSecurity(latitude, longitude, homeAddresses);
      
    } catch (error) {
      console.error('Error getting location:', error);
      
      let errorMessage = 'Unable to access your location. ';
      
      if (error.code === 1) {
        errorMessage += 'Please enable location access and try again.';
      } else if (error.code === 2) {
        errorMessage += 'Location information is unavailable.';
      } else if (error.code === 3) {
        errorMessage += 'Location request timed out.';
      } else {
        errorMessage += error.message;
      }
      
      alert(errorMessage);
    }

    clearInterval(progressInterval);
  };


  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24">
      <div className="max-w-commuter mx-auto px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center mb-8">
            <div className="
              inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
              bg-gradient-to-r from-commuter-primary/10 to-commuter-violet/10
              border border-commuter-primary/20
              text-commuter-primary
            ">
              <div className="w-2 h-2 bg-commuter-primary rounded-full mr-2 animate-pulse"></div>
              SECURITY ANALYSIS
            </div>
          </div>

          {/* Headline */}
          <h1 className="
            text-4xl md:text-5xl lg:text-6xl font-bold 
            text-commuter-text mb-6 leading-tight
            tracking-tight
          ">
            Assess Your Digital<br />
            Travel Security Risk
          </h1>

          {/* Subheading */}
          <p className="
            text-lg md:text-xl text-commuter-muted mb-12 
            leading-relaxed max-w-3xl mx-auto
          ">
            Get instant, AI-powered recommendations from your current location, 
            network, and local threat intel—private by default.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            
            {/* Primary CTA */}
            <button
              onClick={handlePrimaryCTA}
              disabled={isLoading || !userConfig.isConfigured}
              className={`
                group relative inline-flex items-center px-8 py-4 
                font-semibold rounded-xl
                transition-all duration-200 ease-out
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-commuter-ring
                focus-visible:ring-offset-2 focus-visible:ring-offset-commuter-bg
                active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed
                min-w-64
                ${userConfig.isConfigured 
                  ? 'bg-commuter-primary hover:bg-commuter-primary-600 text-commuter-bg' 
                  : 'bg-commuter-surface/50 border border-commuter-surface/30 text-commuter-muted'
                }
              `}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Security...
                </>
              ) : !userConfig.isConfigured ? (
                <>
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Configuration Required
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Check My Security Status
                </>
              )}
            </button>

            {/* Secondary CTA */}
            <button 
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="
                inline-flex items-center px-6 py-4 
                text-commuter-text hover:text-commuter-primary
                font-medium transition-colors duration-200 ease-out
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-commuter-ring
                focus-visible:ring-offset-2 focus-visible:ring-offset-commuter-bg
                rounded-xl
              "
            >
              How it works
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Configuration Required Message */}
          {!userConfig.isConfigured && (
            <div className="max-w-md mx-auto mb-8">
              <div className="bg-commuter-warning/10 border border-commuter-warning/30 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-commuter-warning mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-commuter-warning font-medium">Setup Required</span>
                </div>
                <p className="text-sm text-commuter-text mb-3">
                  To use the security analysis service, please configure:
                </p>
                <div className="text-xs text-commuter-muted space-y-1">
                  <div className="flex items-center justify-center">
                    <span className={userConfig.hasEmail ? 'text-commuter-success' : 'text-commuter-danger'}>
                      {userConfig.hasEmail ? '✓' : '✗'}
                    </span>
                    <span className="ml-2">2FA Email Address</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className={userConfig.hasAddresses ? 'text-commuter-success' : 'text-commuter-danger'}>
                      {userConfig.hasAddresses ? '✓' : '✗'}
                    </span>
                    <span className="ml-2">At least one Home Address</span>
                  </div>
                </div>
                <p className="text-xs text-commuter-muted mt-3">
                  Click the settings gear icon ⚙️ in the top navigation to configure.
                </p>
              </div>
            </div>
          )}

          {/* Progress bar for demo */}
          {isLoading && progress > 0 && (
            <div className="max-w-md mx-auto mb-8">
              <div className="bg-commuter-card rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-commuter-primary to-commuter-violet transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-commuter-muted mt-2">
                Analyzing your security environment... {progress}%
              </p>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default Hero;
