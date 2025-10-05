import { useReadContract } from 'wagmi';
import { PICKAXE_NFT_ABI } from '@/contracts/abis';
import { getContractAddresses } from '@/contracts/addresses';
import { useChainId } from 'wagmi';
import { useDecryptedLuck } from './useFHE';

/**
 * 获取玩家拥有的锄头列表
 */
export function usePlayerPickaxes(address?: `0x${string}`) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  return useReadContract({
    address: addresses.pickaxeNFT,
    abi: PICKAXE_NFT_ABI,
    functionName: 'getPlayerPickaxes', // 修复: 使用正确的函数名
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
 * 获取锄头加密的幸运值
 */
export function usePickaxeLuck(tokenId?: bigint) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  return useReadContract({
    address: addresses.pickaxeNFT,
    abi: PICKAXE_NFT_ABI,
    functionName: 'getLuck',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined,
    },
  });
}

/**
 * 获取锄头的完整信息 (包括解密后的幸运值)
 *
 * @param tokenId 锄头 ID
 * @returns 锄头属性 + 解密后的幸运值
 */
export function usePickaxeFullInfo(tokenId?: bigint) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  // 获取基础属性
  const { data: attributes, ...attributesQuery } = usePickaxeAttributes(tokenId);

  // 获取加密的幸运值
  const { data: encryptedLuck, ...luckQuery } = usePickaxeLuck(tokenId);

  // 解密幸运值
  const {
    luck: decryptedLuck,
    isLoading: isDecrypting,
    error: decryptError,
  } = useDecryptedLuck(
    tokenId,
    encryptedLuck as bigint | undefined,
    addresses.pickaxeNFT
  );

  return {
    // 基础属性
    level: attributes?.[0] as number | undefined,
    durabilityMax: attributes?.[1] as number | undefined,
    durability: attributes?.[2] as number | undefined,
    efficiency: attributes?.[3] as number | undefined,

    // 解密后的幸运值
    luck: decryptedLuck,

    // 查询状态
    isLoading: attributesQuery.isLoading || luckQuery.isLoading || isDecrypting,
    isError: attributesQuery.isError || luckQuery.isError || !!decryptError,
    error: attributesQuery.error || luckQuery.error || decryptError,

    // 刷新函数
    refetch: () => {
      attributesQuery.refetch();
      luckQuery.refetch();
    },
  };
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
    functionName: 'levelConfigs', // 修复: 使用 levelConfigs 而不是 getLevelConfig
    args: [level],
  });
}
