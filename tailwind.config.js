/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        mirrorHorizontalInstant: {
          '0%, 49.99%, 100%': { transform: 'scaleX(1)' },
          '50%, 99.99%': { transform: 'scaleX(-1)' },
        },
      },
      animation: {
        'mirror-h-instant': 'mirrorHorizontalInstant 2s steps(1) infinite',
      },
    },
  },
  plugins: [],
};
