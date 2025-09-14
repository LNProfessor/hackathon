import React from 'react';
import StatusGlobeBackground from './StatusGlobeBackground';
import SimpleMapComponent from './SimpleMapComponent';
import LocationAnalysis from './LocationAnalysis';

const StatusDisplay = ({ securityStatus, onNewAnalysis }) => {
  if (!securityStatus) return null;

  const { zone, score, recommendations, location, actionsStatus, reasons, actions, suggestedLocations, riskFactors } = securityStatus;
  
  // Create fallback location analysis data if not provided by backend
  const createFallbackAnalysis = () => {
    if (reasons && actions) {
      // Backend provides new format
      return { reasons, actions, suggestedLocations: suggestedLocations || [] };
    }
    
    // Create fallback from legacy data
    const fallbackReasons = [];
    const fallbackActions = [];
    const fallbackLocations = [];
    
    // Parse risk factors to create Good/Bad reasons
    if (riskFactors && riskFactors.length > 0) {
      riskFactors.forEach(factor => {
        if (factor.includes("from the closest safe location")) {
          const distance = factor.match(/(\d+\.?\d*)\s*km/)?.[1] || "50";
          fallbackReasons.push(["Bad", `User is ${distance}km from home.`]);
          fallbackActions.push("Turn on VPN");
        } else if (factor.includes("Unsafe WiFi")) {
          fallbackReasons.push(["Bad", "User is on Untrusted/Unknown Public Network."]);
          if (!fallbackActions.includes("Activate 2-Factor Authentication")) {
            fallbackActions.push("Activate 2-Factor Authentication");
          }
          if (!fallbackActions.includes("Find a new location")) {
            fallbackActions.push("Find a new location");
          }
        } else if (factor.includes("Cyber threats")) {
          const threats = factor.match(/(\d+)\s*cyber threats/)?.[1] || "3";
          const zipcode = location?.zipcode || "unknown";
          fallbackReasons.push(["Bad", `There are ${threats} cyber threats reported in the user's Zipcode (${zipcode}).`]);
          if (!fallbackActions.includes("Activate 2-Factor Authentication")) {
            fallbackActions.push("Activate 2-Factor Authentication");
          }
          if (!fallbackActions.includes("Find a new location")) {
            fallbackActions.push("Find a new location");
          }
        }
      });
    }
    
    // Add suggested locations if location change is recommended
    if (fallbackActions.includes("Find a new location")) {
      fallbackLocations.push(
        {
          "Name": "Starbucks",
          "Distance": "1km",
          "Safety Level": "8/10",
          "Google Map Link": "https://maps.google.com/search/starbucks+near+me"
        },
        {
          "Name": "Target",
          "Distance": "2km",
          "Safety Level": "7/10",
          "Google Map Link": "https://maps.google.com/search/target+near+me"
        }
      );
    }
    
    // If no risk factors, create positive reasons based on zone
    if (fallbackReasons.length === 0) {
      if (zone === "Green") {
        fallbackReasons.push(["Good", "User is in a secure location with no identified risks."]);
      } else if (zone === "Yellow") {
        fallbackReasons.push(["Bad", "User is in a moderately risky environment."]);
      } else if (zone === "Red") {
        fallbackReasons.push(["Bad", "User is in a high-risk environment."]);
      }
    }
    
    return {
      reasons: fallbackReasons,
      actions: fallbackActions,
      suggestedLocations: fallbackLocations
    };
  };
  
  const analysisData = createFallbackAnalysis();

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

            {/* Location Analysis */}
            <LocationAnalysis analysisData={analysisData} />

          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusDisplay;
