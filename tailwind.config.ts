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
        glass: {
          bg:     'rgba(255,255,255,0.6)',
          'bg-md':'rgba(255,255,255,0.65)',
          border: 'rgba(255,255,255,0.9)',
        },
        page: {
          base: '#eef4fb',
        },
      },
      fontFamily: {
        sans: ['var(--font-wix)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
