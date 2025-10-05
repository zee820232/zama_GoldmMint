import { motion } from 'framer-motion';

interface ThorHammerProps {
  className?: string;
  level?: number;
  animated?: boolean;
  glowing?: boolean;
}

/**
 * 雷神之锤风格的锄头图标
 * 根据等级显示不同的颜色和特效
 */
export function ThorHammer({
  className = "w-16 h-16",
  level = 1,
  animated = false,
  glowing = false
}: ThorHammerProps) {
  // 根据等级获取颜色
  const getLevelColors = (lvl: number) => {
    switch (lvl) {
      case 1: return { primary: '#9CA3AF', secondary: '#6B7280', glow: '#D1D5DB' }; // 灰色
      case 2: return { primary: '#10B981', secondary: '#059669', glow: '#34D399' }; // 绿色
      case 3: return { primary: '#3B82F6', secondary: '#2563EB', glow: '#60A5FA' }; // 蓝色
      case 4: return { primary: '#A855F7', secondary: '#9333EA', glow: '#C084FC' }; // 紫色
      case 5: return { primary: '#F59E0B', secondary: '#D97706', glow: '#FCD34D' }; // 金色
      default: return { primary: '#9CA3AF', secondary: '#6B7280', glow: '#D1D5DB' };
    }
  };

  const colors = getLevelColors(level);

  const HammerSVG = (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 光晕效果 */}
      {glowing && (
        <g opacity="0.6">
          <circle
            cx="50"
            cy="35"
            r="25"
            fill={colors.glow}
            filter="url(#glow)"
          />
        </g>
      )}

      {/* 锤头 - 雷神之锤造型 */}
      <g filter="url(#shadow)">
        {/* 主锤头 */}
        <rect
          x="25"
          y="20"
          width="50"
          height="30"
          rx="4"
          fill={colors.primary}
        />

        {/* 锤头侧翼 */}
        <rect
          x="20"
          y="25"
          width="8"
          height="20"
          rx="2"
          fill={colors.secondary}
        />
        <rect
          x="72"
          y="25"
          width="8"
          height="20"
          rx="2"
          fill={colors.secondary}
        />

        {/* 锤头顶部装饰 */}
        <rect
          x="30"
          y="15"
          width="40"
          height="5"
          rx="2"
          fill={colors.glow}
        />

        {/* 雷纹装饰 */}
        <path
          d="M 40 28 L 45 35 L 42 35 L 46 42 L 40 37 L 43 37 Z"
          fill={colors.glow}
          opacity="0.8"
        />
        <path
          d="M 55 28 L 60 35 L 57 35 L 61 42 L 55 37 L 58 37 Z"
          fill={colors.glow}
          opacity="0.8"
        />

        {/* 锤柄 */}
        <rect
          x="46"
          y="50"
          width="8"
          height="45"
          rx="3"
          fill="#8B4513"
          stroke={colors.secondary}
          strokeWidth="1"
        />

        {/* 锤柄缠绕带 */}
        <rect x="45" y="55" width="10" height="2" fill={colors.primary} opacity="0.6" />
        <rect x="45" y="62" width="10" height="2" fill={colors.primary} opacity="0.6" />
        <rect x="45" y="69" width="10" height="2" fill={colors.primary} opacity="0.6" />
        <rect x="45" y="76" width="10" height="2" fill={colors.primary} opacity="0.6" />

        {/* 锤柄底部装饰 */}
        <circle cx="50" cy="92" r="4" fill={colors.secondary} />
        <circle cx="50" cy="92" r="2" fill={colors.glow} />
      </g>

      {/* 闪电特效 - 仅限高等级 */}
      {level >= 4 && (
        <g opacity="0.7">
          <motion.path
            d="M 15 30 L 10 40 L 15 40 L 8 55"
            stroke={colors.glow}
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.path
            d="M 85 30 L 90 40 L 85 40 L 92 55"
            stroke={colors.glow}
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 2,
              delay: 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </g>
      )}

      {/* 能量粒子 - 仅限传说级 */}
      {level >= 5 && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.circle
              key={i}
              cx="50"
              cy="35"
              r="2"
              fill={colors.glow}
              initial={{
                x: 0,
                y: 0,
                opacity: 0,
                scale: 0
              }}
              animate={{
                x: [0, Math.cos(i * 60 * Math.PI / 180) * 30],
                y: [0, Math.sin(i * 60 * Math.PI / 180) * 30],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          ))}
        </>
      )}

      {/* SVG 滤镜定义 */}
      <defs>
        {/* 阴影 */}
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
        </filter>

        {/* 光晕 */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </svg>
  );

  // 如果启用动画,包裹在 motion.div 中
  if (animated) {
    return (
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {HammerSVG}
      </motion.div>
    );
  }

  return HammerSVG;
}

/**
 * 简化版雷神之锤图标 (用于小尺寸显示)
 */
export function ThorHammerIcon({
  className = "w-6 h-6",
  level = 1
}: {
  className?: string;
  level?: number;
}) {
  const getLevelColor = (lvl: number) => {
    switch (lvl) {
      case 1: return '#9CA3AF';
      case 2: return '#10B981';
      case 3: return '#3B82F6';
      case 4: return '#A855F7';
      case 5: return '#F59E0B';
      default: return '#9CA3AF';
    }
  };

  const color = getLevelColor(level);

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 简化的锤头 */}
      <rect x="6" y="6" width="12" height="6" rx="1" fill={color} />
      <rect x="5" y="7" width="2" height="4" rx="0.5" fill={color} opacity="0.7" />
      <rect x="17" y="7" width="2" height="4" rx="0.5" fill={color} opacity="0.7" />

      {/* 简化的锤柄 */}
      <rect x="11" y="12" width="2" height="10" rx="1" fill="#8B4513" />

      {/* 闪电装饰 */}
      {level >= 4 && (
        <path
          d="M 11 8 L 13 10 L 12 10 L 13 12"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.8"
        />
      )}
    </svg>
  );
}
