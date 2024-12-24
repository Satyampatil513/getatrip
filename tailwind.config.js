/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-alt': 'var(--primary-alt)',
        grey: 'var(--grey)',
        dark: 'var(--dark)',
        'dark-alt': 'var(--dark-alt)',
        light: 'var(--light)',
      },
      spacing: {
        'sidebar-width': 'var(--sidebar-width)',
      },
    },
  },
  variants: {
    extend: {
      
    },
  },
  plugins: [],
}

