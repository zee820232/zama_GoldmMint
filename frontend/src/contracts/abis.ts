export const PICKAXE_NFT_ABI = [
  // 查询函数
  'function balanceOf(address owner) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function getAttributes(uint256 tokenId) view returns (uint8 level, uint16 durabilityMax, uint16 durability, uint8 efficiency)',
  'function getLuck(uint256 tokenId) view returns (uint8)',
  'function getLevelConfig(uint8 level) view returns (tuple(uint256 price, uint16 durabilityMax, uint8 efficiencyMin, uint8 efficiencyMax, uint8 luckMin, uint8 luckMax))',
  'function tokensOfOwner(address owner) view returns (uint256[])',

  // 交易函数
  'function mintPickaxe(uint8 level) payable returns (uint256)',
  'function repairPickaxe(uint256 tokenId, uint16 amount)',

  // 事件
  'event PickaxeMinted(address indexed owner, uint256 indexed tokenId, uint8 level)',
  'event PickaxeRepaired(uint256 indexed tokenId, uint16 amount, uint256 goldCost)',
] as const;

export const MINING_ENGINE_ABI = [
  // 查询函数
  'function getPlayerEarnings(address player) view returns (uint256)',
  'function getPlayerEpicDrops(address player) view returns (uint256)',
  'function getPlayerStats(address player) view returns (uint256 miningCount, uint256 lastMiningTime)',

  // 交易函数
  'function mine(uint256 pickaxeId)',
  'function claimRewards(uint256 claimAmount)',
  'function claimTreasure(uint256 claimCount)',

  // 事件
  'event MiningStarted(address indexed player, uint256 indexed pickaxeId, uint256 timestamp)',
  'event MiningCompleted(address indexed player, uint256 indexed pickaxeId, uint256 timestamp)',
  'event RewardsRevealed(address indexed player, uint256 amount)',
  'event TreasureDropped(address indexed player, uint256 itemId, uint256 amount)',
] as const;

export const GOLD_TOKEN_ABI = [
  // ERC20 标准
  'function balanceOf(address account) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',

  // 事件
  'event Transfer(address indexed from, address indexed to, uint256 value)',
] as const;

export const TREASURE_NFT_ABI = [
  // ERC1155 查询
  'function balanceOf(address account, uint256 id) view returns (uint256)',
  'function getPlayerItems(address player) view returns (uint256[] itemIds, uint256[] balances)',
  'function getItemName(uint256 itemId) view returns (string)',

  // 交易函数
  'function burn(address from, uint256 itemId, uint256 amount)',

  // 事件
  'event TreasureMinted(address indexed to, uint256 indexed itemId, uint256 amount)',
] as const;
