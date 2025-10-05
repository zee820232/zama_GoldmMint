import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, localhost } from 'wagmi/chains';

// 自定义 Zama 测试网
export const zamaDevnet = {
  id: 8009,
  name: 'Zama Devnet',
  network: 'zama-devnet',
  nativeCurrency: {
    decimals: 18,
    name: 'ZAMA',
    symbol: 'ZAMA',
  },
  rpcUrls: {
    default: { http: ['https://devnet.zama.ai'] },
    public: { http: ['https://devnet.zama.ai'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.devnet.zama.ai' },
  },
  testnet: true,
} as const;

export const config = getDefaultConfig({
  appName: 'Zama Mining Game',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // 从 WalletConnect Cloud 获取
  chains: [localhost, sepolia, zamaDevnet],
  ssr: false,
});
