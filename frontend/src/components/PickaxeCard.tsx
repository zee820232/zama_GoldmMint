import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Hammer, Zap, Shield, Sparkles, Battery } from 'lucide-react';
import { calculateDurabilityPercent, getDurabilityColor } from '@/utils/helpers';
import type { PickaxeAttributes } from '@/types';

interface PickaxeCardProps {
  tokenId: bigint;
  attributes: PickaxeAttributes;
  onMine?: () => void;
  onRepair?: () => void;
  mining?: boolean;
}

export function PickaxeCard({ tokenId, attributes, onMine, onRepair, mining }: PickaxeCardProps) {
  const [isShaking, setIsShaking] = useState(false);

  const durabilityPercent = calculateDurabilityPercent(
    attributes.durability,
    attributes.durabilityMax
  );

  const durabilityColor = getDurabilityColor(durabilityPercent);

  // 获取等级对应的颜色和样式
  const getLevelStyles = (level: number) => {
    switch (level) {
      case 1:
        return {
          gradient: 'from-gray-400 to-gray-600',
          text: 'text-gray-600',
          border: 'border-gray-400',
          shadow: 'shadow-gray-400/50',
          glow: 'text-gray-400',
          rarityClass: 'rarity-common',
          cardVariant: 'tech' as const,
        };
      case 2:
        return {
          gradient: 'from-green-400 to-green-600',
          text: 'text-green-600',
          border: 'border-green-400',
          shadow: 'shadow-green-400/50',
          glow: 'text-green-400',
          rarityClass: 'rarity-uncommon',
          cardVariant: 'tech' as const,
        };
      case 3:
        return {
          gradient: 'from-blue-400 to-blue-600',
          text: 'text-blue-600',
          border: 'border-blue-400',
          shadow: 'shadow-blue-400/50',
          glow: 'text-blue-400',
          rarityClass: 'rarity-rare',
          cardVariant: 'tech' as const,
        };
      case 4:
        return {
          gradient: 'from-purple-400 to-purple-600',
          text: 'text-purple-600',
          border: 'border-purple-400',
          shadow: 'shadow-purple-400/50',
          glow: 'text-purple-400',
          rarityClass: 'rarity-epic',
          cardVariant: 'hologram' as const,
        };
      case 5:
        return {
          gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
          text: 'text-yellow-600',
          border: 'border-yellow-400',
          shadow: 'shadow-yellow-400/50',
          glow: 'text-yellow-400',
          rarityClass: 'rarity-legendary',
          cardVariant: 'hologram' as const,
        };
      default:
        return {
          gradient: 'from-gray-400 to-gray-600',
          text: 'text-gray-600',
          border: 'border-gray-400',
          shadow: 'shadow-gray-400/50',
          glow: 'text-gray-400',
          rarityClass: 'rarity-common',
          cardVariant: 'tech' as const,
        };
    }
  };

  const levelStyles = getLevelStyles(attributes.level);

  const handleMineClick = () => {
    if (onMine) {
      setIsShaking(true);
      onMine();
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  return (
    <Card
      variant={levelStyles.cardVariant}
      hover3d
      className={`
        relative overflow-hidden
        border-2 ${levelStyles.border}
        hover:shadow-2xl ${levelStyles.shadow}
        transition-all duration-300
        ${isShaking ? 'animate-miningShake' : ''}
        ${mining ? 'animate-miningPulse' : ''}
        shine-effect
        ${attributes.level >= 4 ? 'animate-techPulse' : ''}
      `}
    >
      {/* 背景装饰光效 */}
      <div className={`
        absolute -top-20 -right-20 w-40 h-40 rounded-full
        bg-gradient-to-br ${levelStyles.gradient}
        opacity-20 blur-3xl
        ${attributes.level >= 4 ? 'animate-glow' : ''}
      `} />

      <CardHeader>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className={`
              p-2 rounded-lg
              bg-gradient-to-br ${levelStyles.gradient}
              ${mining ? 'animate-mining' : ''}
              shadow-lg
            `}>
              <Hammer className="w-6 h-6 text-white" />
            </div>
            <CardTitle className={`text-xl ${levelStyles.text}`}>
              锄头 #{tokenId.toString()}
            </CardTitle>
          </div>
          <span className={`
            px-3 py-1 rounded-full text-sm font-bold
            bg-gradient-to-r ${levelStyles.gradient}
            text-white shadow-lg
            ${attributes.level >= 4 ? 'animate-glowPulse' : ''}
          `}>
            Lv.{attributes.level}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        {/* 属性列表 */}
        <div className="space-y-4">
          {/* 耐久 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-300">耐久</span>
              </div>
              <span className={`text-sm font-bold ${durabilityColor}`}>
                {attributes.durability}/{attributes.durabilityMax}
              </span>
            </div>
            <div className="relative w-full bg-gray-800 rounded-full h-3 overflow-hidden shadow-inner">
              {/* 进度条背景 */}
              <div className="absolute inset-0 bg-gray-700 rounded-full" />
              {/* 进度条 */}
              <div
                className={`
                  h-3 rounded-full transition-all duration-500 relative
                  ${durabilityPercent > 60
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : durabilityPercent > 30
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                    : 'bg-gradient-to-r from-red-400 to-red-600'
                  }
                  ${durabilityPercent > 60 ? 'shadow-glow-sm shadow-green-400' : ''}
                `}
                style={{ width: `${durabilityPercent}%` }}
              >
                {/* 闪光效果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent
                              animate-shimmer" />
                {/* 能量流动效果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                              animate-energyFlow" />
              </div>
            </div>
          </div>

          {/* 效率 */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-900/30 to-cyan-900/30
                         rounded-lg border border-blue-500/30">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">效率加成</span>
            </div>
            <span className="text-lg font-bold text-blue-400">
              +{attributes.efficiency}%
            </span>
          </div>

          {/* 幸运值(加密) */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30
                         rounded-lg border border-purple-500/30">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400 animate-glowPulse" />
              <span className="text-sm font-medium text-gray-300">幸运值</span>
            </div>
            <span className="text-xs font-semibold text-purple-400 italic flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              FHE 加密
            </span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 mt-6">
          <Button
            variant={attributes.level >= 4 ? 'gold' : 'primary'}
            className="flex-1"
            onClick={handleMineClick}
            disabled={attributes.durability < 10 || mining}
            loading={mining}
            glow={attributes.level >= 5}
          >
            {mining ? (
              <>
                <Hammer className="w-4 h-4 mr-1 animate-mining" />
                挖矿中...
              </>
            ) : (
              <>
                <Hammer className="w-4 h-4 mr-1" />
                开始挖矿
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={onRepair}
            disabled={attributes.durability === attributes.durabilityMax}
            className="whitespace-nowrap"
          >
            修复
          </Button>
        </div>

        {/* 警告提示 */}
        {attributes.durability < 10 && (
          <div className="mt-3 p-3 bg-red-900/50 border-2 border-red-500/50 rounded-lg animate-pulse">
            <p className="text-xs text-red-300 text-center font-semibold flex items-center justify-center gap-1">
              <span className="text-base">⚠️</span>
              耐久不足,请先修复
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}