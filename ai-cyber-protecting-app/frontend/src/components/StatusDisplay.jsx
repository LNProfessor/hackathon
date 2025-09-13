import React from 'react';

const StatusDisplay = ({ securityStatus }) => {
  if (!securityStatus) return null;

  const { zone, score, reason, recommendations, location, threatInfo, riskFactors, emailSent, securityCode } = securityStatus;

  // Zone-specific styling and icons
  const zoneConfig = {
    Green: {
      bgColor: 'zone-green',
      icon: '✅',
      title: 'SECURE ZONE',
      textColor: 'text-green-800'
    },
    Yellow: {
      bgColor: 'zone-yellow',
      icon: '⚠️',
      title: 'CAUTION ZONE',
      textColor: 'text-yellow-800'
    },
    Red: {
      bgColor: 'zone-red',
      icon: '🚨',
      title: 'DANGER ZONE',
      textColor: 'text-red-800'
    }
  };

  const config = zoneConfig[zone] || zoneConfig.Yellow;

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      {/* Main Status Card */}
      <div className={`security-card ${config.bgColor}`}>
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">{config.icon}</div>
          <h2 className={`text-3xl font-bold ${config.textColor} mb-2`}>
            {config.title}
          </h2>
          <div className={`text-lg ${config.textColor} opacity-75`}>
            Risk Score: {score} | Location: {location?.city || 'Unknown'}
          </div>
        </div>

        <div className={`${config.textColor} text-center text-lg leading-relaxed`}>
          {reason}
        </div>
      </div>

      {/* Red Zone Alert Notice */}
      {zone === 'Red' && emailSent && (
        <div className="security-card border-red-600 bg-red-50">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">📧</span>
            <h3 className="text-xl font-semibold text-red-800">Security Alert Sent</h3>
          </div>
          <p className="text-red-700 mb-2">
            A security alert has been sent to your registered email address with your current location and emergency details.
          </p>
          {securityCode && (
            <div className="bg-red-200 p-3 rounded-lg text-center">
              <span className="text-red-800 font-semibold">Emergency Code: </span>
              <span className="text-2xl font-bold text-red-900">{securityCode}</span>
            </div>
          )}
        </div>
      )}

      {/* Risk Factors */}
      {riskFactors && riskFactors.length > 0 && (
        <div className="security-card">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">⚡</span>
            Identified Risk Factors
          </h3>
          <ul className="space-y-2">
            {riskFactors.map((factor, index) => (
              <li key={index} className="flex items-start">
                <span className="text-orange-500 mr-2 mt-1">•</span>
                <span className="text-gray-700">{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Threat Information */}
      {threatInfo?.detected && (
        <div className="security-card border-orange-500 bg-orange-50">
          <h3 className="text-xl font-semibold text-orange-800 mb-4 flex items-center">
            <span className="mr-2">🎯</span>
            Local Threat Intelligence
          </h3>
          <p className="text-orange-700">{threatInfo.summary}</p>
        </div>
      )}

      {/* Recommendations */}
      <div className="security-card">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">💡</span>
          Security Recommendations
        </h3>
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
              <span className="text-blue-500 mr-3 mt-1 text-lg">
                {zone === 'Red' ? '🔴' : zone === 'Yellow' ? '🟡' : '🟢'}
              </span>
              <span className="text-gray-800 leading-relaxed">{recommendation}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Location Details */}
      {location && (
        <div className="security-card bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">📍</span>
            Location Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">City:</span> {location.city}
            </div>
            <div>
              <span className="font-medium">Coordinates:</span> 
              {location.coordinates.latitude.toFixed(4)}, {location.coordinates.longitude.toFixed(4)}
            </div>
          </div>
        </div>
      )}

      {/* Action Button for New Check */}
      <div className="text-center pt-6">
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
        >
          Run New Security Check
        </button>
      </div>
    </div>
  );
};

export default StatusDisplay;
