import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { usePlayerPickaxes, usePickaxeAttributes } from '@/hooks/usePickaxe';
import { usePlayerStats } from '@/hooks/useMining';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import { getContractAddresses } from '@/contracts/addresses';
import { MINING_ENGINE_ABI } from '@/contracts/abis';
import { formatTimestamp } from '@/utils/helpers';
import { Hammer, Zap, Shield, Lock, Sparkles, Cpu, TrendingUp, Battery } from 'lucide-react';
import { useChainId } from 'wagmi';

export function MinePage() {
  const { address } = useAccount();
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const [selectedPickaxe, setSelectedPickaxe] = useState<bigint | null>(null);
  const [miningCount, setMiningCount] = useState(1); // 挖矿次数

  // 查询玩家的锄头列表
  const { data: pickaxes, isLoading: pickaxesLoading } = usePlayerPickaxes(address);

  // 查询玩家统计
  const { data: stats } = usePlayerStats(address);

  // 挖矿交易
  const { writeContract, data: hash, error: writeError } = useWriteContract();
  const { isLoading: isMining, isSuccess } = useWaitForTransactionReceipt({ hash });

  // 监听错误
  useEffect(() => {
    if (writeError) {
      console.error('❌ 挖矿错误:', writeError);
      alert(`挖矿失败: ${writeError.message}`);
    }
  }, [writeError]);

  // 处理挖矿
  const handleMine = async () => {
    if (!address || !selectedPickaxe) return;

    try {
      console.log('⛏️ 开始挖矿...', { pickaxeId: selectedPickaxe.toString(), count: miningCount });

      writeContract({
        address: addresses.miningEngine,
        abi: MINING_ENGINE_ABI,
        functionName: 'mine',
        args: [selectedPickaxe],
      });
    } catch (error) {
      console.error('挖矿失败:', error);
    }
  };

  // 挖矿成功后重置
  useEffect(() => {
    if (isSuccess) {
      console.log('✅ 挖矿成功!');
      setTimeout(() => {
        // 可以在这里触发数据刷新
      }, 1000);
    }
  }, [isSuccess]);

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zama-dark-900 via-zama-dark-700 to-zama-dark-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-tech-grid-gold opacity-20" />
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <Cpu className="w-24 h-24 text-zama-gold-400 mx-auto mb-6 animate-goldFloat" />
          <h2 className="text-4xl font-bold text-white mb-4">请先连接钱包</h2>
          <p className="text-xl text-gray-300">连接钱包后即可开始 FHE 加密挖矿</p>
        </div>
      </div>
    );
  }

  if (pickaxesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zama-dark-900 via-zama-dark-700 to-zama-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-zama-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-lg">加载中...</p>
        </div>
      </div>
    );
  }

  if (!pickaxes || (pickaxes as bigint[]).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zama-dark-900 via-zama-dark-700 to-zama-dark-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-tech-grid-gold opacity-20" />
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <Hammer className="w-24 h-24 text-zama-gold-400 mx-auto mb-6 animate-goldFloat" />
          <h2 className="text-4xl font-bold text-white mb-4">您还没有锄头</h2>
          <p className="text-xl text-gray-300 mb-8">前往铸造页面获取您的第一把 FHE 加密锄头</p>
          <Button
            variant="gold"
            size="lg"
            glow
            onClick={() => window.location.href = '/mint'}
          >
            <Hammer className="w-5 h-5 mr-2" />
            去铸造锄头
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zama-dark-900 via-zama-dark-700 to-zama-dark-900 relative overflow-hidden">
      {/* 科技感背景 */}
      <div className="absolute inset-0 bg-tech-grid-gold opacity-20" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-zama-gold-500/10 rounded-full blur-3xl animate-goldPulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-goldPulse animation-delay-300" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* 标题 */}
        <div className="mb-8 text-center animate-fadeIn">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Cpu className="w-12 h-12 text-zama-gold-400 animate-goldFloat" />
            FHE 加密挖矿
          </h1>
          <p className="text-xl text-gray-300">选择锄头,点击挖矿,获取加密奖励</p>
        </div>

        {/* 成功提示 */}
        {isSuccess && (
          <div className="mb-6 p-6 bg-gradient-to-r from-zama-gold-500/20 to-zama-amber/20 rounded-2xl shadow-2xl
                         animate-celebrate border-2 border-zama-gold-500/50 backdrop-blur-sm">
            <p className="text-white font-bold text-lg text-center flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-zama-gold-400 animate-bounce" />
              挖矿成功!奖励已加密存储
              <Lock className="w-5 h-5 text-purple-400 animate-pulse" />
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧: 统计信息 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 挖矿统计 */}
            <Card variant="tech" className="border-2 border-zama-gold-500/30 backdrop-blur-xl animate-scaleIn">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-zama-gold-400" />
                  <CardTitle className="text-xl text-white">挖矿统计</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-zama-dark-800/50 rounded-xl border border-zama-gold-500/30">
                    <p className="text-sm text-gray-400 mb-1">总挖矿次数</p>
                    <p className="text-3xl font-bold text-zama-gold-400">
                      {stats && (stats as [bigint, bigint])[0] !== undefined ? (stats as [bigint, bigint])[0].toString() : '0'}
                    </p>
                  </div>

                  {stats && (stats as [bigint, bigint])[1] && (stats as [bigint, bigint])[1] > 0n ? (
                    <div className="p-4 bg-zama-dark-800/50 rounded-xl border border-purple-500/30">
                      <p className="text-sm text-gray-400 mb-1">上次挖矿时间</p>
                      <p className="text-sm font-medium text-white">
                        {formatTimestamp((stats as [bigint, bigint])[1])}
                      </p>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            {/* FHE 加密说明 */}
            <Card variant="hologram" className="border-2 border-purple-500/30 backdrop-blur-xl animate-scaleIn animation-delay-100">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-purple-400 animate-pulse" />
                  <CardTitle className="text-xl text-white">FHE 加密</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-300 space-y-3">
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span>挖矿奖励全程加密存储</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-zama-gold-400 mt-0.5 flex-shrink-0" />
                    <span>幸运值影响稀有掉落概率</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-zama-gold-400 mt-0.5 flex-shrink-0" />
                    <span>每次挖矿消耗 10 点耐久</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span>需要重加密才能查看收益</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* 右侧: 挖矿控制面板 */}
          <div className="lg:col-span-2">
            {/* 选择锄头 */}
            <Card variant="tech" className="mb-6 border-2 border-zama-gold-500/30 backdrop-blur-xl animate-scaleIn animation-delay-200">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <Hammer className="w-6 h-6 text-zama-gold-400" />
                  选择锄头
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(pickaxes as bigint[]).map((tokenId: bigint) => (
                    <PickaxeSelectCard
                      key={tokenId.toString()}
                      tokenId={tokenId}
                      selected={selectedPickaxe === tokenId}
                      onSelect={() => setSelectedPickaxe(tokenId)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 挖矿控制 */}
            {selectedPickaxe && (
              <Card
                variant="hologram"
                className="border-2 border-zama-gold-500 backdrop-blur-xl animate-scaleIn shine-effect"
              >
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-2">
                    <Cpu className="w-6 h-6 text-zama-gold-400 animate-goldPulse" />
                    挖矿控制台
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 挖矿次数选择 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      选择挖矿次数
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {[1, 5, 10, 20, 50].map((count) => (
                        <button
                          key={count}
                          onClick={() => setMiningCount(count)}
                          className={`
                            p-3 rounded-xl font-bold transition-all duration-300
                            ${miningCount === count
                              ? 'bg-gradient-to-br from-zama-gold-500 to-zama-gold-600 text-white shadow-gold-glow scale-110'
                              : 'bg-zama-dark-800/50 text-gray-400 border border-zama-gold-500/30 hover:border-zama-gold-500/50 hover:text-white'
                            }
                          `}
                        >
                          {count}次
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 挖矿信息预览 */}
                  <div className="p-4 bg-gradient-to-r from-purple-900/30 to-zama-dark-800/50 rounded-xl border border-purple-500/30">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 mb-1">耐久消耗</p>
                        <p className="text-xl font-bold text-white flex items-center gap-1">
                          <Battery className="w-4 h-4 text-red-400" />
                          {miningCount * 10}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">预计奖励</p>
                        <p className="text-xl font-bold text-zama-gold-400 flex items-center gap-1">
                          <Lock className="w-4 h-4 text-purple-400 animate-pulse" />
                          加密
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 挖矿按钮 */}
                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full text-xl py-6"
                    onClick={handleMine}
                    loading={isMining}
                    disabled={isMining}
                    glow
                  >
                    {isMining ? (
                      <>
                        <Cpu className="w-6 h-6 mr-2 animate-spin" />
                        挖矿中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6 mr-2 animate-goldPulse" />
                        开始挖矿 ({miningCount} 次)
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-400">
                    ⚠️ 每次点击执行一次挖矿,消耗耐久并获得加密奖励
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 锄头选择卡片
function PickaxeSelectCard({
  tokenId,
  selected,
  onSelect,
}: {
  tokenId: bigint;
  selected: boolean;
  onSelect: () => void;
}) {
  const { data: attributes } = usePickaxeAttributes(tokenId);

  if (!attributes) {
    return (
      <div className="animate-pulse bg-zama-dark-800/50 rounded-xl h-40 border-2 border-zama-gold-500/30" />
    );
  }

  const [level, durabilityMax, durability, efficiency] = attributes as [bigint, bigint, bigint, bigint];

  const getLevelColor = (lvl: number) => {
    switch (lvl) {
      case 1: return 'from-gray-400 to-gray-600';
      case 2: return 'from-green-400 to-green-600';
      case 3: return 'from-blue-400 to-blue-600';
      case 4: return 'from-purple-400 to-purple-600';
      case 5: return 'from-zama-gold-400 to-zama-gold-600';
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

  const durabilityPercent = (Number(durability) / Number(durabilityMax)) * 100;
  const canMine = Number(durability) >= 10;

  return (
    <button
      onClick={onSelect}
      className={`
        relative p-4 rounded-xl transition-all duration-300
        ${selected
          ? 'bg-gradient-to-br from-zama-gold-500/20 to-zama-gold-600/20 border-2 border-zama-gold-500 shadow-gold-glow scale-105'
          : 'bg-zama-dark-800/50 border-2 border-zama-gold-500/30 hover:border-zama-gold-500/50'
        }
        ${!canMine ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      disabled={!canMine}
    >
      {/* 选中指示器 */}
      {selected && (
        <div className="absolute top-2 right-2">
          <div className="w-6 h-6 bg-gradient-to-br from-zama-gold-400 to-zama-gold-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <div className={`
          w-12 h-12 rounded-lg bg-gradient-to-br ${getLevelColor(Number(level))}
          flex items-center justify-center shadow-lg
          ${Number(level) >= 5 ? 'animate-goldPulse' : ''}
        `}>
          <Hammer className="w-6 h-6 text-white" />
        </div>
        <div className="text-left">
          <p className="text-white font-bold">#{tokenId.toString()}</p>
          <p className={`text-xs bg-gradient-to-r ${getLevelColor(Number(level))} bg-clip-text text-transparent font-bold`}>
            {getLevelName(Number(level))}
          </p>
        </div>
      </div>

      {/* 耐久度条 */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>耐久</span>
          <span>{Number(durability)}/{Number(durabilityMax)}</span>
        </div>
        <div className="h-2 bg-zama-dark-900 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              durabilityPercent > 50 ? 'bg-green-500' :
              durabilityPercent > 20 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${durabilityPercent}%` }}
          />
        </div>
      </div>

      {/* 效率 */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">效率</span>
        <span className="text-zama-gold-400 font-bold">+{Number(efficiency)}%</span>
      </div>

      {!canMine && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
          <p className="text-white font-bold">耐久不足</p>
        </div>
      )}
    </button>
  );
}
