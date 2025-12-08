// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#774230',
        secondary: '#2A0F38',
        accent: '#3c1053',
        light: {
          primary: '#f8f5f2',
          secondary: '#f4f1f8'
        }
      },
      fontFamily: {
        'arabic': ['SF Arabic', 'Segoe UI', 'Tahoma', 'sans-serif'],
      },
      boxShadow: {
        'smooth': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 20px rgba(59, 16, 83, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
}