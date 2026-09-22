export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0f172a',
          850: '#1e293b',
        },
        stone: {
          600: '#334155',
        },
        amber: {
          500: '#f59e0b',
        },
        emerald: {
          500: '#10b981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 12px rgba(245, 158, 11, 0.15)' },
          '100%': { boxShadow: '0 0 24px rgba(245, 158, 11, 0.35)' },
        },
      },
    },
  },
  plugins: [],
};
