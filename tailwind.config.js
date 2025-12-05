/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-etrain-orange',
    'bg-etrain-dark-blue',
    'text-etrain-orange',
    'text-etrain-dark-blue',
    'border-etrain-orange',
    'hover:bg-etrain-orange',
    'focus:ring-etrain-orange',
  ],
  theme: {
    extend: {
      colors: {
        'etrain-orange': '#7FD69C',
        'etrain-dark-blue': '#1A2332',
        'etrain-navy': '#2C3E50',
        'etrain-light-gray': '#F5F7FA',
        'etrain-medium-gray': '#8B95A5',
        'etrain-success': '#27AE60',
        'etrain-warning': '#F39C12',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
