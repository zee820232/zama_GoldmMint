/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Zama 黄金主题色
        'zama-gold': {
          50: '#FFFBEA',
          100: '#FFF3C4',
          200: '#FFE999',
          300: '#FFD766',
          400: '#FFC107',
          500: '#F4B93E',
          600: '#D4A017',
          700: '#B8860B',
          800: '#9B7409',
          900: '#7D5E00',
        },
        // Zama 深黑主题色
        'zama-dark': {
          50: '#2A2A2A',
          100: '#1F1F1F',
          200: '#1A1A1A',
          300: '#141414',
          400: '#0F0F0F',
          500: '#0A0A0A',
          600: '#080808',
          700: '#050505',
          800: '#030303',
          900: '#000000',
        },
        // 强调色
        'zama-orange': '#FF9800',
        'zama-amber': '#FFB300',
        // 保留原有主色(向后兼容)
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // 锄头等级颜色
        rarity: {
          common: '#6B7280',
          uncommon: '#10B981',
          rare: '#3B82F6',
          epic: '#A855F7',
          legendary: '#F4B93E', // 改为Zama金色
        },
        // 游戏主题颜色(更新为黄金主题)
        gold: '#F4B93E',
        mine: {
          darker: '#0A0A0A',
          dark: '#141414',
          medium: '#1A1A1A',
          light: '#2A2A2A',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.6s ease-out forwards',
        'slideInLeft': 'slideInLeft 0.6s ease-out forwards',
        'slideInRight': 'slideInRight 0.6s ease-out forwards',
        'scaleIn': 'scaleIn 0.4s ease-out forwards',
        'mining': 'mining 0.6s ease-in-out',
        'miningShake': 'miningShake 0.5s ease-in-out',
        'miningPulse': 'miningPulse 1s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'glowPulse': 'glowPulse 2s ease-in-out infinite',
        'cardFloat': 'cardFloat 3s ease-in-out infinite',
        'celebrate': 'celebrate 0.6s ease-out forwards',
        'coinFlip': 'coinFlip 1s ease-out forwards',
        'spin': 'spin 1s linear infinite',
        'bounce': 'bounce 1s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradientShift': 'gradientShift 8s ease infinite',
        'borderGlow': 'borderGlow 2s ease-in-out infinite',
        // Zama 黄金主题动画
        'goldPulse': 'goldPulse 2s ease-in-out infinite',
        'goldShine': 'goldShine 3s linear infinite',
        'goldFloat': 'goldFloat 3s ease-in-out infinite',
        'scanLine': 'scanLine 2s linear infinite',
        'particleFloat': 'particleFloat 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          'from': { opacity: '0', transform: 'translateX(-30px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          'from': { opacity: '0', transform: 'translateX(30px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.9)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        mining: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-5px) rotate(-5deg)' },
          '75%': { transform: 'translateY(-5px) rotate(5deg)' },
        },
        miningShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        miningPulse: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.1)' },
        },
        glowPulse: {
          '0%, 100%': { filter: 'drop-shadow(0 0 5px currentColor)' },
          '50%': { filter: 'drop-shadow(0 0 20px currentColor)' },
        },
        cardFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        celebrate: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        coinFlip: {
          '0%': { transform: 'rotateY(0deg) scale(0)' },
          '50%': { transform: 'rotateY(180deg) scale(1.2)' },
          '100%': { transform: 'rotateY(360deg) scale(1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        borderGlow: {
          '0%, 100%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor, 0 0 40px currentColor' },
        },
        // Zama 黄金主题关键帧动画
        goldPulse: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(244, 185, 62, 0.5), 0 0 40px rgba(244, 185, 62, 0.3)',
            transform: 'scale(1)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(255, 215, 0, 0.8), 0 0 80px rgba(255, 215, 0, 0.5)',
            transform: 'scale(1.02)',
          },
        },
        goldShine: {
          '0%': {
            backgroundPosition: '-200% center',
          },
          '100%': {
            backgroundPosition: '200% center',
          },
        },
        goldFloat: {
          '0%, 100%': {
            transform: 'translateY(0) rotate(0deg)',
            filter: 'drop-shadow(0 0 10px rgba(244, 185, 62, 0.5))',
          },
          '50%': {
            transform: 'translateY(-10px) rotate(5deg)',
            filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))',
          },
        },
        scanLine: {
          '0%': {
            transform: 'translateY(-100%)',
            opacity: '0',
          },
          '50%': {
            opacity: '0.3',
          },
          '100%': {
            transform: 'translateY(100%)',
            opacity: '0',
          },
        },
        particleFloat: {
          '0%': {
            transform: 'translateY(0) translateX(0)',
            opacity: '0',
          },
          '10%': {
            opacity: '1',
          },
          '90%': {
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(-100vh) translateX(20px)',
            opacity: '0',
          },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 10px currentColor',
        'glow': '0 0 20px currentColor',
        'glow-lg': '0 0 30px currentColor, 0 0 50px currentColor',
        'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
        // Zama 黄金光晕效果
        'gold-glow': '0 0 20px rgba(244, 185, 62, 0.5), 0 0 40px rgba(244, 185, 62, 0.3)',
        'gold-glow-lg': '0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.4)',
        'gold-intense': '0 0 40px rgba(255, 215, 0, 0.8), 0 0 80px rgba(255, 215, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mine-texture': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        // Zama 黄金渐变背景
        'gold-gradient': 'linear-gradient(135deg, #F4B93E 0%, #FFC107 50%, #FFD700 100%)',
        'gold-radial': 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, rgba(244, 185, 62, 0.1) 50%, transparent 100%)',
        'tech-grid-gold': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23F4B93E\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
}
