// This file is included for completeness but not used — Tailwind is via CDN
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#faf8f5',
        surface: '#e9e5dd',
        text: '#1a2e1a',
        'text-dim': '#4a4a4a',
        accent: '#e66000',
        'accent-alt': '#ff8c42',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Satoshi', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
/* a11y fix: Config provided for potential future local Tailwind use with semantic class linting */