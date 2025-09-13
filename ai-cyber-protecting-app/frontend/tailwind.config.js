/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // Commuter design system colors
        commuter: {
          bg: 'var(--bg)',
          surface: 'var(--surface)',
          card: 'var(--card)',
          text: 'var(--text)',
          muted: 'var(--muted)',
          primary: 'var(--primary)',
          'primary-600': 'var(--primary-600)',
          violet: 'var(--violet)',
          magenta: 'var(--magenta)',
          ring: 'var(--ring)',
          success: 'var(--success)',
          warning: 'var(--warning)',
          danger: 'var(--danger)',
        },
        // Legacy support
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "var(--ring)",
        background: "var(--bg)",
        foreground: "var(--text)",
        primary: {
          DEFAULT: "var(--primary)",
          600: "var(--primary-600)",
          foreground: "var(--bg)",
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        warning: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'pulse-slow': 'pulse 2s infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)' },
        },
        'gradient-y': {
          '0%, 50%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '25%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          },
          '75%': {
            'background-size': '200% 200%',
            'background-position': 'center bottom'
          },
        },
        'gradient-x': {
          '0%, 50%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '25%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'gradient-xy': {
          '0%, 50%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '25%': {
            'background-size': '400% 400%',
            'background-position': 'right center'
          },
          '75%': {
            'background-size': '400% 400%',
            'background-position': 'center bottom'
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-security': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-success': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient-warning': 'linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)',
        'gradient-danger': 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '72px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(53, 224, 193, 0.3)',
        'glow-lg': '0 0 40px rgba(53, 224, 193, 0.4)',
        'glow-primary': '0 0 20px rgba(53, 224, 193, 0.3)',
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-magenta': '0 0 20px rgba(255, 79, 154, 0.3)',
        'glow-success': '0 0 20px rgba(34, 197, 94, 0.3)',
        'glow-warning': '0 0 20px rgba(245, 158, 11, 0.3)',
        'glow-danger': '0 0 20px rgba(239, 68, 68, 0.3)',
        'soft': '0 4px 20px rgba(0, 0, 0, 0.15)',
        'scroll': '0 1px 3px rgba(0, 0, 0, 0.1)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      maxWidth: {
        'commuter': '1320px',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      screens: {
        '3xl': '1600px',
        '4xl': '1920px',
      },
    },
  },
  plugins: [
    // Add custom utilities for glass morphism effect
    function({ addUtilities }) {
      const newUtilities = {
        '.glass': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
        '.glass-strong': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.5)',
        },
        '.text-glow': {
          textShadow: '0 0 10px currentColor',
        },
        '.text-glow-lg': {
          textShadow: '0 0 20px currentColor',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
