# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**Zama Mining Game** - 基于 Zama FHE (全同态加密) 技术的完全保密链上挖矿游戏。

### 核心技术特性
- **FHE 全同态加密**: 使用 @fhevm/solidity 实现完全保密的游戏数据
- **加密随机数**: FHE.randEuint8() 生成公平的链上随机数
- **加密状态管理**: 幸运值、收益、掉落记录全部加密存储
- **Hardhat 开发框架**: 基于 Hardhat 2.22+ 和 Solidity 0.8.24

## 常用开发命令

### 合约开发
```bash
# 编译合约 (使用 viaIR 优化器)
npm run compile

# 运行完整测试套件 (33+ 测试用例)
npm test

# 启动本地 Hardhat 节点
npm run node

# 部署到本地网络
npm run deploy:local

# 部署到 Sepolia 测试网
npm run deploy:sepolia
```

### 前端开发
```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器 (http://localhost:3000)
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 测试和交互
```bash
# 运行交互脚本 (需要本地节点运行)
npm run interact

# 清理构建缓存
npx hardhat clean
```

## 项目架构

### 智能合约结构 (contracts/)

#### 核心合约 (4个)

**1. GoldToken.sol** (~138行)
- ERC20 游戏代币,最大供应量 10M
- 授权铸造机制 (minters mapping)
- 通缩经济模型: 修理消耗 30% 燃烧 + 70% 进金库
- 关键函数: `mintFromMining()`, `burnForRepair()`

**2. PickaxeNFT.sol** (~335行)
- ERC721 + ERC721Enumerable NFT 锄头
- 5个等级配置 (mintPrice, durability, efficiency, luck范围)
- **FHE 加密属性**: `euint8 luck` (幸运值完全保密)
- 耐久系统: 挖矿消耗,修理恢复
- 关键函数: `mintPickaxe()`, `consumeDurability()`, `getLuck()`

**3. MiningEngine.sol** (~460行) - 核心游戏逻辑
- **FHE 随机概率**: `FHE.randEuint8()` + `FHE.rem()` 生成 0-99 随机数
- **加密条件判断**: `FHE.lt()`, `FHE.and()`, `FHE.select()`
- **加密累加**: `playerEarnings[address] = euint64` (玩家收益保密)
- **加密计数**: `playerEpicDrops[address] = euint32` (史诗掉落次数保密)
- 5级概率表配置 (epicRate, rareRate, commonRate)
- 奖励计算公式: `baseReward * multiplier + efficiency% + luck`
- 关键函数: `mine()`, `claimRewards()`, `claimTreasure()`

**4. TreasureNFT.sol** (~211行)
- ERC1155 多类型稀有物品 NFT
- 5种物品类型 (通过 tokenId 1-5 区分)
- 授权铸造机制,支持批量操作
- 关键函数: `mint()`, `mintBatch()`

### 合约关系和权限

```
GoldToken (ERC20)
  ├─ minters[MiningEngine] = true  // MiningEngine 可铸造代币
  └─ owner 可管理 minters

PickaxeNFT (ERC721)
  ├─ miningEngine = MiningEngine地址  // 允许消耗耐久
  └─ owner 可更新配置

MiningEngine (核心引擎)
  ├─ pickaxeNFT: PickaxeNFT 合约引用
  ├─ goldToken: GoldToken 合约引用
  ├─ treasureNFT: TreasureNFT 合约引用
  └─ 调用权限:
      - pickaxeNFT.consumeDurability()
      - goldToken.mintFromMining()
      - treasureNFT.mint()

TreasureNFT (ERC1155)
  └─ minters[MiningEngine] = true
```

### 部署脚本 (scripts/deploy.js)

**部署顺序** (至关重要):
1. 部署 GoldToken
2. 部署 PickaxeNFT
3. 部署 MiningEngine(pickaxeNFT地址, goldToken地址)
4. 部署 TreasureNFT
5. 配置权限:
   - `pickaxeNFT.setMiningEngine(miningEngine)`
   - `goldToken.addMinter(miningEngine)`
   - `treasureNFT.addMinter(miningEngine)`
   - `miningEngine.setTreasureNFT(treasureNFT)`

部署信息自动保存到 `deployment-{network}.json`

### 前端架构 (frontend/)

**技术栈**:
- React 18 + TypeScript + Vite
- Wagmi v2 + RainbowKit (钱包连接)
- TanStack Query (状态管理)
- Tailwind CSS (样式)
- fhevmjs ^0.5.0 (FHE 加密库)

**核心 Hooks**:
- `usePickaxe`: 锄头 NFT 操作 (mint, repair, query)
- `useMining`: 挖矿逻辑 (mine, claimRewards, claimTreasure)

**合约 ABIs**: `frontend/src/contracts/abis.ts` - 从 artifacts 导入

## FHE 全同态加密关键知识

### FHE 数据类型
- `euint8`, `euint16`, `euint32`, `euint64`: 加密整数
- `ebool`: 加密布尔值
- 所有 `euintX` 变量无法直接读取,需要重加密或 Gateway 解密

### 核心 FHE 操作

**1. 随机数生成**:
```solidity
euint8 random = FHE.randEuint8();  // 生成 0-255 随机数
euint8 roll = FHE.rem(random, 100);  // 取模得到 0-99
```

**2. 明文转加密**:
```solidity
euint32 encrypted = FHE.asEuint32(100);  // 明文 100 → 加密
```

**3. 加密比较**:
```solidity
ebool result = FHE.lt(a, b);  // a < b (加密比较)
ebool result = FHE.ge(encrypted, plaintext);  // 密文与明文比较
```

**4. 加密条件选择** (关键创新):
```solidity
euint32 result = FHE.select(
    condition,  // ebool
    valueIfTrue,  // euint32
    valueIfFalse  // euint32
);
```

**5. 授权访问**:
```solidity
FHE.allow(playerEarnings[player], player);  // 允许玩家重加密查看自己的数据
```

### MiningEngine 中的 FHE 应用示例

**概率计算** (contracts/MiningEngine.sol:194-221):
```solidity
// 1. 生成随机数 0-99
euint8 roll = FHE.rem(FHE.randEuint8(), 100);

// 2. 判断稀有度
ebool isEpic = FHE.lt(roll, FHE.asEuint8(prob.epicRate));
ebool isRare = FHE.and(
    FHE.ge(roll, FHE.asEuint8(prob.epicRate)),
    FHE.lt(roll, FHE.asEuint8(prob.epicRate + prob.rareRate))
);

// 3. 选择奖励
euint32 reward = FHE.select(
    isEpic,
    epicReward,
    FHE.select(isRare, rareReward, baseReward)
);
```

**加密计数累加** (contracts/MiningEngine.sol:236-246):
```solidity
// 使用 FHE.select 实现条件累加 (避免泄露是否掉落)
euint32 epicIncrement = FHE.select(
    isEpic,
    FHE.asEuint32(1),  // 如果是史诗,+1
    FHE.asEuint32(0)   // 否则 +0
);
playerEpicDrops[msg.sender] = FHE.add(
    playerEpicDrops[msg.sender],
    epicIncrement
);
```

## 重要技术约束

### 1. FHE 环境限制
- **本地 Hardhat 网络不支持 FHE 操作** - `FHE.randEuint8()` 会导致交易回滚
- 必须部署到 **Zama Devnet** 或 **Zama 主网** 才能完整测试
- 详见 `LOCAL_TESTING_NOTE.md`

### 2. Solidity 编译配置 (hardhat.config.js)
```javascript
solidity: {
  version: "0.8.24",
  settings: {
    optimizer: { enabled: true, runs: 200 },
    viaIR: true,        // 必须启用! 解决 FHE 合约栈深度问题
    evmVersion: "cancun"
  }
}
```

### 3. 简化的奖励方案 (无 Gateway)
当前实现使用 **声明式领取**,避免 Gateway 复杂度:
- 玩家声明要领取的数量: `claimRewards(uint256 claimAmount)`
- 合约加密验证余额: `FHE.ge(earnings, claimAmount)`
- 乐观扣除,如果余额不足会回滚

**完整 Gateway 方案** 见 `GATEWAY_INTEGRATION_GUIDE.md`

## 测试和调试

### 测试套件 (test/MiningGame.test.js)
- **GoldToken**: 5个用例 (铸造权限,供应上限,修理燃烧)
- **PickaxeNFT**: 8个用例 (等级配置,铸造,耐久,修理)
- **MiningEngine**: 6个用例 (挖矿流程,奖励,统计)
- **TreasureNFT**: 5个用例 (铸造,批量,查询)
- **集成测试**: 完整游戏流程

### 调试 FHE 问题
1. **编译错误 "Stack too deep"** → 确保 `viaIR: true`
2. **交易回滚无原因** → 检查是否在非 FHE 网络调用 FHE 函数
3. **无法读取加密数据** → 确保调用了 `FHE.allow()` 授权

## 安全注意事项

1. **永远不要在链下解密私密数据** - luck, earnings 必须保密
2. **Gateway 回调验证** - 生产环境集成 Gateway 时需验证回调来源
3. **重入攻击防护** - 所有关键函数使用 `ReentrancyGuard`
4. **权限管理** - 仅授权地址可铸造/消耗资源
5. **耐久验证** - 挖矿前检查 `durability >= durabilityPerMine`

## 未来扩展计划

当前完成度: **85%** ✅

**待完善功能** (见 PROJECT_SUMMARY.md):
- Gateway 异步解密集成
- 前端完整页面 (铸造/背包/奖励)
- Zama Devnet/主网部署
- 排行榜和成就系统

## 相关文档

- `PROJECT_SUMMARY.md` - 完整项目总结和技术亮点
- `DEPLOYMENT_GUIDE.md` - Sepolia/Zama 部署指南
- `GATEWAY_INTEGRATION_GUIDE.md` - Gateway 异步解密方案
- `LOCAL_TESTING_NOTE.md` - 本地测试限制说明
- `DEPLOYMENT_ISSUE.md` - 部署问题排查

## 开发最佳实践

### 修改 FHE 合约时
1. 先在注释中清晰说明加密逻辑
2. 使用 `FHE.allow()` 授权必要的访问
3. 避免在循环中大量使用 FHE 操作 (Gas 昂贵)
4. 优先使用 `FHE.select()` 而非条件分支

### 添加新概率规则
在 `MiningEngine.sol`:
1. 更新 `ProbabilityTier` 结构 (如需新字段)
2. 修改 `_initializeProbabilityTable()` 初始化数据
3. 在 `mine()` 函数中实现加密判断逻辑
4. 确保所有概率和为 100 (合约会验证)

### 前端集成新合约功能
1. 导出合约 ABI 到 `frontend/src/contracts/abis.ts`
2. 创建对应 Hook (参考 `usePickaxe.ts`)
3. 使用 Wagmi 的 `useContractWrite` 发起交易
4. 用 `useWaitForTransaction` 等待确认
5. 如需读取加密数据,集成 fhevmjs 重加密

## 快速开始新功能开发

假设要添加"每日签到"功能:

1. **合约层** (`contracts/CheckIn.sol`):
```solidity
mapping(address => uint256) public lastCheckIn;
euint32 private checkInRewards[address];  // 加密累计奖励

function checkIn() external {
    require(block.timestamp >= lastCheckIn[msg.sender] + 1 days);
    lastCheckIn[msg.sender] = block.timestamp;

    // FHE 随机奖励 10-50
    euint8 random = FHE.randEuint8();
    euint32 reward = FHE.add(
        FHE.rem(FHE.asEuint32(random), 40),
        FHE.asEuint32(10)
    );
    checkInRewards[msg.sender] = FHE.add(checkInRewards[msg.sender], reward);
    FHE.allow(checkInRewards[msg.sender], msg.sender);
}
```

2. **部署脚本** (在 `scripts/deploy.js` 第85行后):
```javascript
const CheckIn = await ethers.getContractFactory("CheckIn");
const checkIn = await CheckIn.deploy();
await checkIn.setGoldToken(goldTokenAddress);
await goldToken.addMinter(await checkIn.getAddress());
```

3. **前端 Hook** (`frontend/src/hooks/useCheckIn.ts`):
```typescript
export function useCheckIn() {
  const { write } = useContractWrite({
    address: CHECK_IN_ADDRESS,
    abi: CheckInABI,
    functionName: 'checkIn',
  });

  return { checkIn: write };
}
```

4. **测试** (`test/CheckIn.test.js`):
```javascript
it("应该正确记录签到时间", async function () {
  await checkIn.connect(player1).checkIn();
  expect(await checkIn.lastCheckIn(player1.address)).to.be.gt(0);
});
```
