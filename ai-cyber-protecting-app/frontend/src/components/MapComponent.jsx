import React, { useEffect, useRef, useState } from 'react';
import { Map, NavigationControl, GeolocateControl } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

const MapComponent = ({ location, zone, isVisible }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Zone colors matching the theme
  const zoneColors = {
    Green: {
      fill: 'rgba(34, 197, 94, 0.2)', // commuter-success with opacity
      stroke: 'rgba(34, 197, 94, 0.8)',
      glow: 'rgba(34, 197, 94, 0.4)'
    },
    Yellow: {
      fill: 'rgba(245, 158, 11, 0.2)', // commuter-warning with opacity
      stroke: 'rgba(245, 158, 11, 0.8)',
      glow: 'rgba(245, 158, 11, 0.4)'
    },
    Red: {
      fill: 'rgba(239, 68, 68, 0.2)', // commuter-danger with opacity
      stroke: 'rgba(239, 68, 68, 0.8)',
      glow: 'rgba(239, 68, 68, 0.4)'
    }
  };

  const currentZoneColor = zoneColors[zone] || zoneColors.Yellow;

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize MapTiler map with dark theme
    map.current = new Map({
      container: mapContainer.current,
      style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=demo',
      center: [location?.coordinates?.longitude || 0, location?.coordinates?.latitude || 0],
      zoom: 12,
      pitch: 45,
      bearing: 0
    });

    // Add navigation controls
    map.current.addControl(new NavigationControl(), 'top-right');
    map.current.addControl(new GeolocateControl(), 'top-left');

    map.current.on('load', () => {
      setMapLoaded(true);
      
      // Add zone radius circle
      if (location?.coordinates) {
        addZoneRadius();
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (map.current && mapLoaded && location?.coordinates) {
      addZoneRadius();
    }
  }, [zone, location, mapLoaded]);

  const addZoneRadius = () => {
    if (!map.current || !location?.coordinates) return;

    const sourceId = 'zone-radius';
    const layerId = 'zone-radius-fill';
    const strokeLayerId = 'zone-radius-stroke';

    // Remove existing layers and sources
    if (map.current.getLayer(layerId)) {
      map.current.removeLayer(layerId);
    }
    if (map.current.getLayer(strokeLayerId)) {
      map.current.removeLayer(strokeLayerId);
    }
    if (map.current.getSource(sourceId)) {
      map.current.removeSource(sourceId);
    }

    // Calculate radius based on zone (in meters)
    const radius = zone === 'Red' ? 500 : zone === 'Yellow' ? 1000 : 2000;

    // Create circle geometry
    const circle = createCircle(
      [location.coordinates.longitude, location.coordinates.latitude],
      radius,
      64
    );

    // Add source
    map.current.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: circle
      }
    });

    // Add fill layer
    map.current.addLayer({
      id: layerId,
      type: 'fill',
      source: sourceId,
      paint: {
        'fill-color': currentZoneColor.fill,
        'fill-opacity': 0.3
      }
    });

    // Add stroke layer
    map.current.addLayer({
      id: strokeLayerId,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': currentZoneColor.stroke,
        'line-width': 3,
        'line-opacity': 0.8
      }
    });

    // Add glow effect
    map.current.addLayer({
      id: 'zone-glow',
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': currentZoneColor.glow,
        'line-width': 8,
        'line-opacity': 0.6,
        'line-blur': 2
      }
    });

    // Add marker for user location
    addUserMarker();
  };

  const addUserMarker = () => {
    const markerId = 'user-marker';
    
    // Remove existing marker
    if (map.current.getLayer(markerId)) {
      map.current.removeLayer(markerId);
    }
    if (map.current.getSource(markerId)) {
      map.current.removeSource(markerId);
    }

    // Add marker source
    map.current.addSource(markerId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [location.coordinates.longitude, location.coordinates.latitude]
        },
        properties: {
          zone: zone
        }
      }
    });

    // Add marker layer
    map.current.addLayer({
      id: markerId,
      type: 'circle',
      source: markerId,
      paint: {
        'circle-radius': 12,
        'circle-color': currentZoneColor.stroke,
        'circle-stroke-width': 3,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.9
      }
    });

    // Add pulsing effect
    map.current.addLayer({
      id: 'user-marker-pulse',
      type: 'circle',
      source: markerId,
      paint: {
        'circle-radius': {
          'base': 12,
          'stops': [
            [0, 12],
            [20, 30]
          ]
        },
        'circle-color': currentZoneColor.glow,
        'circle-opacity': 0.3,
        'circle-stroke-width': 0
      }
    });
  };

  // Helper function to create circle geometry
  const createCircle = (center, radius, points) => {
    const coords = [];
    const distanceX = radius / (111320 * Math.cos(center[1] * Math.PI / 180));
    const distanceY = radius / 110540;

    for (let i = 0; i < points; i++) {
      const theta = (i / points) * (2 * Math.PI);
      const x = distanceX * Math.cos(theta);
      const y = distanceY * Math.sin(theta);
      coords.push([center[0] + x, center[1] + y]);
    }
    coords.push(coords[0]); // Close the circle

    return {
      type: 'Polygon',
      coordinates: [coords]
    };
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

export default MapComponent;
