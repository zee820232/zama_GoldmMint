import type { ContractAddresses } from '@/types';

// 从部署文件加载或手动配置
export const CONTRACT_ADDRESSES: ContractAddresses = {
  goldToken: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  pickaxeNFT: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  miningEngine: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  treasureNFT: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
};

// 可以根据网络切换地址
export function getContractAddresses(_chainId?: number): ContractAddresses {
  // TODO: 根据 chainId 返回不同网络的合约地址
  return CONTRACT_ADDRESSES;
}
