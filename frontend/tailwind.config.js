/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mainTheme: '#eb1051',
        mainThemeTinted: '#b31746',
        secondaryTheme: '#395dfa',
        secondaryThemeTinted: '#334bb5',
      },
      animation: {
        bounce200: 'bounce 1s infinite 400ms',
        bounce400: 'bounce 1s infinite 800ms',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),

  ],
}
