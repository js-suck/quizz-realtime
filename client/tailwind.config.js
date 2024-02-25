/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
      './src/index.css',
  ],  theme: {
    extend: {
      colors: {
        'primary': '#272f61',
      },
    },
  },
  plugins: [],
}

