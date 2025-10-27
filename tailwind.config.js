/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-100% - var(--gap)))' }
        },
        'marquee-vertical': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(calc(-100% - var(--gap)))' }
        },
        aurora: {
          'from': { backgroundPosition: '0% 0%' },
          'to': { backgroundPosition: '200% 0%' }
        }
      },
      animation: {
        'marquee': 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
        'aurora': 'aurora 10s linear infinite'
      }
    },
  },
  plugins: [],
}