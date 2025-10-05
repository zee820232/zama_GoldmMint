import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { usePlayerPickaxes, usePickaxeAttributes } from '@/hooks/usePickaxe';
import { usePlayerStats } from '@/hooks/useMining';
import { PickaxeCard } from '@/components/PickaxeCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import { getContractAddresses } from '@/contracts/addresses';
import { MINING_ENGINE_ABI } from '@/contracts/abis';
import { formatTimestamp } from '@/utils/helpers';
import { Hammer, TrendingUp } from 'lucide-react';
import { useChainId } from 'wagmi';

export function MinePage() {
  const { address } = useAccount();
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const [miningPickaxe, setMiningPickaxe] = useState<bigint | null>(null);

  // 查询玩家的锄头列表
  const { data: pickaxes, isLoading: pickaxesLoading } = usePlayerPickaxes(address);

  // 查询玩家统计
  const { data: stats } = usePlayerStats(address);

  // 挖矿交易
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isMining, isSuccess } = useWaitForTransactionReceipt({ hash });

  // 处理挖矿
  const handleMine = async (pickaxeId: bigint) => {
    if (!address) return;

    try {
      setMiningPickaxe(pickaxeId);

      writeContract({
        address: addresses.miningEngine,
        abi: MINING_ENGINE_ABI,
        functionName: 'mine',
        args: [pickaxeId],
      });
    } catch (error) {
      console.error('挖矿失败:', error);
      setMiningPickaxe(null);
    }
  };

  // 挖矿成功后重置状态
  if (isSuccess && miningPickaxe) {
    setTimeout(() => setMiningPickaxe(null), 1000);
  }

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Hammer className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">请先连接钱包</h2>
        <p className="text-gray-600">连接钱包后即可开始挖矿</p>
      </div>
    );
  }

  if (pickaxesLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" />
        <p className="text-gray-600 mt-4">加载中...</p>
      </div>
    );
  }

  if (!pickaxes || (pickaxes as bigint[]).length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Hammer className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">您还没有锄头</h2>
        <p className="text-gray-600 mb-6">前往铸造页面获取您的第一把锄头</p>
        <Button onClick={() => window.location.href = '/mint'}>
          去铸造锄头
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">⛏️ 挖矿</h1>
        <p className="text-gray-600">选择锄头开始挖矿,获取加密奖励</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 左侧: 统计信息 */}
        <div className="lg:col-span-1">
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <CardTitle className="text-lg">挖矿统计</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">总挖矿次数</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats && (stats as [bigint, bigint])[0] !== undefined ? (stats as [bigint, bigint])[0].toString() : '0'}
                  </p>
                </div>

                {stats && (stats as [bigint, bigint])[1] && (stats as [bigint, bigint])[1] > 0n ? (
                  <div>
                    <p className="text-sm text-gray-600">上次挖矿时间</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatTimestamp((stats as [bigint, bigint])[1])}
                    </p>
                  </div>
                ) : null}

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-2">💡 提示</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• 每次挖矿消耗 10 耐久</li>
                    <li>• 收益加密存储,需重加密查看</li>
                    <li>• 史诗掉落可获得稀有物品</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧: 锄头列表 */}
        <div className="lg:col-span-2">
          <div className="grid md:grid-cols-2 gap-6">
            {(pickaxes as bigint[]).map((tokenId: bigint) => (
              <PickaxeCardWithData
                key={tokenId.toString()}
                tokenId={tokenId}
                onMine={handleMine}
                mining={miningPickaxe === tokenId && isMining}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 带数据的锄头卡片组件
function PickaxeCardWithData({
  tokenId,
  onMine,
  mining,
}: {
  tokenId: bigint;
  onMine: (id: bigint) => void;
  mining: boolean;
}) {
  const { data: attributes } = usePickaxeAttributes(tokenId);

  if (!attributes) {
    return <div className="animate-pulse bg-gray-200 rounded-xl h-64" />;
  }

  const [level, durabilityMax, durability, efficiency] = attributes as [bigint, bigint, bigint, bigint];

  return (
    <PickaxeCard
      tokenId={tokenId}
      attributes={{
        level: Number(level),
        durabilityMax: Number(durabilityMax),
        durability: Number(durability),
        efficiency: Number(efficiency),
      }}
      onMine={() => onMine(tokenId)}
      mining={mining}
    />
  );
}
