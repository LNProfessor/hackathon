import React, { useRef, useEffect, useState } from 'react';

/**
 * FeatureCard - Animated card with icon, title, description
 * Features:
 * - Entrance animation with intersection observer
 * - Subtle tilt effect on hover (respects reduced motion)
 * - Animated gradient border on hover
 * - Glow effect with color matching
 */
const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  delay = 0,
  glowColor = 'primary',
  onClick
}) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Intersection Observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]);

  // Mouse tracking for tilt effect
  const handleMouseMove = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    setMousePosition({
      x: (e.clientX - centerX) / (rect.width / 2),
      y: (e.clientY - centerY) / (rect.height / 2)
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  // Calculate tilt transform
  const tiltStrength = 8; // degrees
  const transform = window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    ? 'none'
    : `perspective(1000px) rotateX(${-mousePosition.y * tiltStrength}deg) rotateY(${mousePosition.x * tiltStrength}deg)`;

  const glowColors = {
    primary: 'hover:shadow-glow-primary',
    violet: 'hover:shadow-glow-violet',
    magenta: 'hover:shadow-glow-magenta'
  };

  return (
    <div
      ref={cardRef}
      className={`
        relative group cursor-pointer
        transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${glowColors[glowColor]}
      `}
      style={{ 
        transform,
        transitionDelay: isVisible ? '0ms' : `${delay}ms`
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Animated gradient border */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
        transition-opacity duration-300 ease-out
        bg-gradient-to-r from-commuter-primary via-commuter-violet to-commuter-magenta
        ${window.matchMedia('(prefers-reduced-motion: reduce)').matches ? '' : 'animate-pulse'}
      `} 
      style={{ padding: '1px' }}>
        <div className="w-full h-full bg-commuter-card rounded-2xl" />
      </div>

      {/* Main card content */}
      <div className="
        relative bg-commuter-card border border-commuter-surface
        rounded-2xl p-8 h-full
        transition-all duration-300 ease-out
        group-hover:border-commuter-primary/30
      ">
        
        {/* Icon */}
        <div className="mb-6">
          <div className="
            w-12 h-12 rounded-xl bg-commuter-surface
            flex items-center justify-center
            transition-all duration-300 ease-out
            group-hover:bg-commuter-primary/10
            group-hover:scale-110
          ">
            {typeof icon === 'string' && icon.startsWith('🌍') ? (
              <img 
                src="/globe-analytics-svgrepo-com.svg" 
                alt="Globe Analytics" 
                className="w-6 h-6"
                style={{ filter: 'invert(1) brightness(0.8)' }}
              />
            ) : typeof icon === 'string' && icon.startsWith('📡') ? (
              <img 
                src="/cybersecurity-two-tone-svgrepo-com.svg" 
                alt="Cybersecurity" 
                className="w-6 h-6"
                style={{ filter: 'invert(1) brightness(0.8)' }}
              />
            ) : typeof icon === 'string' && icon.startsWith('🎯') ? (
              <img 
                src="/threat-management-svgrepo-com.svg" 
                alt="Threat Management" 
                className="w-6 h-6"
                style={{ filter: 'invert(1) brightness(0.8)' }}
              />
            ) : (
              <span className="text-2xl">{icon}</span>
            )}
          </div>
        </div>

        {/* Content */}
        <h3 className="
          text-xl font-semibold text-commuter-text mb-4
          transition-colors duration-300 ease-out
          group-hover:text-commuter-primary
        ">
          {title}
        </h3>
        
        <p className="
          text-commuter-muted leading-relaxed
          transition-colors duration-300 ease-out
          group-hover:text-commuter-text
        ">
          {description}
        </p>

        {/* Hover indicator */}
        <div className="
          absolute bottom-6 right-6 opacity-0 
          transition-all duration-300 ease-out
          group-hover:opacity-100 group-hover:translate-x-0
          translate-x-2
        ">
          <svg className="w-5 h-5 text-commuter-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

/**
 * FeatureGrid - Container for feature cards with staggered animations
 */
export const FeatureGrid = ({ features, onFeatureClick }) => {
  return (
    <section id="features" className="py-24">
      <div className="max-w-commuter mx-auto px-6 lg:px-8">
        
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-commuter-text mb-4">
            Comprehensive Security Analysis
          </h2>
          <p className="text-lg text-commuter-muted max-w-2xl mx-auto">
            Our AI-powered system evaluates multiple risk vectors to provide 
            you with actionable security insights.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 150}
              glowColor={['primary', 'violet', 'magenta'][index % 3]}
              onClick={() => onFeatureClick && onFeatureClick(feature.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCard;
