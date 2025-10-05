import { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { BrowserProvider } from 'ethers';
import type { FhevmInstance } from 'fhevmjs';
import {
  createFhevmInstance,
  resetFhevmInstance,
  reencryptValue as reencryptValueUtil,
} from '@/utils/fhevm';

/**
 * 管理 fhevmjs 实例的 Hook
 * 自动处理网络切换和初始化
 */
export function useFhevmInstance() {
  const { address, connector } = useAccount();
  const chainId = useChainId();
  const [instance, setInstance] = useState<FhevmInstance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      if (!address || !connector) {
        setInstance(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // 获取 ethers provider
        const walletClient = await connector.getProvider();
        const provider = new BrowserProvider(walletClient);

        // 创建 fhevmjs 实例
        const fhevmInstance = await createFhevmInstance(provider, chainId);

        if (!cancelled) {
          setInstance(fhevmInstance);
        }
      } catch (err) {
        console.error('初始化 fhevmjs 失败:', err);
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('初始化失败'));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    initialize();

    return () => {
      cancelled = true;
    };
  }, [address, connector, chainId]);

  // 网络切换时重置实例
  useEffect(() => {
    resetFhevmInstance();
  }, [chainId]);

  return { instance, isLoading, error };
}

/**
 * 通用重加密 Hook
 *
 * @param contractAddress 合约地址
 * @param encryptedValue 加密值 (从合约读取的)
 * @param enabled 是否启用
 */
export function useReencrypt(
  contractAddress: string | undefined,
  encryptedValue: bigint | undefined,
  enabled = true
) {
  const { address, connector } = useAccount();
  const { instance } = useFhevmInstance();
  const [decryptedValue, setDecryptedValue] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reencrypt = useCallback(async () => {
    if (
      !enabled ||
      !instance ||
      !contractAddress ||
      !address ||
      !connector ||
      encryptedValue === undefined
    ) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 获取 signer
      const walletClient = await connector.getProvider();
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      // 重加密
      const decrypted = await reencryptValueUtil(
        instance,
        contractAddress,
        address,
        encryptedValue,
        signer
      );

      setDecryptedValue(decrypted);
    } catch (err) {
      console.error('重加密失败:', err);
      setError(err instanceof Error ? err : new Error('重加密失败'));
    } finally {
      setIsLoading(false);
    }
  }, [instance, contractAddress, address, connector, encryptedValue, enabled]);

  // 自动执行重加密
  useEffect(() => {
    if (enabled && instance && encryptedValue !== undefined) {
      reencrypt();
    }
  }, [enabled, instance, encryptedValue, reencrypt]);

  return {
    decryptedValue,
    isLoading,
    error,
    refetch: reencrypt,
  };
}

/**
 * 解密锄头幸运值
 *
 * @param pickaxeId 锄头 ID
 * @param encryptedLuck 加密的幸运值
 * @param pickaxeNftAddress 锄头 NFT 合约地址
 */
export function useDecryptedLuck(
  pickaxeId: bigint | undefined,
  encryptedLuck: bigint | undefined,
  pickaxeNftAddress: string | undefined
) {
  const enabled = pickaxeId !== undefined && encryptedLuck !== undefined;

  const { decryptedValue, isLoading, error, refetch } = useReencrypt(
    pickaxeNftAddress,
    encryptedLuck,
    enabled
  );

  return {
    luck: decryptedValue !== null ? Number(decryptedValue) : null,
    isLoading,
    error,
    refetch,
  };
}

/**
 * 解密玩家收益
 *
 * @param encryptedEarnings 加密的收益
 * @param miningEngineAddress 挖矿引擎合约地址
 */
export function useDecryptedEarnings(
  encryptedEarnings: bigint | undefined,
  miningEngineAddress: string | undefined
) {
  const enabled = encryptedEarnings !== undefined;

  const { decryptedValue, isLoading, error, refetch } = useReencrypt(
    miningEngineAddress,
    encryptedEarnings,
    enabled
  );

  return {
    earnings: decryptedValue,
    isLoading,
    error,
    refetch,
  };
}

/**
 * 解密玩家史诗掉落次数
 *
 * @param encryptedEpicDrops 加密的史诗掉落次数
 * @param miningEngineAddress 挖矿引擎合约地址
 */
export function useDecryptedEpicDrops(
  encryptedEpicDrops: bigint | undefined,
  miningEngineAddress: string | undefined
) {
  const enabled = encryptedEpicDrops !== undefined;

  const { decryptedValue, isLoading, error, refetch } = useReencrypt(
    miningEngineAddress,
    encryptedEpicDrops,
    enabled
  );

  return {
    epicDrops: decryptedValue !== null ? Number(decryptedValue) : null,
    isLoading,
    error,
    refetch,
  };
}
