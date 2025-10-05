/**
 * 合约地址配置
 * 根据部署的网络选择对应的合约地址
 */
import type { ContractAddresses } from '@/types';

// 网络类型定义
export type NetworkName = 'localhost' | 'zamaDevnet' | 'sepolia';

// 本地测试网地址 (localhost - Chain ID: 31337)
export const LOCALHOST_ADDRESSES: ContractAddresses = {
  goldToken: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  pickaxeNFT: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  miningEngine: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  treasureNFT: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
};

// Zama Devnet 地址 (Chain ID: 9000) - 部署后更新
export const ZAMA_DEVNET_ADDRESSES: ContractAddresses = {
  goldToken: '0x0000000000000000000000000000000000000000',
  pickaxeNFT: '0x0000000000000000000000000000000000000000',
  miningEngine: '0x0000000000000000000000000000000000000000',
  treasureNFT: '0x0000000000000000000000000000000000000000',
};

// Sepolia 测试网地址 (Chain ID: 11155111) - 部署后更新
export const SEPOLIA_ADDRESSES: ContractAddresses = {
  goldToken: '0x0000000000000000000000000000000000000000',
  pickaxeNFT: '0x0000000000000000000000000000000000000000',
  miningEngine: '0x0000000000000000000000000000000000000000',
  treasureNFT: '0x0000000000000000000000000000000000000000',
};

// 网络配置映射
export const ADDRESSES_BY_NETWORK: Record<NetworkName, ContractAddresses> = {
  localhost: LOCALHOST_ADDRESSES,
  zamaDevnet: ZAMA_DEVNET_ADDRESSES,
  sepolia: SEPOLIA_ADDRESSES,
};

/**
 * 根据 Chain ID 获取合约地址
 * @param chainId - 区块链 Chain ID
 * @returns 合约地址对象
 */
export function getContractAddresses(chainId?: number): ContractAddresses {
  // 优先使用环境变量
  const envAddresses = getContractAddressesFromEnv();
  if (envAddresses) {
    return envAddresses;
  }

  // 根据 chainId 选择网络
  if (!chainId) {
    return LOCALHOST_ADDRESSES;
  }

  switch (chainId) {
    case 31337: // Localhost / Hardhat
      return LOCALHOST_ADDRESSES;
    case 9000: // Zama Devnet
      return ZAMA_DEVNET_ADDRESSES;
    case 11155111: // Sepolia
      return SEPOLIA_ADDRESSES;
    default:
      console.warn(`Unknown chain ID: ${chainId}, using localhost addresses`);
      return LOCALHOST_ADDRESSES;
  }
}

/**
 * 从环境变量读取合约地址 (用于生产环境)
 */
export function getContractAddressesFromEnv(): ContractAddresses | null {
  const goldToken = import.meta.env.VITE_GOLDTOKEN_ADDRESS;
  const pickaxeNFT = import.meta.env.VITE_PICKAXENFT_ADDRESS;
  const miningEngine = import.meta.env.VITE_MININGENGINE_ADDRESS;
  const treasureNFT = import.meta.env.VITE_TREASURENFT_ADDRESS;

  if (goldToken && pickaxeNFT && miningEngine && treasureNFT) {
    return {
      goldToken: goldToken as `0x${string}`,
      pickaxeNFT: pickaxeNFT as `0x${string}`,
      miningEngine: miningEngine as `0x${string}`,
      treasureNFT: treasureNFT as `0x${string}`,
    };
  }

  return null;
}

// 默认导出 (保持向后兼容)
export const CONTRACT_ADDRESSES = LOCALHOST_ADDRESSES;

