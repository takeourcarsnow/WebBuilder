import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palantir-inspired color palette
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        accent: {
          teal: '#00d4ff',
          cyan: '#00ffff',
          blue: '#0066ff',
        },
        surface: {
          light: '#ffffff',
          'light-elevated': '#f8f9fa',
          dark: '#0a0a0a',
          'dark-elevated': '#141414',
          'dark-secondary': '#1a1a1a',
          'dark-tertiary': '#242424',
        },
        text: {
          primary: '#000000',
          secondary: '#6b7280',
          'dark-primary': '#ffffff',
          'dark-secondary': '#a3a3a3',
          'dark-tertiary': '#737373',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      borderRadius: {
        'palantir': '2px',
        'palantir-md': '4px',
        'palantir-lg': '6px',
      },
      boxShadow: {
        'palantir': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'palantir-lg': '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
        'palantir-xl': '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)',
        'palantir-glow': '0 0 20px rgba(0, 212, 255, 0.3)',
        'palantir-glow-lg': '0 0 40px rgba(0, 212, 255, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 0.8, 0.3, 1)',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 0.8, 0.3, 1)',
        'slide-down': 'slideDown 0.5s cubic-bezier(0.16, 0.8, 0.3, 1)',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16, 0.8, 0.3, 1)',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
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

export default config
