import type { Config } from 'tailwindcss';

// Base Tailwind config shared across all ParishMart apps.
// Import and spread in your app's tailwind.config.ts.
const config: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1B4F72',
          secondary: '#2E86C1',
          accent: '#F39C12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};

export default config;
