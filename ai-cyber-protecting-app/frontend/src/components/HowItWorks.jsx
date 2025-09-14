import React from 'react';

/**
 * HowItWorks - Step-by-step process explanation
 * Features:
 * - Interactive step cards with animations
 * - Process flow visualization
 * - Consistent theme styling
 * - Mobile responsive design
 */
const HowItWorks = () => {
  const steps = [
    {
      title: 'Location Detection',
      description: 'Our AI automatically detects your current location using GPS and analyzes your surrounding environment for potential security risks.',
      details: [
        'GPS coordinates analysis',
        'Wi-Fi network scanning',
        'Bluetooth device detection',
        'Cellular tower triangulation'
      ]
    },
    {
      title: 'Threat Assessment',
      description: 'Real-time analysis of cyber threats, network vulnerabilities, and physical security risks in your immediate area.',
      details: [
        'Malware signature detection',
        'Network vulnerability scanning',
        'Social engineering risk analysis',
        'Physical security assessment'
      ]
    },
    {
      title: 'Risk Scoring',
      description: 'Advanced algorithms calculate your security risk score based on multiple factors and threat intelligence data.',
      details: [
        'Weighted risk calculation',
        'Historical threat data',
        'Real-time threat feeds',
        'Location-based risk factors'
      ]
    },
    {
      title: 'Smart Recommendations',
      description: 'AI-powered recommendations tailored to your specific situation, providing actionable steps to improve your security.',
      details: [
        'Personalized security advice',
        'Emergency protocols',
        'Network security tips',
        'Physical safety measures'
      ]
    },
    {
      title: 'Real-time Monitoring',
      description: 'Continuous monitoring of your security status with instant alerts and updates as conditions change.',
      details: [
        '24/7 threat monitoring',
        'Instant security alerts',
        'Status change notifications',
        'Emergency response protocols'
      ]
    }
  ];

  return (
    <section id="how-it-works" className="py-24 relative">
      {/* Completely solid background overlay to prevent text blending */}
      <div className="absolute inset-0 bg-commuter-bg opacity-100 z-0"></div>
      
      <div className="relative z-20 max-w-commuter mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-commuter-text mb-6 tracking-tight">
            How It Works
          </h2>
          <p className="text-xl text-commuter-muted max-w-3xl mx-auto leading-relaxed">
            Our AI-powered security system analyzes your environment in real-time to provide 
            comprehensive protection and actionable recommendations.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => {
            // Create ID based on step title
            const stepId = step.title.toLowerCase().replace(/\s+/g, '-');
            return (
              <div 
                key={index} 
                id={stepId}
                className="bg-commuter-card border border-commuter-surface rounded-2xl p-8 shadow-2xl hover:shadow-glow-primary/20 transition-all duration-300 relative z-10"
              >
                <h3 className="text-2xl font-bold text-commuter-text mb-4">
                  {step.title}
                </h3>
                <p className="text-commuter-muted text-lg leading-relaxed mb-6">
                  {step.description}
                </p>
                
                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {step.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-commuter-primary rounded-full flex-shrink-0"></div>
                      <span className="text-commuter-text text-sm">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
};

export default HowItWorks;
