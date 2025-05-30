/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6EEFF',
          100: '#CCDEFF',
          200: '#99BDFF',
          300: '#669CFF',
          400: '#337BFF',
          500: '#0F52BA', // Brookside blue
          600: '#0C42A5',
          700: '#093185',
          800: '#062165',
          900: '#031045',
        },
        secondary: {
          50: '#E6F6F6',
          100: '#CCEEEE',
          200: '#99DCDD',
          300: '#66CBCC',
          400: '#33B9BA',
          500: '#0E7C7B',
          600: '#0B6362',
          700: '#084A4A',
          800: '#053131',
          900: '#021919',
        },
        accent: {
          50: '#FFECE6',
          100: '#FFDACC',
          200: '#FFB599',
          300: '#FF9066',
          400: '#FF6B33',
          500: '#FF6B35', // Accent orange
          600: '#E55426',
          700: '#B2401D',
          800: '#802D14',
          900: '#4C1A0C',
        },
        success: {
          50: '#E9F7EF',
          100: '#D4F0DF',
          200: '#A9E1BF',
          300: '#7ED29F',
          400: '#53C37F',
          500: '#28B45F',
          600: '#20904C',
          700: '#186C39',
          800: '#104826',
          900: '#082413',
        },
        warning: {
          50: '#FFF8E6',
          100: '#FFF1CC',
          200: '#FFE499',
          300: '#FFD666',
          400: '#FFC933',
          500: '#FFBB00',
          600: '#CC9600',
          700: '#997000',
          800: '#664B00',
          900: '#332500',
        },
        error: {
          50: '#FDEAEC',
          100: '#FBD5D9',
          200: '#F7ACB3',
          300: '#F3828C',
          400: '#EF5966',
          500: '#EB2F40',
          600: '#BC2633',
          700: '#8D1C26',
          800: '#5E131A',
          900: '#2F090D',
        },
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      spacing: {
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};