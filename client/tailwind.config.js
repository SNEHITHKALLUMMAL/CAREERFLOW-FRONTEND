/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Base surfaces
        ink: '#0C1220', // dark-mode background — near-black navy, not flat black
        paper: '#F5F6FA', // light-mode background — cool off-white

        // Brand / semantic accents
        signal: {
          DEFAULT: '#5B5FEF', // primary actions, links, focus rings
          dark: '#4548C9',
          light: '#EEF0FD',
        },
        momentum: {
          DEFAULT: '#17B897', // growth / progress / success (employability score, verified skills)
          dark: '#0F9A7D',
          light: '#E7F9F4',
        },
        ember: {
          DEFAULT: '#FF7A45', // sparing use — alerts, secondary highlight
          dark: '#E85F2E',
          light: '#FFEEE5',
        },
        mist: {
          DEFAULT: '#8A93A6', // secondary text, borders
          dark: '#4B5468',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(12, 18, 32, 0.12)',
        'glass-lg': '0 16px 48px 0 rgba(12, 18, 32, 0.18)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};
