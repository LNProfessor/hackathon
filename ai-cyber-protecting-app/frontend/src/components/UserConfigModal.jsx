import React, { useState, useEffect } from 'react';
import AddressManager from './AddressManager';

/**
 * UserConfigModal - Modal for user configuration settings
 * Features:
 * - Manage home addresses
 * - Configure 2FA email
 * - Save configuration to backend
 * - Accessible from top-right corner
 */
const UserConfigModal = ({ isOpen, onClose, onSave }) => {
  const [homeAddresses, setHomeAddresses] = useState([]);
  const [twoFAEmail, setTwoFAEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Load existing configuration when modal opens
  useEffect(() => {
    if (isOpen) {
      // Load from localStorage or API
      const savedAddresses = localStorage.getItem('userHomeAddresses');
      const savedEmail = localStorage.getItem('user2FAEmail');
      
      if (savedAddresses) {
        try {
          setHomeAddresses(JSON.parse(savedAddresses));
        } catch (e) {
          setHomeAddresses([]);
        }
      }
      
      if (savedEmail) {
        setTwoFAEmail(savedEmail);
      }
    }
  }, [isOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const configData = {
        homeAddresses,
        "2faEmail": twoFAEmail
      };

      // Call the backend API
      const response = await fetch('http://localhost:5000/api/configure-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configData),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Save to localStorage only if backend succeeds
        localStorage.setItem('userHomeAddresses', JSON.stringify(homeAddresses));
        localStorage.setItem('user2FAEmail', twoFAEmail);
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('configurationUpdated'));
        
        setSaveStatus('success');
        if (onSave) {
          onSave(configData);
        }
        setTimeout(() => {
          onClose();
          setSaveStatus(null);
        }, 2500); // Give user more time to see success message
      } else {
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        
        // Don't save locally if backend validation fails
        // Show error message and keep modal open for user to fix
        setSaveStatus('error');
        setTimeout(() => {
          setSaveStatus(null);
        }, 5000); // Show error longer so user can read it
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      
      // Network error - show error but don't save locally
      setSaveStatus('network_error');
      setTimeout(() => {
        setSaveStatus(null);
      }, 5000);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-commuter-card border border-commuter-surface/30 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-commuter-surface/20">
          <h2 className="text-2xl font-bold text-commuter-text">User Configuration</h2>
          <button
            onClick={onClose}
            className="
              w-8 h-8 bg-commuter-surface/30 hover:bg-commuter-surface/50 
              border border-commuter-surface/30 rounded-lg 
              flex items-center justify-center transition-colors
              text-commuter-muted hover:text-commuter-text
            "
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Home Addresses Section */}
          <div>
            <AddressManager 
              addresses={homeAddresses}
              onAddressesChange={setHomeAddresses}
              saveStatus={saveStatus}
            />
          </div>

          {/* 2FA Email Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-commuter-text">Two-Factor Authentication Email</h3>
            <input
              type="email"
              placeholder="Enter your 2FA email address"
              value={twoFAEmail}
              onChange={(e) => setTwoFAEmail(e.target.value)}
              className="
                w-full p-3 bg-commuter-surface/50 border border-commuter-surface/30 
                rounded-lg text-commuter-text placeholder-commuter-muted
                focus:outline-none focus:ring-2 focus:ring-commuter-primary/50
              "
            />
            <p className="text-xs text-commuter-muted">
              This email will be used for security alerts and two-factor authentication.
            </p>
          </div>

          {/* Save Status */}
          {saveStatus && (
            <div className={`p-4 rounded-xl text-center transition-all duration-300 ${
              saveStatus === 'success' 
                ? 'bg-commuter-success/20 text-commuter-success border border-commuter-success/30 shadow-lg' 
                : 'bg-commuter-danger/20 text-commuter-danger border border-commuter-danger/30'
            }`}>
              <div className="flex items-center justify-center space-x-2">
                {saveStatus === 'success' ? (
                  <>
                    <div className="w-6 h-6 bg-commuter-success/20 rounded-full flex items-center justify-center">
                      <span className="text-lg">✅</span>
                    </div>
                    <div>
                      <div className="font-semibold">Configuration Saved!</div>
                      <div className="text-sm opacity-80 mt-1">
                        Your settings have been updated successfully
                      </div>
                    </div>
                  </>
                ) : saveStatus === 'error' ? (
                  <>
                    <div className="w-6 h-6 bg-commuter-danger/20 rounded-full flex items-center justify-center">
                      <span className="text-lg">❌</span>
                    </div>
                    <div>
                      <div className="font-semibold">Invalid Address</div>
                      <div className="text-sm opacity-80 mt-1">
                        The server could not validate your address. Please check your address details and try a different address.
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 bg-commuter-danger/20 rounded-full flex items-center justify-center">
                      <span className="text-lg">⚠️</span>
                    </div>
                    <div>
                      <div className="font-semibold">Connection Error</div>
                      <div className="text-sm opacity-80 mt-1">
                        Unable to connect to server. Please check your internet connection and try again.
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-commuter-surface/20">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="
              px-6 py-2 bg-commuter-surface/50 border border-commuter-surface/30 
              rounded-lg text-commuter-muted hover:bg-commuter-surface/70 
              transition-colors disabled:opacity-50
            "
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`
              px-6 py-2 rounded-lg transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center space-x-2
              ${saveStatus === 'success' 
                ? 'bg-commuter-success hover:bg-commuter-success/90 text-white' 
                : 'bg-commuter-primary hover:bg-commuter-primary/90 text-white'
              }
            `}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : saveStatus === 'success' ? (
              <>
                <span className="text-lg">✅</span>
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Configuration</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserConfigModal;

