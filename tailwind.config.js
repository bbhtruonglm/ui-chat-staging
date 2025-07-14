/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'xxs': '0.625rem', // Tương đương 10px
      },
      spacing: {
        '1.25': '0.3125rem',  // Tương đương 5px
        '1/2': '50%', // Thêm giá trị 50% vào thang đo spacing
      }
    }
  },
  plugins: [
    function ({ addUtilities, addBase }) {
      // tạo class custom
      addUtilities({
        '.webkit-box': { display: '-webkit-box' },
      })
      // reset css
      addBase({
        'button': { '@apply focus:outline-none hover:brightness-90 disabled:opacity-50': {} },
        'a': { '@apply underline text-blue-700 hover:brightness-90 disabled:opacity-50': {} },
      })
    },
  ],
}
