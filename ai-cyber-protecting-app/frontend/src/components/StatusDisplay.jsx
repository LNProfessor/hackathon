import React from 'react';
import StatusGlobeBackground from './StatusGlobeBackground';
import SimpleMapComponent from './SimpleMapComponent';

const StatusDisplay = ({ securityStatus, onNewAnalysis }) => {
  if (!securityStatus) return null;

  const { zone, score, recommendations, location, actionsStatus } = securityStatus;

  // Zone-specific styling using design system tokens
  const zoneConfig = {
    Green: {
      icon: '🟢',
      title: 'GREEN ZONE',
      titleColor: 'text-commuter-success',
      statusColor: 'text-commuter-success'
    },
    Yellow: {
      icon: '🟡',
      title: 'YELLOW ZONE',
      titleColor: 'text-commuter-warning',
      statusColor: 'text-commuter-warning'
    },
    Red: {
      icon: '🔴',
      title: 'RED ZONE',
      titleColor: 'text-commuter-danger',
      statusColor: 'text-commuter-danger'
    }
  };

  const config = zoneConfig[zone] || zoneConfig.Yellow;

  return (
    <div className="min-h-screen w-full relative flex">
      {/* Vanta.js Globe Background for Status Page */}
      <StatusGlobeBackground />
      
      {/* Full Screen Overlay with Results */}
      <div className="relative z-10 w-full bg-commuter-bg/30 backdrop-blur-xl flex flex-col">

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-commuter-text mb-2">
                Your Location Security Analysis
              </h2>
              <p className="text-commuter-muted text-lg">
                Real-time security assessment and automatic protection
              </p>
            </div>
            
            {/* Map Section with Text */}
            <div className="flex gap-6">
              {/* Map */}
              <div className="w-1/2">
                <div className="h-80 rounded-2xl overflow-hidden border border-commuter-surface/20 shadow-2xl">
                  <SimpleMapComponent 
                    location={location} 
                    zone={zone} 
                    isVisible={true}
                  />
                </div>
              </div>
              
              {/* Zone Information */}
              <div className="w-1/2 flex flex-col justify-center">
                <div className="bg-gradient-to-br from-commuter-card/90 to-commuter-surface/50 border border-commuter-surface/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm mr-4 ${
                      zone === 'Red' ? 'bg-commuter-danger/20' : 
                      zone === 'Yellow' ? 'bg-commuter-warning/20' : 
                      'bg-commuter-success/20'
                    }`}>
                      <div className="text-2xl">{config.icon}</div>
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${config.titleColor} tracking-wide`}>
                        {config.title}
                      </h3>
                      <p className="text-commuter-muted text-sm">
                        Risk Score: <span className={`${config.statusColor} font-bold`}>{score}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-commuter-text leading-relaxed">
                      You are here in the <span className={`${config.statusColor} font-semibold`}>{zone.toLowerCase()}</span> zone. 
                      {zone === 'Red' && ' This is a high-risk area. To navigate to a safer zone, move at least 500m away from your current location and avoid public Wi-Fi networks.'}
                      {zone === 'Yellow' && ' This is a moderate-risk area. To navigate to a safer zone, move to a more secure location and enable VPN protection.'}
                      {zone === 'Green' && ' This is a safe area. Continue following good security practices and maintain awareness of your surroundings.'}
                    </p>
                    
                    <div className="bg-commuter-surface/30 rounded-xl p-4 border border-commuter-surface/20">
                      <div className="text-sm text-commuter-muted mb-2">Zone Radius</div>
                      <div className={`text-lg font-bold ${config.statusColor}`}>
                        {zone === 'Red' ? '500m' : zone === 'Yellow' ? '1km' : '2km'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions List */}
            <div className="bg-gradient-to-br from-commuter-card/90 to-commuter-surface/50 border border-commuter-surface/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-commuter-primary/20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-commuter-text">Automatic Actions Taken</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {recommendations.map((action, index) => {
                  const actionDetail = actionsStatus?.actionDetails?.[action];
                  const isCompleted = actionDetail?.status === 'completed';
                  
                  return (
                    <div key={index} className="bg-gradient-to-r from-commuter-surface/30 to-commuter-surface/10 border border-commuter-surface/20 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4 mt-1">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isCompleted ? 'bg-commuter-success/20' : 'bg-commuter-danger/20'
                          }`}>
                            <span className="text-sm">
                              {isCompleted ? '✅' : '❌'}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-commuter-text text-sm leading-relaxed font-medium">{action}</span>
                            <span className={`text-xs font-medium ml-2 px-2 py-1 rounded-full ${
                              isCompleted 
                                ? 'text-commuter-success bg-commuter-success/10' 
                                : 'text-commuter-danger bg-commuter-danger/10'
                            }`}>
                              {isCompleted ? 'COMPLETED' : 'FAILED'}
                            </span>
                          </div>
                          {actionDetail?.details && (
                            <p className="text-xs text-commuter-muted leading-relaxed">
                              {actionDetail.details}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusDisplay;
