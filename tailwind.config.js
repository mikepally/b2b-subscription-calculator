/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'etrain': {
          orange: '#FF6B35',
          'dark-blue': '#1A2332',
          navy: '#2C3E50',
          'light-gray': '#F5F7FA',
          'medium-gray': '#8B95A5',
          success: '#27AE60',
          warning: '#F39C12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
