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
          ${isLoading ? 'btn-loading' : 'btn-primary'}
          text-xl px-8 py-4 rounded-xl transform transition-all duration-200
          ${!isLoading ? 'hover:scale-105 active:scale-95' : ''}
          flex items-center justify-center mx-auto min-w-64
        `}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing Security...
          </>
        ) : (
          <>
            🛡️ Check My Security Status
          </>
        )}
      </button>
      
      {!isLoading && (
        <p className="mt-4 text-gray-600 text-sm max-w-md mx-auto">
          Click to analyze your current digital and physical security risk based on your location and network connection.
        </p>
      )}
    </div>
  );
};

export default ActionButton;
