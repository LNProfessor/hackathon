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
      number: '01',
      title: 'Location Detection',
      description: 'Our AI automatically detects your current location using GPS and analyzes your surrounding environment for potential security risks.',
      icon: '📍',
      details: [
        'GPS coordinates analysis',
        'Wi-Fi network scanning',
        'Bluetooth device detection',
        'Cellular tower triangulation'
      ]
    },
    {
      number: '02',
      title: 'Threat Assessment',
      description: 'Real-time analysis of cyber threats, network vulnerabilities, and physical security risks in your immediate area.',
      icon: '🔍',
      details: [
        'Malware signature detection',
        'Network vulnerability scanning',
        'Social engineering risk analysis',
        'Physical security assessment'
      ]
    },
    {
      number: '03',
      title: 'Risk Scoring',
      description: 'Advanced algorithms calculate your security risk score based on multiple factors and threat intelligence data.',
      icon: '⚖️',
      details: [
        'Weighted risk calculation',
        'Historical threat data',
        'Real-time threat feeds',
        'Location-based risk factors'
      ]
    },
    {
      number: '04',
      title: 'Smart Recommendations',
      description: 'AI-powered recommendations tailored to your specific situation, providing actionable steps to improve your security.',
      icon: '💡',
      details: [
        'Personalized security advice',
        'Emergency protocols',
        'Network security tips',
        'Physical safety measures'
      ]
    },
    {
      number: '05',
      title: 'Real-time Monitoring',
      description: 'Continuous monitoring of your security status with instant alerts and updates as conditions change.',
      icon: '🛡️',
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
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-commuter-primary/50 to-commuter-violet/50"></div>
              )}
              
              <div className={`
                flex flex-col lg:flex-row items-start lg:items-center gap-8
                ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}
              `}>
                {/* Step Number & Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-commuter-primary to-commuter-violet rounded-2xl flex items-center justify-center shadow-glow-primary">
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  <div className="text-6xl font-bold text-commuter-primary/20 -mt-4 -ml-2">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-commuter-card/90 to-commuter-surface/50 border border-commuter-surface/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl hover:shadow-glow-primary/20 transition-all duration-300">
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
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Process Flow Visualization */}
        <div className="mt-20">
          <div className="bg-gradient-to-br from-commuter-card/90 to-commuter-surface/50 border border-commuter-surface/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
            <h3 className="text-2xl font-bold text-commuter-text mb-8 text-center">
              Security Analysis Flow
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { icon: '🌐', label: 'Data Collection', color: 'from-commuter-primary/20 to-commuter-primary/10' },
                { icon: '🔬', label: 'AI Analysis', color: 'from-commuter-violet/20 to-commuter-violet/10' },
                { icon: '📊', label: 'Risk Scoring', color: 'from-commuter-warning/20 to-commuter-warning/10' },
                { icon: '💡', label: 'Recommendations', color: 'from-commuter-success/20 to-commuter-success/10' },
                { icon: '🛡️', label: 'Protection', color: 'from-commuter-danger/20 to-commuter-danger/10' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <p className="text-commuter-text font-medium text-sm">{item.label}</p>
                  {index < 4 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-commuter-primary/50 to-commuter-violet/50 transform translate-x-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
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
