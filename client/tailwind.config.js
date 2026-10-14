/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        ios: {
          blue: '#007AFF',
          indigo: '#5856D6',
          purple: '#AF52DE',
          pink: '#FF2D55',
          orange: '#FF9500',
          yellow: '#FFCC00',
          green: '#34C759',
          teal: '#5AC8FA',
          cyan: '#32ADE6',
          mint: '#00C7BE',
        },
        navy: {
          800: '#0f172a',
          900: '#090d1a',
          950: '#040711',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"SF Pro"',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        'liquid': '0 8px 32px -4px rgba(0, 0, 0, 0.08), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
        'liquid-dark': '0 16px 48px -8px rgba(0, 0, 0, 0.55), 0 4px 16px -2px rgba(0, 0, 0, 0.35)',
        'liquid-hover': '0 16px 40px -6px rgba(14, 165, 233, 0.22), 0 4px 12px -2px rgba(0, 0, 0, 0.1)',
        'liquid-glow': '0 0 35px -5px rgba(56, 189, 248, 0.35)',
        'specular-top': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.65)',
        'specular-top-dark': 'inset 0 1px 0.5px 0 rgba(255, 255, 255, 0.2)',
        'glass-button': '0 4px 14px 0 rgba(0, 122, 255, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'spring-snappy': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring-bounce': 'cubic-bezier(0.34, 1.4, 0.64, 1)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-reverse': 'float-reverse 9s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1.5deg)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(12px) rotate(-1.5deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
