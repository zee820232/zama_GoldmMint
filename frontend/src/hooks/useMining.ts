import { useReadContract } from 'wagmi';
import { MINING_ENGINE_ABI } from '@/contracts/abis';
import { getContractAddresses } from '@/contracts/addresses';
import { useChainId } from 'wagmi';

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
