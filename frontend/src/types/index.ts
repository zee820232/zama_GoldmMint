// 锄头属性
export interface PickaxeAttributes {
  level: number;
  durabilityMax: number;
  durability: number;
  efficiency: number;
  luck?: bigint; // 加密值,需重加密查看
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

// FHE 实例类型
export interface FhevmInstance {
  createEncryptedInput: (contractAddress: string, userAddress: string) => any;
  getPublicKey: (contractAddress: string) => Promise<string>;
  generateKeypair: () => { publicKey: Uint8Array; privateKey: Uint8Array };
  decrypt: (ciphertext: Uint8Array, privateKey: Uint8Array) => bigint;
}

// 交易状态
export type TxStatus = 'idle' | 'pending' | 'success' | 'error';

// 挖矿结果
export interface MiningResult {
  txHash: string;
  success: boolean;
  remainingDurability: number;
}
