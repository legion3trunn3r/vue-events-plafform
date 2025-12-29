/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      animation: {
        blob: 'blob 7s infinite',
        bounce: 'bounce 1s infinite',
      },
      keyframes: {
        blob: {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
        },
      },
      backgroundColor: {
        slate: {
          '900/50': 'rgba(15, 23, 42, 0.5)',
          '800/30': 'rgba(30, 41, 59, 0.3)',
          '800/50': 'rgba(30, 41, 59, 0.5)',
        }
      },
      borderColor: {
        slate: {
          '700/50': 'rgba(51, 65, 85, 0.5)',
        }
      }
    },
  },
  plugins: [],
}
