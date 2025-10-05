import { useReadContract } from 'wagmi';
import { PICKAXE_NFT_ABI } from '@/contracts/abis';
import { getContractAddresses } from '@/contracts/addresses';
import { useChainId } from 'wagmi';

/**
 * 获取玩家拥有的锄头列表
 */
export function usePlayerPickaxes(address?: `0x${string}`) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  return useReadContract({
    address: addresses.pickaxeNFT,
    abi: PICKAXE_NFT_ABI,
    functionName: 'tokensOfOwner',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

/**
 * 获取锄头属性
 */
export function usePickaxeAttributes(tokenId?: bigint) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  return useReadContract({
    address: addresses.pickaxeNFT,
    abi: PICKAXE_NFT_ABI,
    functionName: 'getAttributes',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined,
    },
  });
}

/**
 * 获取锄头等级配置
 */
export function usePickaxeLevelConfig(level: number) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  return useReadContract({
    address: addresses.pickaxeNFT,
    abi: PICKAXE_NFT_ABI,
    functionName: 'getLevelConfig',
    args: [level],
  });
}
