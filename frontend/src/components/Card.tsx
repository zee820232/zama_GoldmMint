import { HTMLAttributes } from 'react';
import { cn } from '@/utils/helpers';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'glass' | 'dark' | 'tech' | 'hologram';
  hover3d?: boolean;
  glow?: boolean;
}

export function Card({
  className,
  variant = 'default',
  hover3d = false,
  glow = false,
  children,
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-white',
    bordered: 'bg-white border-2 border-gray-200 hover:border-primary-300',
    elevated: 'bg-white shadow-lg hover:shadow-xl',
    glass: 'bg-white/80 backdrop-blur-md border border-white/20 shadow-xl',
    dark: 'bg-gradient-to-br from-mine-dark to-mine-darker border border-mine-medium text-white',
    tech: 'bg-gradient-to-br from-gray-900 to-gray-800 border border-blue-500/30 text-white shadow-lg shadow-blue-500/10',
    hologram: 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-400/30 text-white relative overflow-hidden',
  };

  const hoverEffects = hover3d ? 'card-3d' : '';
  const glowEffect = glow ? 'rarity-glow' : '';

  return (
    <div
      className={cn(
        'rounded-xl p-4 md:p-6 transition-all duration-300 relative',
        variants[variant],
        hoverEffects,
        glowEffect,
        className
      )}
      {...props}
    >
      {/* 科技感装饰元素 */}
      {variant === 'tech' && (
        <>
          <div className="absolute inset-0 rounded-xl tech-grid pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-xl" />
        </>
      )}
      
      {/* 全息效果装饰 */}
      {variant === 'hologram' && (
        <>
          <div className="absolute inset-0 rounded-xl animate-hologramFlicker opacity-50" 
               style={{
                 background: `repeating-linear-gradient(
                   45deg,
                   transparent,
                   transparent 2px,
                   rgba(59, 130, 246, 0.1) 2px,
                   rgba(59, 130, 246, 0.1) 4px
                 )`
               }} />
          <div className="absolute inset-0 rounded-xl scanline" />
        </>
      )}
      
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-3 md:mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-xl md:text-2xl font-bold text-gray-900', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-3 md:space-y-4', className)} {...props}>
      {children}
    </div>
  );
}