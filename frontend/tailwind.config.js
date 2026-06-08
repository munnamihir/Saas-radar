/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f7f6f3',
          100: '#eceae3',
          200: '#d8d4c8',
          300: '#bfb9a8',
          400: '#a09886',
          500: '#857a67',
          600: '#6b6152',
          700: '#574e42',
          800: '#473f36',
          900: '#3c352e',
          950: '#201c17',
        },
        acid: {
          DEFAULT: '#c8f53a',
          dark: '#a8d420',
        },
        ember: {
          DEFAULT: '#ff5c35',
          light: '#ff7a58',
        },
        frost: {
          DEFAULT: '#3a8fff',
          light: '#6aaeff',
        }
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        slideUp: {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        }
      }
    },
  },
  plugins: [],
}
