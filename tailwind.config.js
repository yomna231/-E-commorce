/** @type {import('tailwindcss').Config} */
module.exports = {
   darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
 
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        montserrat: ['"Montserrat"', 'sans-serif'],
        pacifico: ['"Pacifico"', 'cursive'],
          poppins: ['Poppins', 'sans-serif'],
            cairo: ['Cairo', 'sans-serif']
    },
  },
  plugins: [
  //  'flowbite/plugin'
  require('flowbite/plugin')
  ],

  
}
}
