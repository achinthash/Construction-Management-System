/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      
      colors:{
        baseColor:'var(--base-color)',
        textColor: 'var(--text-color)',

      },
    },
  },
  plugins: [],
}

