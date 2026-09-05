/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0B6B4B',
        'primary-dark': '#094d36',
        'primary-light': '#0d7d58',
        secondary: '#F8FAFC',
        accent: '#D4AF37',
        'accent-dark': '#b8962e',
        success: '#22C55E',
        text: '#111827',
        border: '#E5E7EB',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        xl: '20px',
        '2xl': '24px',
      },
      boxShadow: {
        premium: '0 4px 24px 0 rgba(11,107,75,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.06)',
        card: '0 2px 16px 0 rgba(0,0,0,0.08)',
        glass: '0 8px 32px 0 rgba(11,107,75,0.12)',
      },
      backdropBlur: {
        glass: '12px',
      },
    },
  },
  plugins: [],
};
