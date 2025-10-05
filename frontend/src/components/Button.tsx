import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/helpers';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  glow?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, glow, children, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center rounded-lg font-medium
      transition-all duration-300 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-95 transform
      relative overflow-hidden
      group
    `;

    const variants = {
      primary: `
        bg-gradient-to-r from-primary-600 to-primary-700
        text-white
        hover:from-primary-700 hover:to-primary-800
        focus:ring-primary-500
        shadow-lg hover:shadow-xl
        ${glow ? 'animate-glowPulse' : ''}
      `,
      secondary: `
        bg-gradient-to-r from-gray-200 to-gray-300
        text-gray-900
        hover:from-gray-300 hover:to-gray-400
        focus:ring-gray-500
        shadow-md hover:shadow-lg
      `,
      outline: `
        border-2 border-primary-600
        text-primary-600
        hover:bg-primary-50 hover:border-primary-700
        focus:ring-primary-500
        backdrop-blur-sm
      `,
      ghost: `
        text-gray-700
        hover:bg-gray-100
        focus:ring-gray-500
      `,
      danger: `
        bg-gradient-to-r from-red-600 to-red-700
        text-white
        hover:from-red-700 hover:to-red-800
        focus:ring-red-500
        shadow-lg hover:shadow-xl
      `,
      success: `
        bg-gradient-to-r from-green-600 to-green-700
        text-white
        hover:from-green-700 hover:to-green-800
        focus:ring-green-500
        shadow-lg hover:shadow-xl
      `,
      gold: `
        bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500
        text-gray-900 font-bold
        hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-400
        focus:ring-yellow-500
        shadow-lg shadow-yellow-500/50 hover:shadow-xl hover:shadow-yellow-500/70
        animate-gradientShift
        ${glow ? 'animate-glow' : ''}
      `,
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm min-h-[36px]',
      md: 'px-4 py-2.5 text-base min-h-[44px]',
      lg: 'px-6 py-3 text-base md:text-lg min-h-[48px]',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={loading || disabled}
        {...props}
      >
        {/* 光泽效果 */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                        transform -translate-x-full group-hover:translate-x-full
                        transition-transform duration-700 ease-out" />

        {/* 内容 */}
        <span className="relative flex items-center">
          {loading && (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';
