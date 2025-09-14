import React, { useState } from 'react';

/**
 * AddressManager - Component for managing user's home addresses
 * Features:
 * - Add multiple home addresses
 * - Remove existing addresses
 * - Format addresses as "number|street|city|state|zipcode"
 * - Plus icon for adding new addresses
 */
const AddressManager = ({ addresses = [], onAddressesChange, saveStatus, className = "" }) => {
  const [newAddress, setNewAddress] = useState({
    number: '',
    street: '',
    city: '',
    state: '',
    zipcode: ''
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddAddress = () => {
    if (newAddress.number && newAddress.street && newAddress.city && newAddress.state && newAddress.zipcode) {
      const formattedAddress = `${newAddress.number}|${newAddress.street}|${newAddress.city}|${newAddress.state}|${newAddress.zipcode}`;
      const updatedAddresses = [...addresses, formattedAddress];
      onAddressesChange(updatedAddresses);
      
      // Reset form
      setNewAddress({
        number: '',
        street: '',
        city: '',
        state: '',
        zipcode: ''
      });
      setIsAdding(false);
    }
  };

  const handleRemoveAddress = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    onAddressesChange(updatedAddresses);
  };

  const parseAddress = (addressString) => {
    const parts = addressString.split('|');
    return {
      number: parts[0] || '',
      street: parts[1] || '',
      city: parts[2] || '',
      state: parts[3] || '',
      zipcode: parts[4] || ''
    };
  };

  const formatDisplayAddress = (addressString) => {
    const parsed = parseAddress(addressString);
    return `${parsed.number} ${parsed.street}, ${parsed.city}, ${parsed.state} ${parsed.zipcode}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-commuter-text">Home Addresses</h3>
          {saveStatus === 'success' && (
            <span className="text-commuter-success text-sm font-medium animate-pulse">
              Saved!
            </span>
          )}
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="
            w-8 h-8 bg-commuter-primary/20 hover:bg-commuter-primary/30 
            border border-commuter-primary/30 rounded-lg 
            flex items-center justify-center transition-colors
            text-commuter-primary hover:text-commuter-primary
          "
          title="Add new home address"
        >
          <span className="text-lg font-bold">+</span>
        </button>
      </div>

      {/* Existing Addresses */}
      <div className="space-y-2">
        {addresses.map((address, index) => (
          <div key={index} className="bg-commuter-surface/30 border border-commuter-surface/20 rounded-lg p-3 flex items-center justify-between">
            <span className="text-commuter-text text-sm">{formatDisplayAddress(address)}</span>
            <button
              onClick={() => handleRemoveAddress(index)}
              className="
                w-6 h-6 bg-commuter-danger/20 hover:bg-commuter-danger/30 
                border border-commuter-danger/30 rounded 
                flex items-center justify-center transition-colors
                text-commuter-danger text-xs
              "
              title="Remove address"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Add New Address Form */}
      {isAdding && (
        <div className="bg-commuter-surface/20 border border-commuter-surface/30 rounded-lg p-4 space-y-3">
          <h4 className="text-md font-medium text-commuter-text">Add New Home Address</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="House Number"
              value={newAddress.number}
              onChange={(e) => setNewAddress({...newAddress, number: e.target.value})}
              className="
                w-full p-2 bg-commuter-surface/50 border border-commuter-surface/30 
                rounded-lg text-commuter-text placeholder-commuter-muted text-sm
                focus:outline-none focus:ring-2 focus:ring-commuter-primary/50
              "
            />
            <input
              type="text"
              placeholder="Street Name"
              value={newAddress.street}
              onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
              className="
                w-full p-2 bg-commuter-surface/50 border border-commuter-surface/30 
                rounded-lg text-commuter-text placeholder-commuter-muted text-sm
                focus:outline-none focus:ring-2 focus:ring-commuter-primary/50
              "
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
              className="
                w-full p-2 bg-commuter-surface/50 border border-commuter-surface/30 
                rounded-lg text-commuter-text placeholder-commuter-muted text-sm
                focus:outline-none focus:ring-2 focus:ring-commuter-primary/50
              "
            />
            <input
              type="text"
              placeholder="State"
              value={newAddress.state}
              onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
              className="
                w-full p-2 bg-commuter-surface/50 border border-commuter-surface/30 
                rounded-lg text-commuter-text placeholder-commuter-muted text-sm
                focus:outline-none focus:ring-2 focus:ring-commuter-primary/50
              "
            />
            <input
              type="text"
              placeholder="ZIP Code"
              value={newAddress.zipcode}
              onChange={(e) => setNewAddress({...newAddress, zipcode: e.target.value})}
              className="
                w-full p-2 bg-commuter-surface/50 border border-commuter-surface/30 
                rounded-lg text-commuter-text placeholder-commuter-muted text-sm
                focus:outline-none focus:ring-2 focus:ring-commuter-primary/50
              "
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsAdding(false)}
              className="
                px-4 py-2 bg-commuter-surface/50 border border-commuter-surface/30 
                rounded-lg text-commuter-muted text-sm hover:bg-commuter-surface/70 
                transition-colors
              "
            >
              Cancel
            </button>
            <button
              onClick={handleAddAddress}
              disabled={!newAddress.number || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipcode}
              className="
                px-4 py-2 bg-commuter-primary hover:bg-commuter-primary/90 
                text-white text-sm rounded-lg transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Add Address
            </button>
          </div>
        </div>
      )}

      {addresses.length === 0 && !isAdding && (
        <div className="text-center py-8 text-commuter-muted">
          <p className="text-sm">No home addresses configured.</p>
          <p className="text-xs mt-1">Click the + button to add your first home address.</p>
        </div>
      )}
    </div>
  );
};

export default AddressManager;
