import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, localhost } from 'wagmi/chains';
import { defineChain } from 'viem';

/**
 * Zama fhEVM Devnet 配置
 * 官方测试网,支持 FHE 全同态加密操作
 *
 * 网络信息:
 * - Chain ID: 9000 (更新为最新值)
 * - RPC: https://devnet.zama.ai
 * - Explorer: https://explorer.devnet.zama.ai
 * - Faucet: https://faucet.zama.ai
 * - Gateway: https://gateway.devnet.zama.ai
 */
export const zamaDevnet = defineChain({
  id: 9000,
  name: 'Zama fhEVM Devnet',
  network: 'zama-devnet',
  nativeCurrency: {
    decimals: 18,
    name: 'ZAMA',
    symbol: 'ZAMA',
  },
  rpcUrls: {
    default: {
      http: ['https://devnet.zama.ai'],
    },
    public: {
      http: ['https://devnet.zama.ai'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Zama Explorer',
      url: 'https://explorer.devnet.zama.ai',
    },
  },
  testnet: true,
  // Zama 特定配置
  custom: {
    gatewayUrl: 'https://gateway.devnet.zama.ai',
    aclAddress: '0x2Fb4341027eb1d2aD8B5D9708187df8633cAFA92',
  },
});

// Wagmi 配置
export const config = getDefaultConfig({
  appName: 'Zama Mining Game',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [
    localhost,      // 本地开发
    zamaDevnet,     // Zama 测试网 (主要网络)
    sepolia,        // Sepolia 测试网 (备用)
  ],
  ssr: false,
});

/**
 * 获取当前网络的 Gateway URL (用于 FHE 解密)
 */
export function getGatewayUrl(chainId: number): string | undefined {
  switch (chainId) {
    case 9000: // Zama Devnet
      return 'https://gateway.devnet.zama.ai';
    default:
      return undefined;
  }
}

/**
 * 获取当前网络的 ACL 地址 (访问控制列表)
 */
export function getACLAddress(chainId: number): `0x${string}` | undefined {
  switch (chainId) {
    case 9000: // Zama Devnet
      return '0x2Fb4341027eb1d2aD8B5D9708187df8633cAFA92';
    default:
      return undefined;
  }
}

/**
 * 检查当前网络是否支持 FHE
 */
export function isFHESupported(chainId: number): boolean {
  return chainId === 9000; // 只有 Zama Devnet 支持 FHE
}

