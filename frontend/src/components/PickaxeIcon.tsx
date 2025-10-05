/**
 * 锄头SVG图标组件
 * 根据不同等级显示不同造型和颜色的锄头
 */

interface PickaxeIconProps {
  level: 1 | 2 | 3 | 4 | 5;
  className?: string;
  animate?: boolean;
}

export function PickaxeIcon({ level, className = '', animate = false }: PickaxeIconProps) {
  const baseClass = `${className} ${animate ? 'animate-goldFloat' : ''}`;

  // 等级1: 简单木柄锄头(灰色)
  if (level === 1) {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={baseClass}
      >
        {/* 锄头头部 - 灰色 */}
        <rect x="35" y="8" width="18" height="6" rx="1" fill="#6B7280" />
        <rect x="50" y="11" width="6" height="12" rx="1" fill="#6B7280" />

        {/* 木柄 - 棕色 */}
        <rect
          x="28"
          y="14"
          width="4"
          height="44"
          rx="2"
          fill="#8B4513"
          transform="rotate(-15 30 36)"
        />

        {/* 阴影效果 */}
        <rect x="35" y="8" width="18" height="2" rx="1" fill="#4B5563" opacity="0.5" />
      </svg>
    );
  }

  // 等级2: 木柄锄头(绿色)
  if (level === 2) {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={baseClass}
      >
        {/* 锄头头部 - 绿色 */}
        <path
          d="M36 10 L54 10 L56 12 L56 16 L54 18 L36 18 L34 16 L34 12 Z"
          fill="#10B981"
          stroke="#059669"
          strokeWidth="1"
        />
        <rect x="51" y="12" width="8" height="14" rx="2" fill="#10B981" stroke="#059669" strokeWidth="1" />

        {/* 木柄 - 深棕色 */}
        <rect
          x="29"
          y="16"
          width="5"
          height="42"
          rx="2.5"
          fill="#6D4C41"
          transform="rotate(-15 31.5 37)"
        />

        {/* 装饰线 */}
        <line x1="38" y1="14" x2="52" y2="14" stroke="#34D399" strokeWidth="1" />
      </svg>
    );
  }

  // 等级3: 铁质锄头(蓝色)
  if (level === 3) {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={baseClass}
      >
        {/* 锄头头部 - 蓝色金属质感 */}
        <defs>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>

        <path
          d="M35 9 L55 9 L57 11 L57 17 L55 19 L35 19 L33 17 L33 11 Z"
          fill="url(#blueGrad)"
          stroke="#1E40AF"
          strokeWidth="1.5"
        />
        <rect x="52" y="11" width="9" height="16" rx="2" fill="url(#blueGrad)" stroke="#1E40AF" strokeWidth="1.5" />

        {/* 铁柄 - 灰色 */}
        <rect
          x="29"
          y="17"
          width="6"
          height="40"
          rx="3"
          fill="#475569"
          stroke="#334155"
          strokeWidth="1"
          transform="rotate(-15 32 37)"
        />

        {/* 高光效果 */}
        <rect x="37" y="11" width="2" height="6" rx="1" fill="#93C5FD" opacity="0.8" />
        <circle cx="54" cy="14" r="1.5" fill="#DBEAFE" opacity="0.6" />
      </svg>
    );
  }

  // 等级4: 钻石锄头(紫色)
  if (level === 4) {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={baseClass}
      >
        {/* 钻石头部 - 紫色渐变 */}
        <defs>
          <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#9333EA" />
          </linearGradient>
          <radialGradient id="purpleGlow">
            <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 光晕效果 */}
        <circle cx="46" cy="14" r="12" fill="url(#purpleGlow)" opacity="0.6" />

        {/* 钻石切割锄头头部 */}
        <path
          d="M36 8 L56 8 L58 10 L58 18 L56 20 L36 20 L34 18 L34 10 Z"
          fill="url(#purpleGrad)"
          stroke="#7C3AED"
          strokeWidth="2"
        />

        {/* 钻石侧翼 */}
        <path
          d="M53 10 L61 14 L53 18 Z"
          fill="url(#purpleGrad)"
          stroke="#7C3AED"
          strokeWidth="2"
        />

        {/* 紫水晶柄 */}
        <rect
          x="30"
          y="18"
          width="6"
          height="38"
          rx="3"
          fill="#6B21A8"
          stroke="#581C87"
          strokeWidth="1.5"
          transform="rotate(-15 33 37)"
        />

        {/* 钻石切面高光 */}
        <polygon points="38,11 42,14 38,17" fill="#F3E8FF" opacity="0.7" />
        <rect x="48" y="12" width="3" height="4" fill="#F3E8FF" opacity="0.5" />
      </svg>
    );
  }

  // 等级5: 黄金锄头(金色+发光效果)
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={baseClass}
    >
      {/* 黄金渐变定义 */}
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="30%" stopColor="#FFC107" />
          <stop offset="60%" stopColor="#F4B93E" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
        <radialGradient id="goldGlow">
          <stop offset="0%" stopColor="#FFFBEA" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FFD700" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#F4B93E" stopOpacity="0" />
        </radialGradient>

        {/* 闪光效果 */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 强烈光晕 */}
      <circle cx="46" cy="15" r="18" fill="url(#goldGlow)" opacity="0.7" />

      {/* 黄金锄头主体 */}
      <path
        d="M35 7 L57 7 L60 10 L60 20 L57 23 L35 23 L32 20 L32 10 Z"
        fill="url(#goldGrad)"
        stroke="#B8860B"
        strokeWidth="2.5"
        filter="url(#glow)"
      />

      {/* 黄金侧翼 - 更大更华丽 */}
      <path
        d="M54 9 L63 15 L54 21 Z"
        fill="url(#goldGrad)"
        stroke="#B8860B"
        strokeWidth="2.5"
        filter="url(#glow)"
      />

      {/* 黄金柄 - 有纹理 */}
      <rect
        x="30"
        y="20"
        width="7"
        height="36"
        rx="3.5"
        fill="url(#goldGrad)"
        stroke="#B8860B"
        strokeWidth="2"
        transform="rotate(-15 33.5 38)"
        filter="url(#glow)"
      />

      {/* 装饰宝石 */}
      <circle cx="45" cy="15" r="3" fill="#FF4500" stroke="#FFD700" strokeWidth="1.5" />
      <circle cx="52" cy="15" r="2" fill="#00CED1" stroke="#FFD700" strokeWidth="1" />

      {/* 黄金雕刻纹理 */}
      <line x1="38" y1="12" x2="38" y2="18" stroke="#FFE999" strokeWidth="1.5" opacity="0.8" />
      <line x1="42" y1="12" x2="42" y2="18" stroke="#FFE999" strokeWidth="1.5" opacity="0.8" />
      <line x1="50" y1="12" x2="50" y2="18" stroke="#FFE999" strokeWidth="1.5" opacity="0.8" />

      {/* 高光闪烁点 */}
      <circle cx="36" cy="10" r="1.5" fill="#FFFBEA" opacity="0.9">
        <animate
          attributeName="opacity"
          values="0.9;0.3;0.9"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="55" cy="12" r="2" fill="#FFFBEA" opacity="0.8">
        <animate
          attributeName="opacity"
          values="0.8;0.2;0.8"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </circle>

      {/* 星星闪光装饰 */}
      <g opacity="0.9">
        <path
          d="M 28 12 L 29 14 L 31 14 L 29.5 15.5 L 30 17.5 L 28 16 L 26 17.5 L 26.5 15.5 L 25 14 L 27 14 Z"
          fill="#FFD700"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 28 14.5"
            to="360 28 14.5"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </svg>
  );
}

/**
 * 获取等级对应的颜色类名
 */
export function getLevelColorClass(level: number): string {
  switch (level) {
    case 1: return 'text-gray-500';
    case 2: return 'text-green-500';
    case 3: return 'text-blue-500';
    case 4: return 'text-purple-500';
    case 5: return 'text-zama-gold-500';
    default: return 'text-gray-500';
  }
}

/**
 * 获取等级对应的渐变类名
 */
export function getLevelGradientClass(level: number): string {
  switch (level) {
    case 1: return 'from-gray-400 to-gray-600';
    case 2: return 'from-green-400 to-green-600';
    case 3: return 'from-blue-400 to-blue-600';
    case 4: return 'from-purple-400 to-purple-600';
    case 5: return 'from-zama-gold-400 via-zama-gold-500 to-zama-gold-600';
    default: return 'from-gray-400 to-gray-600';
  }
}
