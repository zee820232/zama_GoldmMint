import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { usePickaxeLevelConfig } from '@/hooks/usePickaxe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import { getContractAddresses } from '@/contracts/addresses';
import { PICKAXE_NFT_ABI } from '@/contracts/abis';
import { formatBigInt } from '@/utils/helpers';
import { Hammer, Zap, Shield, Star, Battery, Cpu } from 'lucide-react';
import { useChainId } from 'wagmi';
import { parseEther } from 'viem';

const LEVELS = [1, 2, 3, 4, 5];

// 模拟数据 - 当合约未部署时使用
const MOCK_LEVEL_CONFIGS = {
  1: [parseEther('0.01'), 1000n, 10n, 20n, 5n, 15n] as const,
  2: [parseEther('0.05'), 2000n, 20n, 40n, 10n, 30n] as const,
  3: [parseEther('0.1'), 3000n, 40n, 60n, 20n, 50n] as const,
  4: [parseEther('0.2'), 5000n, 60n, 100n, 40n, 80n] as const,
  5: [parseEther('0.5'), 10000n, 100n, 200n, 80n, 150n] as const,
};

export function MintPage() {
  const { address } = useAccount();
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const [selectedLevel, setSelectedLevel] = useState(1);

  // 铸造交易
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isMinting, isSuccess } = useWaitForTransactionReceipt({ hash });

  // 处理铸造
  const handleMint = async (level: number, price: bigint) => {
    if (!address) return;

    writeContract({
      address: addresses.pickaxeNFT,
      abi: PICKAXE_NFT_ABI,
      functionName: 'mintPickaxe',
      args: [level],
      value: price,
    });
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zama-dark-900 via-zama-dark-700 to-zama-dark-900 relative overflow-hidden">
        {/* 科技感背景网格 */}
        <div className="absolute inset-0 bg-tech-grid-gold opacity-20" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-zama-gold-500/10 rounded-full blur-3xl animate-goldPulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-zama-orange/10 rounded-full blur-3xl animate-goldPulse animation-delay-300" />

        <div className="container mx-auto px-4 py-20 text-center relative z-10 animate-fadeIn">
          <Hammer className="w-24 h-24 text-zama-gold-400 mx-auto mb-6 animate-goldFloat" />
          <h2 className="text-4xl font-bold text-white mb-4">请先连接钱包</h2>
          <p className="text-xl text-gray-300 mb-8">连接钱包后即可铸造您的专属锄头 NFT</p>

          {/* 示例卡片预览 */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-zama-gold-400 mb-8">5 种等级锄头</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((level, index) => {
                const colors = [
                  'from-gray-400 to-gray-600',
                  'from-green-400 to-green-600',
                  'from-blue-400 to-blue-600',
                  'from-purple-400 to-purple-600',
                  'from-zama-gold-400 to-zama-gold-600'
                ];
                const names = ['普通', '优良', '稀有', '史诗', '传说'];
                return (
                  <div
                    key={level}
                    className="animate-scaleIn bg-zama-dark-800/50 backdrop-blur-md rounded-xl p-4 border-2 border-zama-gold-500/30"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-lg bg-gradient-to-br ${colors[index]}
                                   ${level === 5 ? 'animate-goldPulse shadow-gold-glow' : ''}
                                   flex items-center justify-center shadow-lg`}>
                      <Hammer className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-white font-bold">等级 {level}</div>
                    <div className="text-sm text-gray-400">{names[index]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zama-dark-900 via-zama-dark-700 to-zama-dark-900 relative overflow-hidden">
      {/* 科技感背景网格 */}
      <div className="absolute inset-0 bg-tech-grid-gold opacity-20" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-zama-gold-500/10 rounded-full blur-3xl animate-goldPulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-zama-orange/10 rounded-full blur-3xl animate-goldPulse animation-delay-300" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* 标题区域 - 带动画 */}
        <div className="mb-12 text-center animate-fadeIn">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Hammer className="w-12 h-12 text-zama-gold-400 animate-goldFloat" />
            铸造锄头
          </h1>
          <p className="text-xl text-gray-300">选择等级并支付 ETH 铸造您的专属锄头 NFT</p>
          <div className="mt-4 inline-block px-6 py-2 bg-zama-dark-800/50 backdrop-blur-md rounded-full border border-zama-gold-500/30">
            <p className="text-sm text-zama-gold-300">
              等级越高,收益越好,稀有掉落概率越高
            </p>
          </div>
        </div>

        {/* 成功提示 - 带庆祝动画 */}
        {isSuccess && (
          <div className="mb-8 p-6 bg-gradient-to-r from-zama-gold-500/20 to-zama-amber/20 rounded-2xl shadow-2xl
                         animate-celebrate border-2 border-zama-gold-500/50 backdrop-blur-sm">
            <p className="text-white font-bold text-lg text-center flex items-center justify-center gap-2">
              <span className="text-2xl animate-bounce">✨</span>
              铸造成功!请前往挖矿页面使用您的新锄头
              <span className="text-2xl animate-bounce animation-delay-200">🎉</span>
            </p>
          </div>
        )}

        {/* 卡片网格 - 带交错动画 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {LEVELS.map((level, index) => (
            <div
              key={level}
              className="animate-scaleIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <LevelCard
                level={level}
                selected={selectedLevel === level}
                onSelect={() => setSelectedLevel(level)}
                onMint={handleMint}
                minting={isMinting && selectedLevel === level}
              />
            </div>
          ))}
        </div>

      <div className="mt-12 max-w-4xl mx-auto animate-fadeIn animation-delay-500">
        <Card variant="tech" className="border-2 border-zama-gold-500/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Cpu className="w-6 h-6 text-zama-gold-400" />
              铸造说明
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 text-sm text-gray-300">
              <div className="p-4 bg-zama-dark-800/50 rounded-xl border border-zama-gold-500/30">
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-zama-gold-400" />
                  锄头属性
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-zama-gold-400 font-bold">•</span>
                    <span><strong className="text-white">等级</strong>: 影响史诗掉落概率(等级越高概率越高)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-zama-gold-400 font-bold">•</span>
                    <span><strong className="text-white">耐久</strong>: 每次挖矿消耗 10 耐久,耐久为 0 无法挖矿</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-zama-gold-400 font-bold">•</span>
                    <span><strong className="text-white">效率</strong>: 增加挖矿收益百分比</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-zama-gold-400 font-bold">•</span>
                    <span><strong className="text-white">幸运值</strong>: 加密属性,额外增加收益</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/30">
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-400 animate-glowPulse" />
                  稀有掉落概率
                </h4>
                <div className="grid grid-cols-5 gap-3 text-center">
                  {[
                    { level: 1, prob: '1%', color: 'from-gray-400 to-gray-600' },
                    { level: 2, prob: '3%', color: 'from-green-400 to-green-600' },
                    { level: 3, prob: '5%', color: 'from-blue-400 to-blue-600' },
                    { level: 4, prob: '10%', color: 'from-purple-400 to-purple-600' },
                    { level: 5, prob: '20%', color: 'from-zama-gold-400 to-zama-gold-600' },
                  ].map((item) => (
                    <div
                      key={item.level}
                      className={`p-3 rounded-lg bg-gradient-to-br ${item.color} text-white shadow-lg
                                ${item.level === 5 ? 'animate-goldPulse shadow-gold-glow' : ''}`}
                    >
                      <div className="font-bold text-lg">Lv.{item.level}</div>
                      <div className="text-sm mt-1">{item.prob} 史诗</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-zama-dark-800/50 rounded-xl border border-zama-gold-500/30">
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  注意事项
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-zama-gold-400 font-bold">•</span>
                    <span>每个锄头都是独特的 NFT,拥有随机的幸运值</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-zama-gold-400 font-bold">•</span>
                    <span>高等级锄头价格更贵,但收益和掉落更好</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-zama-gold-400 font-bold">•</span>
                    <span>修复耐久需要消耗 GOLD 代币(30% 燃烧)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-zama-gold-400 font-bold">•</span>
                    <span>所有关键属性使用 FHE 加密,只有您能查看</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}

// 等级卡片组件
function LevelCard({
  level,
  selected,
  onSelect,
  onMint,
  minting,
}: {
  level: number;
  selected: boolean;
  onSelect: () => void;
  onMint: (level: number, price: bigint) => void;
  minting: boolean;
}) {
  const { data: config, isLoading } = usePickaxeLevelConfig(level);

  // 使用合约数据或模拟数据
  const actualConfig = config || MOCK_LEVEL_CONFIGS[level as keyof typeof MOCK_LEVEL_CONFIGS];
  const usingMockData = !config;

  if (isLoading) {
    return (
      <div className="animate-pulse bg-gradient-to-br from-zama-dark-800 to-zama-dark-900 rounded-2xl h-96
                     border-2 border-zama-gold-500/30" />
    );
  }

  const [price, durabilityMax, efficiencyMin, efficiencyMax, luckMin, luckMax] = actualConfig;

  const getLevelColor = (lvl: number) => {
    switch (lvl) {
      case 1: return 'from-gray-400 to-gray-600';
      case 2: return 'from-green-400 to-green-600';
      case 3: return 'from-blue-400 to-blue-600';
      case 4: return 'from-purple-400 to-purple-600';
      case 5: return 'from-zama-gold-400 via-zama-gold-500 to-zama-gold-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getLevelName = (lvl: number) => {
    switch (lvl) {
      case 1: return '普通';
      case 2: return '优良';
      case 3: return '稀有';
      case 4: return '史诗';
      case 5: return '传说';
      default: return '未知';
    }
  };

  const getLevelBorderColor = (lvl: number) => {
    switch (lvl) {
      case 1: return 'border-gray-500';
      case 2: return 'border-green-500';
      case 3: return 'border-blue-500';
      case 4: return 'border-purple-500';
      case 5: return 'border-zama-gold-500';
      default: return 'border-gray-500';
    }
  };

  const getCardVariant = (lvl: number) => {
    return lvl >= 4 ? 'hologram' : 'tech';
  };

  const gradientColor = getLevelColor(level);
  const borderColor = getLevelBorderColor(level);
  const cardVariant = getCardVariant(level);

  return (
    <div
      onClick={onSelect}
      className={`
        relative cursor-pointer transition-all duration-300 ease-out
        ${selected ? 'scale-105 z-10' : 'hover:scale-102'}
        group
      `}
    >
      <Card
        variant={cardVariant}
        hover3d
        className={`
          border-2 ${borderColor}
          ${selected
            ? `ring-4 ring-offset-2 ring-offset-zama-dark-900 shadow-2xl ${
                level === 5 ? 'ring-zama-gold-400 animate-goldPulse shadow-gold-intense' : 'ring-current'
              }`
            : 'hover:shadow-2xl'
          }
          ${level >= 4 ? 'shine-effect' : ''}
          relative overflow-hidden
          ${level >= 4 ? 'animate-techPulse' : ''}
        `}
      >
        {/* 模拟数据提示 */}
        {usingMockData && (
          <div className="absolute top-2 left-2 z-20">
            <div className="px-2 py-1 bg-zama-orange/80 rounded text-xs text-white font-bold">
              演示数据
            </div>
          </div>
        )}

        {/* 背景装饰光效 */}
        <div className={`
          absolute -top-16 -right-16 w-32 h-32 rounded-full
          bg-gradient-to-br ${gradientColor}
          opacity-20 blur-2xl
          ${level >= 4 ? 'animate-glow' : ''}
          ${selected ? 'opacity-30' : ''}
        `} />

        {/* 选中指示器 */}
        {selected && (
          <div className="absolute top-3 right-3 z-10">
            <div className={`
              w-6 h-6 rounded-full
              bg-gradient-to-br ${gradientColor}
              flex items-center justify-center
              shadow-lg animate-scaleIn
            `}>
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          </div>
        )}

        <CardContent className="relative z-10">
          {/* 等级标识 */}
          <div className="text-center mb-6">
            <div className={`
              inline-block p-6 rounded-2xl
              bg-gradient-to-br ${gradientColor}
              shadow-2xl
              ${minting ? 'animate-mining' : 'group-hover:scale-110'}
              ${level >= 5 ? 'animate-goldPulse shadow-gold-glow' : ''}
              transition-transform duration-300
            `}>
              <Hammer className="w-14 h-14 text-white drop-shadow-lg" />
            </div>
            <h3 className="text-3xl font-bold mt-4 text-white">等级 {level}</h3>
            <span className={`
              inline-block mt-2 px-4 py-1 rounded-full text-sm font-bold
              bg-gradient-to-r ${gradientColor}
              text-white shadow-lg
            `}>
              {getLevelName(level)}
            </span>
          </div>

          {/* 属性列表 */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between p-2 bg-zama-dark-800/50 rounded-lg
                          border border-zama-gold-500/30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4 text-zama-gold-400" />
                <span className="text-sm text-gray-300">耐久</span>
              </div>
              <span className="text-sm font-bold text-white">{Number(durabilityMax)}</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-zama-dark-800/50 rounded-lg
                          border border-zama-gold-500/30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-zama-gold-400" />
                <span className="text-sm text-gray-300">效率</span>
              </div>
              <span className="text-sm font-bold text-white">
                {Number(efficiencyMin)}-{Number(efficiencyMax)}%
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-gradient-to-r from-purple-900/30 to-pink-900/30
                          rounded-lg border border-purple-500/30">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-sm text-gray-300">幸运</span>
              </div>
              <span className="text-xs font-semibold text-purple-300 italic">
                {Number(luckMin)}-{Number(luckMax)} 🔒
              </span>
            </div>
          </div>

          {/* 价格 */}
          <div className="mb-4 p-3 bg-gradient-to-r from-zama-dark-800/50 to-zama-dark-700/50
                        rounded-xl border border-zama-gold-500/30">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-medium">价格</span>
              <span className="text-2xl font-bold text-white flex items-center gap-1">
                {formatBigInt(price, 18)}
                <span className="text-sm text-gray-400">ETH</span>
              </span>
            </div>
          </div>

          {/* 铸造按钮 */}
          <Button
            variant={level >= 4 ? 'gold' : 'primary'}
            size="lg"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onMint(level, price);
            }}
            loading={minting}
            disabled={minting || usingMockData}
            glow={level >= 5}
          >
            {minting ? (
              <>
                <Hammer className="w-4 h-4 mr-1 animate-spin" />
                铸造中...
              </>
            ) : usingMockData ? (
              <>
                <Hammer className="w-4 h-4 mr-1" />
                请连接正确网络
              </>
            ) : (
              <>
                <Hammer className="w-4 h-4 mr-1" />
                立即铸造
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
