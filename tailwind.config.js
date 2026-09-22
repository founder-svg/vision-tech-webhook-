/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          light: '#25D366',
          dark: '#075E54',
          teal: '#128C7E',
          tealDark: '#0b141a',
          chatBg: '#0b141a',
          bubbleOut: '#005c4b',
          bubbleIn: '#202c33',
          sidebar: '#111b21',
          header: '#202c33',
          hover: '#2a3942',
          accent: '#00a884',
          blueTick: '#53bdeb'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
