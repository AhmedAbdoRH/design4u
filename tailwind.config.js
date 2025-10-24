/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#000000',    // أسود حالك
        secondary: '#ffffff',   // أبيض نقي
        accent: '#d99323',     // ذهبي لامع
        'accent-light': '#e0a745', // ذهبي أفتح
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};