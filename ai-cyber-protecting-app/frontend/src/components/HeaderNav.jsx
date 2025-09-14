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
const HeaderNav = ({ onGetStarted, onHomeClick, onConfigClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isHowItWorksOpen && !event.target.closest('.dropdown-container')) {
        setIsHowItWorksOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isHowItWorksOpen]);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
  ];

  const howItWorksSections = [
    { id: 'location-detection', label: 'Location Analysis' },
    { id: 'threat-assessment', label: 'Network Security' },
    { id: 'risk-scoring', label: 'Threat Intelligence' },
  ];

  const handleLogoClick = () => {
    // Always call onHomeClick to reset app state
    if (onHomeClick) {
      onHomeClick();
    }
    // Always scroll to top regardless of app state
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      // Reset app state and scroll to top
      if (onHomeClick) {
        onHomeClick();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '#features') {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    } else if (href === '#how-it-works') {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Function to scroll to specific sections within How It Works
  const scrollToSection = (sectionId) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
            <div 
              className="bg-commuter-card border border-commuter-surface/20 rounded-xl flex items-center justify-center p-1 group-hover:bg-commuter-primary/10 group-hover:border-commuter-primary/30 transition-all duration-200"
              style={{ width: '3.25rem', height: '3.25rem' }}
            >
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
              <div key={link.href} className="relative">
                {link.href === '#how-it-works' ? (
                  <div className="relative dropdown-container">
                    <button
                      onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
                      className="
                        text-commuter-muted hover:text-commuter-text 
                        transition-colors duration-200 ease-out
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-commuter-ring
                        focus-visible:ring-offset-2 focus-visible:ring-offset-commuter-bg
                        rounded-md px-2 py-1 flex items-center
                      "
                    >
                      {link.label}
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isHowItWorksOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-commuter-card border border-commuter-surface rounded-xl shadow-2xl z-50">
                        <div className="py-2">
                          {howItWorksSections.map((section) => (
                            <button
                              key={section.id}
                              onClick={() => scrollToSection(section.id)}
                              className="
                                w-full text-left px-4 py-3 text-sm text-commuter-text hover:text-commuter-primary
                                hover:bg-commuter-surface/50 transition-colors duration-200 ease-out
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-commuter-ring
                                focus-visible:ring-offset-2 focus-visible:ring-offset-commuter-bg
                              "
                            >
                              {section.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
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
                )}
              </div>
            ))}
          </nav>

          {/* Settings and CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Settings Button */}
            <button
              onClick={onConfigClick}
              className="
                w-10 h-10 bg-commuter-primary/20 hover:bg-commuter-primary/30 
                border border-commuter-primary/30 rounded-full
                flex items-center justify-center transition-colors duration-200
                text-commuter-primary hover:text-commuter-primary
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-commuter-ring
                focus-visible:ring-offset-2 focus-visible:ring-offset-commuter-bg
              "
              title="User Configuration"
            >
              <img 
                src="/settings-gear-svgrepo-com.svg" 
                alt="Settings" 
                className="w-9 h-9 opacity-80 hover:opacity-100 transition-opacity"
              />
            </button>

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
          </div>

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
                <div key={link.href}>
                  {link.href === '#how-it-works' ? (
                    <div>
                      <button
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
                      <div className="ml-4 mt-2 space-y-2">
                        {howItWorksSections.map((section) => (
                          <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className="
                              block text-commuter-muted hover:text-commuter-primary 
                              transition-colors duration-200 ease-out
                              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-commuter-ring
                              focus-visible:ring-offset-2 focus-visible:ring-offset-commuter-bg
                              rounded-md px-3 py-2 text-sm w-full text-left
                            "
                          >
                            {section.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button
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
                  )}
                </div>
              ))}
              
              {/* Mobile Settings and CTA Buttons */}
              <div className="mt-4 space-y-3">
                {/* Mobile Settings Button */}
                <button
                  onClick={() => {
                    onConfigClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="
                    w-full bg-commuter-primary/20 hover:bg-commuter-primary/30 
                    border border-commuter-primary/30 text-commuter-primary
                    font-medium py-3 px-4 rounded-xl
                    transition-all duration-200 ease-out
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-commuter-ring
                    focus-visible:ring-offset-2 focus-visible:ring-offset-commuter-bg
                    flex items-center justify-center space-x-2
                  "
                >
                  <img 
                    src="/settings-gear-svgrepo-com.svg" 
                    alt="Settings" 
                    className="w-6 h-6 opacity-80"
                  />
                  <span>Settings</span>
                </button>

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
                    active:scale-98
                  "
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderNav;