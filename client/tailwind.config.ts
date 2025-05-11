/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F172A",
        text: "#F1F5F9",
        primary: "#0E76FD",
        accent: "#22D3EE",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  keyframes: {
    float: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-10px)' },
    },
  },
  animation: {
    float: 'float 3s ease-in-out infinite',
  },
  plugins: [],
};
