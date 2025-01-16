import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s cubic-bezier(0.5, 0.15, 0.5, 0.85) infinite',
        'spin-slower': 'spin 4s cubic-bezier(0.5, 0.15, 0.5, 0.85) infinite',
      }
    }
  },
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
};

export default config; 