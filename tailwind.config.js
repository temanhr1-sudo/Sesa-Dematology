/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#EC6BA5',
        darkPink: '#D63384',
        softPink: '#F8B3CF',
        deepMagenta: '#8A1E4D',
        babyPink: '#FFDEE9',
        lightRose: '#FFF3F7',
        roseTint: '#FCEEF3',
        softGray: '#F2F2F7',
        slateGray: '#6B7280',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #EC6BA5, #D63384)',
        'gradient-soft': 'linear-gradient(to right, #F8B3CF, #FFFFFF)',
      }
    },
  },
  plugins: [],
}