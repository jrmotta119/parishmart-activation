import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1A56A0',
          secondary: '#2563EB',
          accent: '#F59E0B',
        },
        parish: {
          primary: 'var(--parish-primary)',
          accent: 'var(--parish-accent)',
        },
        parchment: '#F8F9FB',
        ink: '#0F172A',
        gold: '#006699',
        'gold-light': '#0088CC',
        'gold-muted': '#004D73',
        mist: '#E8ECF2',
        'warm-gray': '#64748B',
        surface: '#FFFFFF',
        'surface-2': '#F1F5F9',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['2.5rem', { lineHeight: '1.12', letterSpacing: '-0.02em' }],
        'display-lg': ['2rem', { lineHeight: '1.18', letterSpacing: '-0.015em' }],
        'display-md': ['1.5rem', { lineHeight: '1.22', letterSpacing: '-0.01em' }],
        'display-sm': ['1.25rem', { lineHeight: '1.28', letterSpacing: '-0.005em' }],
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(15,23,42,0.06), 0 4px 12px rgba(15,23,42,0.04)',
        'warm-md': '0 4px 16px rgba(15,23,42,0.08), 0 1px 4px rgba(15,23,42,0.04)',
        'warm-lg': '0 8px 32px rgba(15,23,42,0.12), 0 2px 8px rgba(15,23,42,0.06)',
        'gold-glow': '0 0 24px rgba(217,119,6,0.25)',
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-in-left': 'slideInLeft 0.35s cubic-bezier(0.32,0.72,0,1) forwards',
      },
      keyframes: {
        slideUp: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-100%)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
