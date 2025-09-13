import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const SimpleMapComponent = ({ location, zone, isVisible }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Zone colors matching the theme
  const zoneColors = {
    Green: {
      fill: '#22c55e', // commuter-success
      stroke: '#16a34a',
      opacity: 0.3
    },
    Yellow: {
      fill: '#f59e0b', // commuter-warning
      stroke: '#d97706',
      opacity: 0.3
    },
    Red: {
      fill: '#ef4444', // commuter-danger
      stroke: '#dc2626',
      opacity: 0.3
    }
  };

  const currentZoneColor = zoneColors[zone] || zoneColors.Yellow;

  useEffect(() => {
    if (!mapContainer.current || map.current || !isVisible) return;

    // Initialize Leaflet map
    map.current = L.map(mapContainer.current, {
      center: [location?.coordinates?.latitude || 40.7128, location?.coordinates?.longitude || -74.0060],
      zoom: 13,
      zoomControl: true,
      attributionControl: false
    });

    // Add dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map.current);

    // Add zone circle
    if (location?.coordinates) {
      addZoneCircle();
      addUserMarker();
    }

    setMapLoaded(true);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (map.current && mapLoaded && location?.coordinates) {
      addZoneCircle();
      addUserMarker();
    }
  }, [zone, location, mapLoaded]);

  const addZoneCircle = () => {
    if (!map.current || !location?.coordinates) return;

    // Clear existing circles
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Circle) {
        map.current.removeLayer(layer);
      }
    });

    // Calculate radius based on zone (in meters)
    const radius = zone === 'Red' ? 500 : zone === 'Yellow' ? 1000 : 2000;

    // Add zone circle
    const circle = L.circle([location.coordinates.latitude, location.coordinates.longitude], {
      color: currentZoneColor.stroke,
      fillColor: currentZoneColor.fill,
      fillOpacity: currentZoneColor.opacity,
      radius: radius,
      weight: 3,
      opacity: 0.8
    }).addTo(map.current);

    // Add pulsing effect
    const pulseCircle = L.circle([location.coordinates.latitude, location.coordinates.longitude], {
      color: currentZoneColor.stroke,
      fillColor: currentZoneColor.fill,
      fillOpacity: 0.1,
      radius: radius,
      weight: 2,
      opacity: 0.6
    }).addTo(map.current);

    // Animate pulse
    let pulseRadius = radius;
    const pulseInterval = setInterval(() => {
      pulseRadius += 50;
      if (pulseRadius > radius * 1.5) {
        pulseRadius = radius;
      }
      pulseCircle.setRadius(pulseRadius);
    }, 1000);
  };

  const addUserMarker = () => {
    if (!map.current || !location?.coordinates) return;

    // Clear existing markers
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.current.removeLayer(layer);
      }
    });

    // Create custom marker icon
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 24px;
          height: 24px;
          background: ${currentZoneColor.fill};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 10px ${currentZoneColor.stroke};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          color: white;
        ">
          ${zone === 'Red' ? '🔴' : zone === 'Yellow' ? '🟡' : '🟢'}
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // Add marker
    L.marker([location.coordinates.latitude, location.coordinates.longitude], {
      icon: customIcon
    }).addTo(map.current);
  };

  if (!isVisible) return null;

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-2xl overflow-hidden border border-commuter-surface/20 shadow-2xl"
        style={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          minHeight: '400px'
        }}
      />
      
      {/* Zone Info Overlay */}
      <div className="absolute top-4 left-4 bg-commuter-card/90 backdrop-blur-xl border border-commuter-surface/20 rounded-xl p-4 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded-full ${
            zone === 'Red' ? 'bg-commuter-danger' : 
            zone === 'Yellow' ? 'bg-commuter-warning' : 
            'bg-commuter-success'
          }`}></div>
          <div>
            <div className="text-sm font-semibold text-commuter-text">
              {zone} ZONE
            </div>
            <div className="text-xs text-commuter-muted">
              {location?.city || 'Unknown Location'}
            </div>
          </div>
        </div>
      </div>

      {/* Zone Radius Info */}
      <div className="absolute bottom-4 right-4 bg-commuter-card/90 backdrop-blur-xl border border-commuter-surface/20 rounded-xl p-3 shadow-2xl">
        <div className="text-xs text-commuter-muted mb-1">Zone Radius</div>
        <div className="text-sm font-semibold text-commuter-text">
          {zone === 'Red' ? '500m' : zone === 'Yellow' ? '1km' : '2km'}
        </div>
      </div>

      {/* Loading State */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-commuter-bg/80 backdrop-blur-sm rounded-2xl">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 border-2 border-commuter-primary border-t-transparent rounded-full animate-spin"></div>
            <div className="text-sm text-commuter-text">Loading map...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleMapComponent;
