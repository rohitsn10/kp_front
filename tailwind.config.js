/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      primary: '#3498db',
      secondary: '#29346B',
      success: '#2ecc71',
      danger: '#e74c3c',
      warning: '#f39c12',
    },
  },
  plugins: [],
}

