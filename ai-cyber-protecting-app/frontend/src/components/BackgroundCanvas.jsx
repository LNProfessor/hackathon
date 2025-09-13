import React, { useEffect, useRef } from 'react';

/**
 * BackgroundCanvas - Layered background system with:
 * - Subtle dotted grid pattern
 * - 3 radial gradient glows (teal, violet, magenta)
 * - Optional noise overlay to prevent banding
 * - Respects prefers-reduced-motion
 */
const BackgroundCanvas = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      if (prefersReducedMotion) return;
      
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const draw = () => {
      if (!ctx || !canvas) return;

      const { width, height } = canvas;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw dot grid pattern
      const gridSize = 24;
      const dotSize = 1;
      const opacity = 0.05;
      
      ctx.fillStyle = `rgba(230, 237, 243, ${opacity})`;
      
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw radial gradient glows with subtle parallax
      const parallaxStrength = prefersReducedMotion ? 0 : 3;
      const mouseX = mouseRef.current.x || width / 2;
      const mouseY = mouseRef.current.y || height / 2;
      
      const parallaxX = (mouseX / width - 0.5) * parallaxStrength;
      const parallaxY = (mouseY / height - 0.5) * parallaxStrength;

      // Top-left teal glow
      const tealGradient = ctx.createRadialGradient(
        width * 0.2 + parallaxX, 
        height * 0.2 + parallaxY, 
        0, 
        width * 0.2 + parallaxX, 
        height * 0.2 + parallaxY, 
        width * 0.6
      );
      tealGradient.addColorStop(0, 'rgba(53, 224, 193, 0.15)');
      tealGradient.addColorStop(0.5, 'rgba(53, 224, 193, 0.05)');
      tealGradient.addColorStop(1, 'rgba(53, 224, 193, 0)');
      
      ctx.fillStyle = tealGradient;
      ctx.fillRect(0, 0, width, height);

      // Top-right violet glow
      const violetGradient = ctx.createRadialGradient(
        width * 0.8 - parallaxX, 
        height * 0.2 + parallaxY, 
        0, 
        width * 0.8 - parallaxX, 
        height * 0.2 + parallaxY, 
        width * 0.5
      );
      violetGradient.addColorStop(0, 'rgba(139, 92, 246, 0.12)');
      violetGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.04)');
      violetGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
      
      ctx.fillStyle = violetGradient;
      ctx.fillRect(0, 0, width, height);

      // Bottom magenta glow
      const magentaGradient = ctx.createRadialGradient(
        width * 0.5 + parallaxX * 0.5, 
        height * 0.8 - parallaxY, 
        0, 
        width * 0.5 + parallaxX * 0.5, 
        height * 0.8 - parallaxY, 
        width * 0.4
      );
      magentaGradient.addColorStop(0, 'rgba(255, 79, 154, 0.08)');
      magentaGradient.addColorStop(0.5, 'rgba(255, 79, 154, 0.03)');
      magentaGradient.addColorStop(1, 'rgba(255, 79, 154, 0)');
      
      ctx.fillStyle = magentaGradient;
      ctx.fillRect(0, 0, width, height);

      // Continue animation loop if motion is enabled
      if (!prefersReducedMotion) {
        animationId = requestAnimationFrame(draw);
      }
    };

    // Initialize
    resize();
    draw();

    // Event listeners
    window.addEventListener('resize', resize);
    if (!prefersReducedMotion) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <>
      {/* Canvas for dynamic effects */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: -2 }}
      />
      
      {/* Static noise overlay for texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay"
        style={{
          zIndex: -1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
};

export default BackgroundCanvas;
