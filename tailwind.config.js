import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [nextui({
    prefix: 'nextui',
    addCommonColors: false,
    defaultExtendTheme: 'light',
    defaultTheme: 'light',
    layout: {},
    themes: {
      light: {
        colors: {
          primary: {
            50: '#ffeeec',
            100: '#ffddd9',
            200: '#ffbbb4',
            300: '#fe978f',
            400: '#f8716a',
            500: '#ef4444',
            600: '#b13030',
            700: '#781d1d',
            800: '#420c0c',
            900: '#140202',
            DEFAULT: '#ef4444',
            foreground: '#fff',
          },
          background: {
            DEFAULT: '#fcfcfc'
          }
        },
        layout: {}
      },
    },
  })],
}
