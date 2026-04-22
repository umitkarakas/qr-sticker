import type { Config } from 'tailwindcss'

export default {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy:  '#172D4B',
          blue:  '#20A4DB',
          teal:  '#4CBBC2',
        },
      },
      fontFamily: {
        sans: ['Wix Madefor Display', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
