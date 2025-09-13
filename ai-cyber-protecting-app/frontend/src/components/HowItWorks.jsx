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
      <div className="max-w-commuter mx-auto px-6 lg:px-8">
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
                className="bg-gradient-to-br from-commuter-card/90 to-commuter-surface/50 border border-commuter-surface/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl hover:shadow-glow-primary/20 transition-all duration-300"
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


        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-commuter-primary/10 to-commuter-violet/10 border border-commuter-primary/20 rounded-2xl p-8 backdrop-blur-xl">
            <h3 className="text-2xl font-bold text-commuter-text mb-4">
              Ready to Secure Your Journey?
            </h3>
            <p className="text-commuter-muted text-lg mb-6 max-w-2xl mx-auto">
              Experience the power of AI-driven security analysis and protect yourself 
              with real-time threat intelligence and personalized recommendations.
            </p>
            <button className="
              bg-gradient-to-r from-commuter-primary to-commuter-violet 
              hover:from-commuter-primary/90 hover:to-commuter-violet/90
              text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 ease-out
              shadow-glow-primary hover:shadow-glow-primary/80
              border border-commuter-primary/20 hover:border-commuter-primary/40
              backdrop-blur-sm
            ">
              Start Your Security Analysis
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
