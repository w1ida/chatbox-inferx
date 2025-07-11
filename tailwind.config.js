/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      spacing: {
        none: 'var(--chatbox-spacing-none)',
        '3xs': 'var(--chatbox-spacing-3xs)',
        xxs: 'var(--chatbox-spacing-xxs)',
        xs: 'var(--chatbox-spacing-xs)',
        sm: 'var(--chatbox-spacing-sm)',
        md: 'var(--chatbox-spacing-md)',
        lg: 'var(--chatbox-spacing-lg)',
        xl: 'var(--chatbox-spacing-xl)',
        xxl: 'var(--chatbox-spacing-xxl)',
      },
      borderRadius: {
        none: 'var(--chatbox-radius-none)',
        xs: 'var(--chatbox-radius-xs)',
        sm: 'var(--chatbox-radius-sm)',
        md: 'var(--chatbox-radius-md)',
        lg: 'var(--chatbox-radius-lg)',
        xl: 'var(--chatbox-radius-xl)',
        xxl: 'var(--chatbox-radius-xxl)',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
        flash: 'flash 0.5s ease-in-out 2',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        flash: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('tailwind-scrollbar')],
  corePlugins: {
    preflight: false,
  },
}
