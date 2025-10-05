import { useAccount, useReadContract } from 'wagmi';
import { usePlayerPickaxes } from '@/hooks/usePickaxe';
import { Card, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { PickaxeCard } from '@/components/PickaxeCard';
import { getContractAddresses } from '@/contracts/addresses';
import { TREASURE_NFT_ABI, GOLD_TOKEN_ABI } from '@/contracts/abis';
import { formatBigInt } from '@/utils/helpers';
import { Package, Coins } from 'lucide-react';
import { useChainId } from 'wagmi';

export function InventoryPage() {
  const { address } = useAccount();
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  // 查询玩家的锄头
  const { data: pickaxes, isLoading: pickaxesLoading } = usePlayerPickaxes(address);

  // 查询玩家的稀有物品
  const { data: treasureItems } = useReadContract({
    address: addresses.treasureNFT,
    abi: TREASURE_NFT_ABI,
    functionName: 'getPlayerItems',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // 查询 GOLD 余额
  const { data: goldBalance } = useReadContract({
    address: addresses.goldToken,
    abi: GOLD_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">请先连接钱包</h2>
        <p className="text-gray-600">连接钱包后查看您的背包</p>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🎒 背包</h1>
        <p className="text-gray-600">查看您的锄头、稀有物品和 GOLD 代币</p>
      </div>

      {/* GOLD 余额 */}
      <Card variant="elevated" className="mb-8">
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Coins className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">GOLD 代币余额</p>
                <p className="text-2xl font-bold text-gray-900">
                  {goldBalance !== undefined ? formatBigInt(goldBalance as bigint, 18) : '0'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 锄头列表 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">⛏️ 我的锄头</h2>

        {!pickaxes || (pickaxes as bigint[]).length === 0 ? (
          <Card variant="bordered">
            <CardContent className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">您还没有锄头</p>
              <Button onClick={() => window.location.href = '/mint'}>
                去铸造锄头
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(pickaxes as bigint[]).map((tokenId: bigint) => (
              <PickaxeInventoryCard key={tokenId.toString()} tokenId={tokenId} />
            ))}
          </div>
        )}
      </div>

      {/* 稀有物品 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">✨ 稀有物品</h2>

        <Card variant="bordered">
          <CardContent>
            {!treasureItems || (treasureItems as [bigint[], bigint[]])[1].every((bal: bigint) => bal === 0n) ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">暂无稀有物品</p>
                <p className="text-sm text-gray-500 mt-2">
                  挖矿获得史诗掉落后可领取稀有物品
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(treasureItems as [bigint[], bigint[]])[0].map((itemId: bigint, index: number) => {
                  const balance = (treasureItems as [bigint[], bigint[]])[1][index];
                  if (balance === 0n) return null;

                  return (
                    <TreasureItemCard
                      key={itemId.toString()}
                      itemId={Number(itemId)}
                      balance={Number(balance)}
                    />
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 背包中的锄头卡片
function PickaxeInventoryCard({ tokenId }: { tokenId: bigint }) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const { data: attributes, isLoading, isError } = useReadContract({
    address: addresses.pickaxeNFT,
    abi: ['function getAttributes(uint256 tokenId) view returns (uint8 level, uint16 durabilityMax, uint16 durability, uint8 efficiency)'],
    functionName: 'getAttributes',
    args: [tokenId],
  });

  // 如果还在加载中，显示加载状态
  if (isLoading) {
    return (
      <Card variant="elevated" className="h-64 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </Card>
    );
  }

  // 如果获取属性失败，显示错误状态
  if (isError || !attributes) {
    return (
      <Card variant="elevated" className="h-64 flex items-center justify-center bg-red-50">
        <div className="text-center">
          <p className="text-red-600 font-bold">数据加载失败</p>
          <p className="text-sm text-gray-600 mt-1">无法获取锄头属性</p>
        </div>
      </Card>
    );
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
      onMine={() => window.location.href = '/mine'}
    />
  );
}

// 稀有物品卡片
function TreasureItemCard({ itemId, balance }: { itemId: number; balance: number }) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  // 查询物品名称
  const { data: itemName } = useReadContract({
    address: addresses.treasureNFT,
    abi: TREASURE_NFT_ABI,
    functionName: 'getItemName',
    args: [itemId],
  }) as { data: string | undefined };

  const getItemIcon = (id: number) => {
    switch (id) {
      case 1: return '🍀'; // Lucky Charm
      case 2: return '🧪'; // Durability Potion
      case 3: return '✨'; // Rare Skin
      case 4: return '📦'; // Epic Chest
      case 5: return '⚡'; // Gold Booster
      default: return '❓';
    }
  };

  const getItemDescription = (id: number) => {
    switch (id) {
      case 1: return '增加 10% 幸运值';
      case 2: return '恢复 50 耐久';
      case 3: return '稀有锄头外观';
      case 4: return '开启获得随机奖励';
      case 5: return '挖矿奖励 x2 (持续 10 次)';
      default: return '未知效果';
    }
  };

  return (
    <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{getItemIcon(itemId)}</span>
          <div>
            <h4 className="font-semibold text-gray-900">{itemName || `物品 #${itemId}`}</h4>
            <p className="text-xs text-gray-500">{getItemDescription(itemId)}</p>
          </div>
        </div>
        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
          x{balance}
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        disabled
      >
        使用 (即将开放)
      </Button>
    </div>
  );
}
