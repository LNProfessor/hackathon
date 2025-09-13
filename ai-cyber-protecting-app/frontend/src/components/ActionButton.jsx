import React from 'react';

const ActionButton = ({ isLoading, onCheckSecurity }) => {
  const handleClick = async () => {
    if (isLoading) return;

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

      // Simulate WiFi SSID input (in a real app, this would be detected automatically)
      const wifiSSID = prompt(
        'For demo purposes, please enter your WiFi network name (SSID):\n\n' +
        'Try these examples:\n' +
        '• "Starbucks_WiFi" (safe zone)\n' +
        '• "City_Airport_Free_WiFi" (unsafe)\n' +
        '• "Home_Network" (safe zone)\n' +
        '• Leave empty for no WiFi connection'
      ) || '';

      // Call the security check
      await onCheckSecurity(latitude, longitude, wifiSSID);

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
  };

  return (
    <div className="text-center">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`
          ${isLoading 
            ? 'bg-gray-700 cursor-not-allowed' 
            : 'bg-white hover:bg-gray-100'
          }
          text-black font-semibold text-lg px-8 py-4 rounded-lg 
          transition-colors duration-200
          flex items-center justify-center mx-auto
        `}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-400">Analyzing Security...</span>
          </>
        ) : (
          <>
            <div className="w-5 h-5 mr-3 flex items-center justify-center">
              <img src="/hackathon_logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span>Check My Security Status</span>
          </>
        )}
      </button>
      
      {!isLoading && (
        <div className="mt-6 max-w-md mx-auto">
          <p className="text-gray-400 text-sm leading-relaxed">
            Click to analyze your current digital and physical security risk based on your location and network connection.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActionButton;
