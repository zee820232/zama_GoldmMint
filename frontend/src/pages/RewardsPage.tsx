import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { usePlayerEarnings, usePlayerEpicDrops, usePlayerStats } from '@/hooks/useMining';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import { getContractAddresses } from '@/contracts/addresses';
import { MINING_ENGINE_ABI } from '@/contracts/abis';
import { formatTimestamp } from '@/utils/helpers';
import { Coins, Gift, TrendingUp, Lock } from 'lucide-react';
import { useChainId } from 'wagmi';
import { parseEther } from 'viem';

export function RewardsPage() {
  const { address } = useAccount();
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const [claimAmount, setClaimAmount] = useState('');
  const [treasureCount, setTreasureCount] = useState('');

  // 查询加密收益和掉落
  const { data: encryptedEarnings } = usePlayerEarnings(address);
  const { data: encryptedDrops } = usePlayerEpicDrops(address);
  const { data: stats } = usePlayerStats(address);

  // 领取金币交易
  const { writeContract: claimGold, data: goldHash, isPending: isClaimingGold } = useWriteContract();
  const { isLoading: isGoldPending, isSuccess: isGoldSuccess } = useWaitForTransactionReceipt({ hash: goldHash });

  // 领取稀有物品交易
  const { writeContract: claimTreasure, data: treasureHash, isPending: isClaimingTreasure } = useWriteContract();
  const { isLoading: isTreasurePending, isSuccess: isTreasureSuccess } = useWaitForTransactionReceipt({ hash: treasureHash });

  // 处理领取金币
  const handleClaimGold = () => {
    if (!claimAmount || !address) return;

    try {
      const amount = parseEther(claimAmount);

      claimGold({
        address: addresses.miningEngine,
        abi: MINING_ENGINE_ABI,
        functionName: 'claimRewards',
        args: [amount],
      });
    } catch (error) {
      console.error('领取失败:', error);
    }
  };

  // 处理领取稀有物品
  const handleClaimTreasure = () => {
    if (!treasureCount || !address) return;

    const count = parseInt(treasureCount);
    if (isNaN(count) || count <= 0) return;

    claimTreasure({
      address: addresses.miningEngine,
      abi: MINING_ENGINE_ABI,
      functionName: 'claimTreasure',
      args: [BigInt(count)],
    });
  };

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Coins className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">请先连接钱包</h2>
        <p className="text-gray-600">连接钱包后查看和领取奖励</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">💰 奖励中心</h1>
        <p className="text-gray-600">查看您的加密收益并领取奖励</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 左侧: 统计信息 */}
        <div className="lg:col-span-1 space-y-6">
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
                    <p className="text-sm text-gray-600">上次挖矿</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatTimestamp((stats as [bigint, bigint])[1])}
                    </p>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardContent>
              <div className="text-center py-6">
                <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-2">
                  您的收益已加密保护
                </p>
                <p className="text-xs text-gray-500">
                  使用 FHE 全同态加密技术,只有您能查看真实数据
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧: 领取区域 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 成功提示 */}
          {isGoldSuccess && (
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                ✅ GOLD 代币领取成功!
              </p>
            </div>
          )}

          {isTreasureSuccess && (
            <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
              <p className="text-purple-800 font-medium">
                ✅ 稀有物品领取成功!请前往背包查看
              </p>
            </div>
          )}

          {/* 领取 GOLD 代币 */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-600" />
                <CardTitle>领取 GOLD 代币</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">加密收益</span>
                    <span className="text-xs text-gray-500 italic">[需重加密查看]</span>
                  </div>
                  <p className="text-sm font-mono text-gray-400">
                    {encryptedEarnings ? '0x...' + encryptedEarnings.toString().slice(-8) : '0x...'}
                  </p>
                </div>

                <div className="border-2 border-dashed border-yellow-300 bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800 mb-3">
                    <strong>简化方案说明:</strong>
                  </p>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    <li>1. 通过前端重加密查看您的真实收益(需 fhevmjs 实现)</li>
                    <li>2. 在下方输入要领取的金额</li>
                    <li>3. 合约会验证余额是否足够(加密验证)</li>
                    <li>4. 如果余额不足,交易会自动回滚</li>
                  </ul>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    领取金额 (GOLD)
                  </label>
                  <input
                    type="number"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    placeholder="输入要领取的金额"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    min="0"
                    step="0.01"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    示例: 100 (领取 100 GOLD 代币)
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleClaimGold}
                  loading={isClaimingGold || isGoldPending}
                  disabled={!claimAmount || isClaimingGold || isGoldPending}
                >
                  {isClaimingGold || isGoldPending ? '领取中...' : '领取 GOLD'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 领取稀有物品 */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-600" />
                <CardTitle>领取稀有物品</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">史诗掉落计数</span>
                    <span className="text-xs text-gray-500 italic">[需重加密查看]</span>
                  </div>
                  <p className="text-sm font-mono text-gray-400">
                    {encryptedDrops ? '0x...' + encryptedDrops.toString().slice(-8) : '0x...'}
                  </p>
                </div>

                <div className="border-2 border-dashed border-purple-300 bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-800 mb-3">
                    <strong>稀有物品说明:</strong>
                  </p>
                  <ul className="text-xs text-purple-700 space-y-1">
                    <li>• 挖矿时获得史诗掉落会累加计数(加密)</li>
                    <li>• 通过重加密查看您的史诗掉落次数</li>
                    <li>• 每次领取会随机铸造一个稀有物品</li>
                    <li>• 物品种类: 幸运符、耐久药剂、稀有皮肤、史诗宝箱、黄金加速器</li>
                  </ul>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    领取数量
                  </label>
                  <input
                    type="number"
                    value={treasureCount}
                    onChange={(e) => setTreasureCount(e.target.value)}
                    placeholder="输入要领取的数量"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    min="1"
                    step="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    示例: 1 (领取 1 个稀有物品)
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleClaimTreasure}
                  loading={isClaimingTreasure || isTreasurePending}
                  disabled={!treasureCount || isClaimingTreasure || isTreasurePending}
                >
                  {isClaimingTreasure || isTreasurePending ? '领取中...' : '领取稀有物品'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 提示信息 */}
          <Card variant="bordered">
            <CardContent>
              <div className="text-sm text-gray-600 space-y-2">
                <p className="font-semibold text-gray-900">⚠️ 重要提示</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>当前为简化版实现,完整版需要集成 Zama Gateway</li>
                  <li>重加密功能需要在前端实现 fhevmjs 完整流程</li>
                  <li>如果输入金额/数量超过实际值,交易会自动回滚</li>
                  <li>领取成功后,加密余额会自动扣除</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
