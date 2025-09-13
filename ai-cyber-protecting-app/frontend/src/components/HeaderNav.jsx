import React, { useState, useEffect } from 'react';

/**
 * HeaderNav - Sticky translucent navigation with scroll shadow
 * Features:
 * - Backdrop blur with scroll-triggered shadow
 * - Clickable brand mark with logo
 * - Navigation links (Home, Features, Safety)
 * - Primary CTA button
 * - Keyboard accessible with focus management
 */
const HeaderNav = ({ onGetStarted, onHomeClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
  ];

  const handleLogoClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      // Fallback to scrolling to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Close mobile menu when logo is clicked
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavLinkClick = (href) => {
    // Close mobile menu when a nav link is clicked
    setIsMobileMenuOpen(false);
    // Scroll to the section
    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '#features') {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    } else if (href === '#how-it-works') {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`
        sticky top-0 z-50 w-full border-b transition-all duration-300 ease-out
        ${isScrolled 
          ? 'bg-commuter-surface/80 backdrop-blur-md border-commuter-surface shadow-scroll' 
          : 'bg-transparent border-transparent'
        }
      `}
    >
      <div className="max-w-commuter mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand - Clickable */}
          <button 
            onClick={handleLogoClick}
            className="
              flex items-center space-x-3 group
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-commuter-ring
              focus-visible:ring-offset-2 focus-visible:ring-offset-commuter-bg
              rounded-lg px-2 py-1 transition-all duration-200 ease-out
              hover:bg-commuter-surface/30
            "
          >
            <div className="w-10 h-10 bg-commuter-card rounded-xl flex items-center justify-center p-1 group-hover:bg-commuter-primary/10 transition-colors">
              <img 
                src="/hackathon_logo.png" 
                alt="Commuter: Cyber Travel Safety" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <div className="text-xl font-semibold text-commuter-text group-hover:text-commuter-primary transition-colors">
                Commuter
              </div>
              <div className="text-sm text-commuter-muted group-hover:text-commuter-primary/80 transition-colors -mt-1">
                Cyber Travel Safety
              </div>
            </div>
          </button>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavLinkClick(link.href)}
                className="
                  text-commuter-muted hover:text-commuter-text 
                  transition-colors duration-200 ease-out
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-commuter-ring
                  focus-visible:ring-offset-2 focus-visible:ring-offset-commuter-bg
                  rounded-md px-2 py-1
                "
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <button
            onClick={onGetStarted}
            className="
              bg-commuter-primary hover:bg-commuter-primary-600 
              text-commuter-bg font-medium px-4 py-2 rounded-xl
              transition-all duration-200 ease-out
              hover:shadow-glow-primary focus-visible:shadow-glow-primary
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-commuter-ring
              focus-visible:ring-offset-2 focus-visible:ring-offset-commuter-bg
              active:scale-98
            "
          >
            Get Started
          </button>

          {/* Mobile menu button */}
          <button 
            onClick={handleMobileMenuToggle}
            className="md:hidden p-2 text-commuter-muted hover:text-commuter-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-commuter-ring focus-visible:ring-offset-2 focus-visible:ring-offset-commuter-bg rounded-md"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isMobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-commuter-surface bg-commuter-surface/95 backdrop-blur-md">
            <div className="px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavLinkClick(link.href)}
                  className="
                    block text-commuter-muted hover:text-commuter-text 
                    transition-colors duration-200 ease-out
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-commuter-ring
                    focus-visible:ring-offset-2 focus-visible:ring-offset-commuter-bg
                    rounded-md px-3 py-2 text-lg font-medium w-full text-left
                  "
                >
                  {link.label}
                </button>
              ))}
              
              {/* Mobile CTA Button */}
              <button
                onClick={() => {
                  onGetStarted();
                  setIsMobileMenuOpen(false);
                }}
                className="
                  w-full bg-commuter-primary hover:bg-commuter-primary-600 
                  text-commuter-bg font-medium py-3 px-4 rounded-xl
                  transition-all duration-200 ease-out
                  hover:shadow-glow-primary focus-visible:shadow-glow-primary
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-commuter-ring
                  focus-visible:ring-offset-2 focus-visible:ring-offset-commuter-bg
                  active:scale-98 mt-4
                "
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderNav;