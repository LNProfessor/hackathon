import React from 'react';

/**
 * LocationAnalysis - Component to display location analysis results
 * Displays reasons, actions, and suggested locations based on security assessment
 * Reasons structure: [["Status", "Description"], ...]
 * Status can be "Good" or "Bad"
 */
const LocationAnalysis = ({ analysisData }) => {
  if (!analysisData) return null;

  const { reasons = [], actions = [], suggestedLocations = [] } = analysisData;
  
  // Filter and separate good and bad reasons
  const badReasons = reasons.filter(reason => Array.isArray(reason) && reason[0] === "Bad").map(reason => reason[1]);
  const goodReasons = reasons.filter(reason => Array.isArray(reason) && reason[0] === "Good").map(reason => reason[1]);
  
  // Filter out empty actions
  const validActions = actions.filter(action => action && action.trim() !== "");

  return (
    <div className="space-y-6">
      {/* Security Assessment Section */}
      {(badReasons.length > 0 || goodReasons.length > 0) && (
        <div className="bg-gradient-to-br from-commuter-card/90 to-commuter-surface/50 border border-commuter-surface/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
              badReasons.length > 0 ? 'bg-commuter-warning/20' : 'bg-commuter-success/20'
            }`}>
              <span className="text-lg">{badReasons.length > 0 ? '⚠️' : '✅'}</span>
            </div>
            <h3 className="text-lg font-semibold text-commuter-text">
              {badReasons.length > 0 ? 'Security Assessment' : 'Security Status'}
            </h3>
          </div>
          
          <div className="space-y-3">
            {/* Bad Reasons */}
            {badReasons.map((reason, index) => (
              <div key={`bad-${index}`} className="bg-gradient-to-r from-commuter-danger/10 to-commuter-danger/5 border border-commuter-danger/20 rounded-xl p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    <div className="w-6 h-6 bg-commuter-danger/20 rounded-full flex items-center justify-center">
                      <span className="text-xs text-commuter-danger">!</span>
                    </div>
                  </div>
                  <p className="text-commuter-text text-sm leading-relaxed">{reason}</p>
                </div>
              </div>
            ))}
            
            {/* Good Reasons */}
            {goodReasons.map((reason, index) => (
              <div key={`good-${index}`} className="bg-gradient-to-r from-commuter-success/10 to-commuter-success/5 border border-commuter-success/20 rounded-xl p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    <div className="w-6 h-6 bg-commuter-success/20 rounded-full flex items-center justify-center">
                      <span className="text-xs text-commuter-success">✓</span>
                    </div>
                  </div>
                  <p className="text-commuter-text text-sm leading-relaxed">{reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions Section */}
      {validActions.length > 0 && (
        <div className="bg-gradient-to-br from-commuter-card/90 to-commuter-surface/50 border border-commuter-surface/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-commuter-primary/20 rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg">🛡️</span>
            </div>
            <h3 className="text-lg font-semibold text-commuter-text">Recommended Actions</h3>
          </div>
          <div className="space-y-3">
            {validActions.map((action, index) => (
              <div key={index} className="bg-gradient-to-r from-commuter-surface/30 to-commuter-surface/10 border border-commuter-surface/20 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    <div className="w-8 h-8 bg-commuter-primary/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm">
                        {action.includes('VPN') ? '🔒' : 
                         action.includes('2-Factor') ? '🔐' : 
                         action.includes('location') ? '📍' : '⚡'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-commuter-text text-sm leading-relaxed font-medium">{action}</span>
                    <div className="mt-2">
                      <button className="text-xs bg-commuter-primary/10 text-commuter-primary px-3 py-1 rounded-full hover:bg-commuter-primary/20 transition-colors">
                        Take Action
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Locations Section */}
      {suggestedLocations.length > 0 && (
        <div className="bg-gradient-to-br from-commuter-card/90 to-commuter-surface/50 border border-commuter-surface/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-commuter-success/20 rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg">📍</span>
            </div>
            <h3 className="text-lg font-semibold text-commuter-text">Safer Locations Nearby</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestedLocations.map((location, index) => (
              <div key={index} className="bg-gradient-to-r from-commuter-surface/30 to-commuter-surface/10 border border-commuter-surface/20 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-commuter-text font-medium text-base">{location.Name}</h4>
                      <p className="text-commuter-muted text-sm">{location.Distance} away</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        getSafetyLevelColor(location['Safety Level'])
                      }`}>
                        {location['Safety Level']} Safe
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getSafetyDotColor(location['Safety Level'])}`}></div>
                      <span className="text-xs text-commuter-muted">Safety Rating</span>
                    </div>
                    
                    {location['Google Map Link'] && (
                      <a 
                        href={location['Google Map Link']} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs bg-commuter-primary/10 text-commuter-primary px-3 py-1 rounded-full hover:bg-commuter-primary/20 transition-colors"
                      >
                        View on Map
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get safety level color classes
const getSafetyLevelColor = (safetyLevel) => {
  const level = parseInt(safetyLevel.split('/')[0]);
  if (level >= 8) return 'bg-commuter-success/20 text-commuter-success';
  if (level >= 6) return 'bg-commuter-warning/20 text-commuter-warning';
  return 'bg-commuter-danger/20 text-commuter-danger';
};

// Helper function to get safety dot color classes
const getSafetyDotColor = (safetyLevel) => {
  const level = parseInt(safetyLevel.split('/')[0]);
  if (level >= 8) return 'bg-commuter-success';
  if (level >= 6) return 'bg-commuter-warning';
  return 'bg-commuter-danger';
};

export default LocationAnalysis;
