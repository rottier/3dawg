/** @type {import('tailwindcss').Config} */

const colors = {
  primary: '#E6234E',
  secondary: '#0D375D',
  accent: '#39C7B7',
  neutral: '#3D4451',
  "base-100": "#0D375D"
}

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./node_modules/tw-elements/js/**/*.js"],
  plugins: [require('daisyui')],
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
      colors: colors,
    },
  },
  daisyui: {
    themes: [
      {
        threedawg: colors
      },
    ],
  },
};
