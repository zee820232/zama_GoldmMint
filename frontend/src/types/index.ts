// 锄头属性
export interface PickaxeAttributes {
  level: number;
  durabilityMax: number;
  durability: number;
  efficiency: number;
  luck?: number; // 解密后的幸运值
}

// 锄头完整信息 (包括解密后的幸运值)
export interface PickaxeFullInfo extends PickaxeAttributes {
  luck: number | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

// 锄头配置
export interface PickaxeLevelConfig {
  price: bigint;
  durabilityMax: number;
  efficiencyMin: number;
  efficiencyMax: number;
  luckMin: number;
  luckMax: number;
}

// 玩家统计
export interface PlayerStats {
  miningCount: bigint;
  lastMiningTime: bigint;
}

// 玩家完整挖矿数据 (包括解密后的收益和史诗掉落)
export interface PlayerMiningData {
  miningCount?: bigint;
  lastMiningTime?: bigint;
  earnings: bigint | null;
  epicDrops: number | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

// 稀有物品类型
export enum TreasureItemType {
  LUCKY_CHARM = 1,
  DURABILITY_POTION = 2,
  RARE_SKIN = 3,
  EPIC_CHEST = 4,
  GOLD_BOOSTER = 5,
}

// 稀有物品背包
export interface PlayerInventory {
  itemIds: bigint[];
  balances: bigint[];
}

// 合约地址配置
export interface ContractAddresses {
  goldToken: `0x${string}`;
  pickaxeNFT: `0x${string}`;
  miningEngine: `0x${string}`;
  treasureNFT: `0x${string}`;
}

// 交易状态
export type TxStatus = 'idle' | 'pending' | 'success' | 'error';

// 挖矿结果
export interface MiningResult {
  txHash: string;
  success: boolean;
  remainingDurability: number;
}

// FHE 重加密结果
export interface ReencryptResult<T> {
  decryptedValue: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
