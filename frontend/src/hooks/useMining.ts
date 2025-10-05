import { useReadContract } from 'wagmi';
import { MINING_ENGINE_ABI } from '@/contracts/abis';
import { getContractAddresses } from '@/contracts/addresses';
import { useChainId } from 'wagmi';
import { useDecryptedEarnings, useDecryptedEpicDrops } from './useFHE';

/**
 * 获取玩家挖矿统计
 */
export function usePlayerStats(address?: `0x${string}`) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  return useReadContract({
    address: addresses.miningEngine,
    abi: MINING_ENGINE_ABI,
    functionName: 'getPlayerStats',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000, // 每5秒刷新
    },
  });
}

/**
 * 获取玩家加密收益
 * 注意: 返回的是加密值,需要前端解密
 */
export function usePlayerEarnings(address?: `0x${string}`) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  return useReadContract({
    address: addresses.miningEngine,
    abi: MINING_ENGINE_ABI,
    functionName: 'getPlayerEarnings',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

/**
 * 获取玩家史诗掉落计数(加密)
 */
export function usePlayerEpicDrops(address?: `0x${string}`) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  return useReadContract({
    address: addresses.miningEngine,
    abi: MINING_ENGINE_ABI,
    functionName: 'getPlayerEpicDrops',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

/**
 * 获取玩家的解密收益 (自动重加密)
 *
 * @param address 玩家地址
 * @returns 解密后的收益金额 (bigint)
 */
export function useDecryptedPlayerEarnings(address?: `0x${string}`) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  // 获取加密的收益
  const { data: encryptedEarnings, ...earningsQuery } = usePlayerEarnings(address);

  // 解密收益
  const {
    earnings: decryptedEarnings,
    isLoading: isDecrypting,
    error: decryptError,
    refetch: refetchDecryption,
  } = useDecryptedEarnings(
    encryptedEarnings as bigint | undefined,
    addresses.miningEngine
  );

  return {
    earnings: decryptedEarnings,
    isLoading: earningsQuery.isLoading || isDecrypting,
    isError: earningsQuery.isError || !!decryptError,
    error: earningsQuery.error || decryptError,
    refetch: () => {
      earningsQuery.refetch();
      refetchDecryption();
    },
  };
}

/**
 * 获取玩家的解密史诗掉落次数 (自动重加密)
 *
 * @param address 玩家地址
 * @returns 解密后的史诗掉落次数 (number)
 */
export function useDecryptedPlayerEpicDrops(address?: `0x${string}`) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  // 获取加密的史诗掉落次数
  const { data: encryptedEpicDrops, ...epicDropsQuery } = usePlayerEpicDrops(address);

  // 解密史诗掉落次数
  const {
    epicDrops: decryptedEpicDrops,
    isLoading: isDecrypting,
    error: decryptError,
    refetch: refetchDecryption,
  } = useDecryptedEpicDrops(
    encryptedEpicDrops as bigint | undefined,
    addresses.miningEngine
  );

  return {
    epicDrops: decryptedEpicDrops,
    isLoading: epicDropsQuery.isLoading || isDecrypting,
    isError: epicDropsQuery.isError || !!decryptError,
    error: epicDropsQuery.error || decryptError,
    refetch: () => {
      epicDropsQuery.refetch();
      refetchDecryption();
    },
  };
}

/**
 * 获取玩家完整的挖矿数据 (包括解密后的收益和史诗掉落)
 *
 * @param address 玩家地址
 * @returns 完整的挖矿数据
 */
export function usePlayerMiningData(address?: `0x${string}`) {
  const { data: stats, ...statsQuery } = usePlayerStats(address);
  const { earnings, isLoading: earningsLoading, error: earningsError } = useDecryptedPlayerEarnings(address);
  const { epicDrops, isLoading: epicDropsLoading, error: epicDropsError } = useDecryptedPlayerEpicDrops(address);

  return {
    // 基础统计
    miningCount: stats?.[0],
    lastMiningTime: stats?.[1],

    // 解密后的数据
    earnings,
    epicDrops,

    // 查询状态
    isLoading: statsQuery.isLoading || earningsLoading || epicDropsLoading,
    isError: statsQuery.isError || !!earningsError || !!epicDropsError,
    error: statsQuery.error || earningsError || epicDropsError,

    // 刷新函数
    refetch: () => {
      statsQuery.refetch();
    },
  };
}
