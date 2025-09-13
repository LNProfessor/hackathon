import React, { useState } from 'react';
import StatusGlobeBackground from './StatusGlobeBackground';

const StatusDisplay = ({ securityStatus, onNewAnalysis }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!securityStatus) return null;

  const { zone, score, reason, recommendations, location, threatInfo, riskFactors, emailSent, securityCode } = securityStatus;

  // Zone-specific styling using design system tokens
  const zoneConfig = {
    Green: {
      bgColor: 'bg-commuter-card',
      borderColor: 'border-commuter-success',
      icon: '🟢',
      title: 'GREEN ZONE',
      textColor: 'text-commuter-text',
      titleColor: 'text-commuter-success',
      statusColor: 'text-commuter-success',
      glowClass: 'shadow-glow-success',
      bgGradient: 'from-commuter-success/10 to-commuter-success/5'
    },
    Yellow: {
      bgColor: 'bg-commuter-card',
      borderColor: 'border-commuter-warning',
      icon: '🟡',
      title: 'YELLOW ZONE',
      textColor: 'text-commuter-text',
      titleColor: 'text-commuter-warning',
      statusColor: 'text-commuter-warning',
      glowClass: 'shadow-glow-warning',
      bgGradient: 'from-commuter-warning/10 to-commuter-warning/5'
    },
    Red: {
      bgColor: 'bg-commuter-card',
      borderColor: 'border-commuter-danger',
      icon: '🔴',
      title: 'RED ZONE',
      textColor: 'text-commuter-text',
      titleColor: 'text-commuter-danger',
      statusColor: 'text-commuter-danger',
      glowClass: 'shadow-glow-danger',
      bgGradient: 'from-commuter-danger/10 to-commuter-danger/5'
    }
  };

  const config = zoneConfig[zone] || zoneConfig.Yellow;

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'risks', label: 'Risk Factors', icon: '⚠️' },
    { id: 'threats', label: 'Threat Intel', icon: '🎯' },
    { id: 'recommendations', label: 'Recommendations', icon: '💡' },
    { id: 'location', label: 'Location', icon: '📍' }
  ];

  return (
    <div className="min-h-screen relative flex">
      {/* Vanta.js Globe Background for Status Page */}
      <StatusGlobeBackground />
      
      {/* Sidebar with Results */}
      <div className="relative z-10 w-[500px] bg-commuter-bg/90 backdrop-blur-xl border-r border-commuter-surface/20 flex flex-col">
        {/* Header */}
        <div className={`p-6 border-b border-commuter-surface/20 bg-gradient-to-r ${config.bgGradient}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-commuter-surface/50 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <div className="text-3xl">{config.icon}</div>
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${config.titleColor} tracking-wide`}>
                  {config.title}
                </h2>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-commuter-muted">Risk Score:</span>
                  <span className={`${config.statusColor} font-bold text-lg`}>{score}</span>
                  <span className="text-commuter-muted">•</span>
                  <span className="text-commuter-text">{location?.city || 'Unknown Location'}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onNewAnalysis}
              className="
                bg-gradient-to-r from-commuter-primary to-commuter-violet 
                hover:from-commuter-primary/90 hover:to-commuter-violet/90
                text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 ease-out
                text-sm shadow-glow-primary hover:shadow-glow-primary/80
                border border-commuter-primary/20 hover:border-commuter-primary/40
                backdrop-blur-sm
              "
            >
              <span className="mr-2">🔄</span>
              New Analysis
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-commuter-surface/20 bg-commuter-surface/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 px-4 py-4 text-sm font-medium transition-all duration-300 ease-out
                border-b-2 relative group ${
                  activeTab === tab.id
                    ? 'border-commuter-primary text-commuter-primary bg-gradient-to-b from-commuter-primary/10 to-transparent'
                    : 'border-transparent text-commuter-muted hover:text-commuter-text hover:bg-commuter-surface/30'
                }
              `}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-commuter-primary/20 shadow-glow-primary/50' 
                    : 'bg-commuter-surface/50 group-hover:bg-commuter-primary/10'
                }`}>
                  <span className="text-lg">{tab.icon}</span>
                </div>
                <span className="text-xs font-medium">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-commuter-card/90 to-commuter-surface/50 border border-commuter-surface/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-commuter-primary/20 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-lg">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold text-commuter-text">Status Summary</h3>
                </div>
                <p className="text-commuter-text leading-relaxed text-sm">{reason}</p>
              </div>
              
              {zone === 'Red' && emailSent && (
                <div className="bg-gradient-to-br from-commuter-danger/10 to-commuter-danger/5 border border-commuter-danger/30 rounded-2xl p-6 backdrop-blur-xl shadow-glow-danger">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-commuter-danger/20 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-lg">📧</span>
                    </div>
                    <h3 className="text-lg font-semibold text-commuter-danger">Emergency Alert Sent</h3>
                  </div>
                  <p className="text-commuter-text text-sm mb-4 leading-relaxed">
                    Security alert sent to your registered email with location and emergency details.
                  </p>
                  {securityCode && (
                    <div className="bg-commuter-surface/50 border border-commuter-danger/20 p-4 rounded-xl text-center">
                      <div className="text-xs text-commuter-danger mb-2 font-medium uppercase tracking-wider">Emergency Code</div>
                      <div className="text-xl font-bold text-commuter-danger font-mono tracking-wider">
                        {securityCode}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'risks' && riskFactors && riskFactors.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-commuter-warning/20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">⚠️</span>
                </div>
                <h3 className="text-lg font-semibold text-commuter-text">Identified Risk Factors</h3>
              </div>
              {riskFactors.map((factor, index) => (
                <div key={index} className="bg-gradient-to-r from-commuter-card/90 to-commuter-surface/50 border border-commuter-surface/30 rounded-xl p-4 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-200">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-commuter-warning/20 rounded-full flex items-center justify-center mt-1 mr-4 flex-shrink-0">
                      <span className="w-2 h-2 bg-commuter-warning rounded-full"></span>
                    </div>
                    <span className="text-commuter-text text-sm leading-relaxed">{factor}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'threats' && threatInfo?.detected && (
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-commuter-warning/20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-commuter-text">Local Threat Intelligence</h3>
              </div>
              <div className="bg-gradient-to-br from-commuter-warning/10 to-commuter-warning/5 border border-commuter-warning/30 rounded-2xl p-6 backdrop-blur-xl shadow-glow-warning">
                <p className="text-commuter-text text-sm leading-relaxed">{threatInfo.summary}</p>
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-commuter-primary/20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">💡</span>
                </div>
                <h3 className="text-lg font-semibold text-commuter-text">Security Recommendations</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="bg-gradient-to-r from-commuter-card/90 to-commuter-surface/50 border border-commuter-surface/30 rounded-xl p-4 backdrop-blur-xl hover:shadow-xl transition-all duration-200">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4 mt-1">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          zone === 'Red' ? 'bg-commuter-danger/20' : zone === 'Yellow' ? 'bg-commuter-warning/20' : 'bg-commuter-success/20'
                        }`}>
                          <span className="text-sm">
                            {zone === 'Red' ? '🔴' : zone === 'Yellow' ? '🟡' : '🟢'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <span className="text-commuter-text text-sm leading-relaxed">{recommendation}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'location' && location && (
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-commuter-primary/20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">📍</span>
                </div>
                <h3 className="text-lg font-semibold text-commuter-text">Location Details</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-commuter-card/90 to-commuter-surface/50 border border-commuter-surface/30 rounded-xl p-4 backdrop-blur-xl shadow-lg">
                  <div className="text-xs text-commuter-muted mb-2 font-medium uppercase tracking-wider">City</div>
                  <div className="text-commuter-text font-semibold text-lg">{location.city}</div>
                </div>
                <div className="bg-gradient-to-br from-commuter-card/90 to-commuter-surface/50 border border-commuter-surface/30 rounded-xl p-4 backdrop-blur-xl shadow-lg">
                  <div className="text-xs text-commuter-muted mb-2 font-medium uppercase tracking-wider">Country</div>
                  <div className="text-commuter-text font-semibold text-lg">{location.country || 'Unknown'}</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-commuter-card/90 to-commuter-surface/50 border border-commuter-surface/30 rounded-xl p-4 backdrop-blur-xl shadow-lg">
                <div className="text-xs text-commuter-muted mb-2 font-medium uppercase tracking-wider">Coordinates</div>
                <div className="text-commuter-text font-mono text-sm">
                  <div>Lat: {location.coordinates.latitude.toFixed(6)}</div>
                  <div>Lng: {location.coordinates.longitude.toFixed(6)}</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-commuter-card/90 to-commuter-surface/50 border border-commuter-surface/30 rounded-xl p-4 backdrop-blur-xl shadow-lg">
                <div className="text-xs text-commuter-muted mb-2 font-medium uppercase tracking-wider">Network Info</div>
                <div className="text-commuter-text text-sm">
                  <div>SSID: {location.ssid || 'Unknown'}</div>
                  <div>Security: {location.security || 'Unknown'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusDisplay;
