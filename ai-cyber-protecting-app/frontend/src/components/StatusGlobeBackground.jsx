import React, { useEffect, useRef } from 'react';

/**
 * StatusGlobeBackground - Vanta.js globe animation for status page
 * Features:
 * - Interactive 3D globe animation
 * - Mouse and touch controls
 * - Matches the dark theme
 * - Performance optimized
 */
const StatusGlobeBackground = () => {
  const containerRef = useRef(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    // Wait for scripts to be available and DOM to be ready
    const initializeVanta = () => {
      if (window.VANTA && window.VANTA.GLOBE && containerRef.current) {
        console.log('Initializing Vanta.js globe for status page...');
        
        // Clean up existing instance
        if (vantaRef.current) {
          vantaRef.current.destroy();
        }

        // Initialize Vanta.js globe
        vantaRef.current = window.VANTA.GLOBE({
          el: containerRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x35E0C1, // Using the primary teal color from your theme
          backgroundColor: 0x0B0F14, // Using the deep space background color
          size: 1.2,
          speed: 1.5
        });
        
        console.log('Vanta.js status globe initialized successfully!');
      } else {
        console.log('Vanta.js not ready yet for status page, retrying...');
        // Retry after a short delay
        setTimeout(initializeVanta, 100);
      }
    };

    // Start initialization
    initializeVanta();

    // Cleanup function
    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
      }
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (vantaRef.current && vantaRef.current.resize) {
        vantaRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={containerRef}
      id="status-globe-background"
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: -3 }}
    />
  );
};

export default StatusGlobeBackground;
