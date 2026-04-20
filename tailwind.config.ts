import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,ts,tsx}',
    './server/**/*.ts',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C8622A',
          dark: '#8B3812',
          soft: '#F0CDB8',
          bg: '#FDF3EC',
        },
        vf: {
          bg: '#FAF7F2',
          card: '#FFFFFF',
          surface: '#F5EDE3',
          border: '#EDE3D8',
          text: '#2A1810',
          mid: '#7D5A48',
          muted: '#B8967A',
          success: '#4E7C5E',
          tab: 'rgba(250,247,242,0.97)',
        },
        role: {
          admin: '#C8622A',
          editor: '#4E7C5E',
          contributor: '#6B7CB8',
        },
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
} satisfies Config
