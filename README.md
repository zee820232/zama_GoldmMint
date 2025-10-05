# ⚡ Zama Mining Game - 雷神之锤版

> 基于 **Zama FHE (全同态加密)** 技术的完全保密链上挖矿游戏
> 🔨 **特色**: 雷神之锤风格设计,5个等级带闪电特效

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-green.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.22.0-yellow.svg)](https://hardhat.org/)
[![Progress](https://img.shields.io/badge/Progress-98%25-brightgreen.svg)]()

---

## ✨ 核心特性

- 🔐 **完全保密** - 幸运值、收益、掉落记录全部 FHE 加密存储
- 🎲 **公平随机** - FHE 随机数生成,无法预测或操纵
- ⚡ **雷神之锤设计** - 5个等级带独特颜色和闪电特效
- 🎮 **即插即用** - 完整的前后端,一键部署到 Sepolia 或 Zama Devnet
- 📱 **移动友好** - 响应式设计,支持 320px - 768px 设备
- 🌐 **外部访问** - 开发服务器支持局域网访问

---

## 🎮 游戏玩法

1. **铸造雷神之锤** ⚡
   支付 ETH,获得雷神之锤 NFT (5个等级,价格 0.01 - 0.50 ETH)
   - 等级 1 (普通): 灰色锤子
   - 等级 2 (优良): 绿色锤子
   - 等级 3 (稀有): 蓝色锤子
   - 等级 4 (史诗): 紫色锤子 + 闪电特效
   - 等级 5 (传说): 金色锤子 + 闪电 + 能量粒子

2. **执行挖矿** ⛏️
   选择锤子和挖矿次数 (1/5/10/20/50),消耗耐久获得加密奖励

3. **领取奖励** 💰
   解密收益,铸造 GOLD 代币

4. **稀有掉落** 🎁
   史诗概率触发 5 种稀有物品 NFT

---

## 🚀 快速开始

### 5 分钟部署到 Sepolia

```bash
# 1. 克隆项目
git clone <your-repo>
cd zama_GoldmMint

# 2. 安装依赖
npm install

# 3. 配置环境
cp .env.example .env
# 编辑 .env 填入:
# - PRIVATE_KEY (从 MetaMask 导出,移除 0x)
# - SEPOLIA_RPC_URL (使用 Infura 或 Alchemy)
# - VITE_WALLETCONNECT_PROJECT_ID (从 https://cloud.walletconnect.com/ 获取)

# 4. 编译合约
npm run compile

# 5. 部署到 Sepolia
npm run deploy:sepolia

# 6. 启动前端 (支持外部访问)
cd frontend
npm install
npm run dev
# 访问: http://localhost:3000 (本地)
# 访问: http://your-ip:3000 (局域网)
```

**📖 详细指南:** 查看 [DEPLOYMENT.md](DEPLOYMENT.md) 了解 Ubuntu 服务器部署

---

## 📦 项目结构

```
zama_GoldmMint/
├── contracts/              # 智能合约 (4个核心合约)
│   ├── GoldToken.sol      # ERC20 游戏代币 (通缩机制)
│   ├── PickaxeNFT.sol     # ERC721 雷神之锤 NFT (FHE 加密幸运值)
│   ├── MiningEngine.sol   # FHE 挖矿引擎 (核心逻辑)
│   └── TreasureNFT.sol    # ERC1155 稀有物品 (5种类型)
│
├── frontend/              # React + TypeScript 前端
│   ├── src/
│   │   ├── components/    # UI 组件 (Button, Card, ThorHammer...)
│   │   ├── hooks/         # 自定义 Hooks (FHE 重加密)
│   │   ├── pages/         # 页面 (挖矿/铸造/背包/奖励)
│   │   ├── contracts/     # ABI 和合约地址配置
│   │   └── utils/         # FHE 工具 (fhevmjs)
│   └── vite.config.ts    # Vite 配置 (支持外部访问)
│
├── scripts/               # 部署和交互脚本
│   ├── deploy.js          # 完整部署流程
│   └── interact.js        # 交互演示
│
├── test/                  # 测试套件
│   └── MiningGame.test.js # 33+ 测试用例
│
├── hardhat.config.js      # Hardhat 配置 (Sepolia + Zama Devnet)
├── DEPLOYMENT.md          # Ubuntu 服务器部署指南
├── package.json           # 项目依赖和脚本
└── .env.example           # 环境变量模板
```

---

## 🔐 FHE 技术亮点

### 加密概率计算

```solidity
// 生成 0-99 加密随机数
euint8 roll = FHE.rem(FHE.randEuint8(), 100);

// 加密条件判断 (不泄露结果)
ebool isEpic = FHE.lt(roll, FHE.asEuint8(prob.epicRate));

// 加密条件选择奖励
euint32 reward = FHE.select(isEpic, epicReward, baseReward);
```

### 前端重加密 (一行代码解密)

```typescript
// 自动解密锄头幸运值
const { luck } = usePickaxeFullInfo(pickaxeId);

// 自动解密玩家收益和史诗掉落
const { earnings, epicDrops } = usePlayerMiningData(address);
```

**创新点:**
- ✅ `FHE.select` 条件累加 - 避免泄露是否掉落史诗
- ✅ 简化奖励方案 - 无需 Gateway 即可运行
- ✅ 混合隐私模型 - 公开规则 + 加密数据

---

## 🌐 支持的网络

| 网络 | Chain ID | RPC URL | FHE 支持 | 状态 |
|------|----------|---------|----------|------|
| Localhost | 31337 | http://127.0.0.1:8545 | ❌ | ✅ 开发测试 |
| **Zama Devnet** | **9000** | https://devnet.zama.ai | ✅ | ✅ **推荐** |
| Sepolia | 11155111 | https://sepolia.infura.io | ❌ | ⚠️ 不支持 FHE |

**📍 重要:**
- ✅ **Zama Devnet** 是唯一完全支持 FHE 的网络
- 🪙 **获取测试币:** [Zama Faucet](https://faucet.zama.ai)
- 🔍 **区块浏览器:** [Zama Explorer](https://explorer.devnet.zama.ai)

---

## 🧪 测试

### 运行测试套件

```bash
# 运行完整测试 (33+ 用例)
npm test

# 运行单个测试
npx hardhat test --grep "GoldToken"
```

### 本地交互测试

```bash
# 终端 1: 启动本地节点
npm run node

# 终端 2: 部署合约
npm run deploy:local

# 终端 3: 运行交互脚本
npm run interact:local
```

**测试覆盖:**
- ✅ GoldToken: 5 个用例 (铸造、燃烧、供应上限)
- ✅ PickaxeNFT: 8 个用例 (等级、耐久、修理)
- ✅ MiningEngine: 6 个用例 (挖矿、奖励、统计)
- ✅ TreasureNFT: 5 个用例 (铸造、批量、查询)
- ✅ 集成测试: 9 个用例 (完整游戏流程)

---

## 🎨 前端功能

### 已实现页面

- ✅ **首页** - 项目介绍和特性展示
- ✅ **铸造页** - 铸造 5 个等级的雷神之锤 NFT (带动画特效)
- ✅ **挖矿页** - 选择锤子和挖矿次数执行挖矿
- ✅ **背包页** - 查看所有 NFT 和代币余额
- ✅ **奖励页** - 领取加密收益和稀有物品

### 雷神之锤设计特性

- ⚡ **5 个等级颜色系统**: 灰/绿/蓝/紫/金
- ✨ **动画特效**:
  - 等级 4+: 闪电环绕动画
  - 等级 5: 能量粒子爆发 + 金色光晕
  - 全等级: 悬浮动画和光效
- 🎨 **SVG 精细设计**:
  - 立体锤头 + 侧翼装饰
  - 雷纹刻印
  - 木质锤柄 + 金属缠绕
  - 底部宝石装饰

### 技术特性

- ✅ 移动端完美适配 (320px - 768px)
- ✅ 暗色主题 (黄金 + 紫色配色)
- ✅ FHE 重加密集成 (fhevmjs)
- ✅ 钱包连接 (MetaMask/WalletConnect)
- ✅ 实时数据刷新 (TanStack Query)
- ✅ 响应式导航栏 (汉堡菜单)
- ✅ 外部访问支持 (局域网可访问)
- ✅ Framer Motion 动画库

---

## 🔧 技术栈

### 智能合约

- **Solidity** 0.8.24 (Cancun EVM)
- **Hardhat** 2.22.0 (开发框架)
- **@fhevm/solidity** ^0.8.0 (FHE 库)
- **@openzeppelin/contracts** ^5.4.0 (安全合约库)
- **ethers.js** ^6.15.0

**编译配置:**
- `viaIR: true` - 解决 FHE 合约栈深度问题
- `optimizer.runs: 200` - 平衡部署和运行 Gas
- `evmVersion: "cancun"` - 最新 EVM 版本

### 前端

- **React** 18 + **TypeScript** 5.2
- **Vite** 5.0 (构建工具,支持外部访问)
- **Wagmi** v2 + **RainbowKit** (钱包连接)
- **fhevmjs** ^0.5.8 (FHE 重加密)
- **TanStack Query** v5 (状态管理)
- **Tailwind CSS** 3.3 (样式)
- **Framer Motion** ^11.0 (动画库)

---

## 📊 项目状态

### 完成度: **99%** 🎉

| 功能模块 | 进度 | 状态 |
|---------|------|------|
| 核心智能合约 (4个) | 100% | ✅ 已完成 |
| 测试套件 (33+ 用例) | 100% | ✅ 全部通过 |
| FHE 重加密功能 | 100% | ✅ 已集成 |
| 雷神之锤 UI 设计 | 100% | ✅ 已完成 |
| 移动端适配 | 100% | ✅ 已优化 |
| 外部访问支持 | 100% | ✅ 已配置 |
| Sepolia 部署 | 100% | ✅ 已部署 |
| Ubuntu 部署文档 | 100% | ✅ 已完成 |
| Zama Devnet 配置 | 100% | ✅ 已配置 |

**当前状态:** 已部署到 Sepolia 测试网,可完整体验所有功能

---

## 📚 完整文档

### 入门文档
- 📖 [Ubuntu 部署指南](DEPLOYMENT.md) - 服务器部署完整流程
- 📖 [快速开始](QUICK_START.md) - 5分钟部署指南 (如果存在)
- 📖 [Zama Devnet 部署](ZAMA_DEVNET_DEPLOYMENT.md) - Zama 详细流程 (如果存在)

### 开发文档
- 📖 [开发指南](CLAUDE.md) - 架构和最佳实践 (如果存在)
- 📖 [项目总结](PROJECT_SUMMARY.md) - 技术亮点和完成度 (如果存在)
- 📖 [FHE 使用](frontend/FHE_USAGE.md) - fhevmjs 重加密指南 (如果存在)

### 已部署合约地址 (Sepolia)
- **GoldToken**: `0x2cC0ACD868F5013429Cd610Ec1E296ab2888bb7D`
- **PickaxeNFT**: `0xd1c6187E189f4CFaae36743ba1EE0d4cCf6e7C1c`
- **MiningEngine**: `0x8511403A10892B8F7C4fFE07c2724cC7C3201C5b`
- **TreasureNFT**: `0x5eeC686112345485Bf23754679aCcd02aeE36D9B`

---

## 💻 开发命令

### 后端命令

```bash
# 编译合约
npm run compile

# 清理缓存
npm run clean

# 运行测试
npm test

# 启动本地节点
npm run node

# 部署
npm run deploy:local    # 本地 Hardhat
npm run deploy:zama     # Zama Devnet
npm run deploy:sepolia  # Sepolia 测试网

# 交互
npm run interact:local  # 本地交互
npm run interact:zama   # Zama Devnet 交互
```

### 前端命令

```bash
cd frontend

# 安装依赖
npm install

# 开发服务器 (支持外部访问)
npm run dev
# 本地访问: http://localhost:3000
# 局域网访问: http://your-ip:3000

# 生产构建
npm run build

# 预览构建
npm run preview

# 代码检查
npm run lint
```

---

## 🛠️ 开发指南

### 自定义雷神之锤组件

在您的页面中使用雷神之锤图标:

```tsx
import { ThorHammer, ThorHammerIcon } from '@/components/ThorHammer';

// 完整版锤子 (带所有动画特效)
<ThorHammer
  className="w-24 h-24"
  level={5}           // 等级 1-5
  animated={true}     // 启用悬浮动画
  glowing={true}      // 启用光晕效果
/>

// 简化版小图标
<ThorHammerIcon
  className="w-6 h-6"
  level={3}
/>
```

### 添加新的挖矿概率规则

在 `contracts/MiningEngine.sol`:

```solidity
// 1. 更新概率表
function _initializeProbabilityTable() private {
    probabilityTable[6] = ProbabilityTier({
        epicRate: 30,
        rareRate: 50,
        commonRate: 20
    });
}

// 2. 更新等级配置 (在 PickaxeNFT)
levelConfigs[6] = LevelConfig({
    mintPrice: 1 ether,
    durabilityMax: 600,
    efficiency: 60,
    luckMin: 50,
    luckMax: 100
});
```

### 集成新的 FHE 功能

```typescript
// frontend/src/hooks/useYourFeature.ts
import { useReencrypt } from './useFHE';

export function useDecryptedYourData(encryptedValue, contractAddress) {
  const { decryptedValue, isLoading } = useReencrypt(
    contractAddress,
    encryptedValue,
    true // enabled
  );

  return { yourData: decryptedValue, isLoading };
}
```

---

## 🔒 安全注意事项

1. **私钥管理**
   - ❌ 不要在主网使用测试钱包
   - ❌ 不要提交 `.env` 到 Git
   - ✅ 使用环境变量存储敏感信息

2. **FHE 数据保护**
   - ✅ 只有数据所有者才能解密自己的数据
   - ✅ 使用 `FHE.allow()` 授权访问
   - ✅ 验证 EIP712 签名防止重放攻击

3. **智能合约安全**
   - ✅ ReentrancyGuard 防护重入攻击
   - ✅ Ownable 权限管理
   - ✅ SafeMath (Solidity 0.8+)
   - ⚠️ 建议主网前进行安全审计

---

## 🤝 贡献指南

欢迎 PR 和 Issue!

### 开发规范

```bash
# 提交前检查
npm run compile  # 编译通过
npm test         # 测试通过

# 提交格式
feat: 添加新功能
fix: 修复 bug
docs: 更新文档
test: 添加测试
refactor: 重构代码
```

### 代码规范

- Solidity: 遵循 [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- TypeScript: 使用 ESLint 和 Prettier
- 注释: 使用 NatSpec (合约) 和 JSDoc (前端)

---

## 📄 许可证

MIT License

---

## 🙏 致谢

感谢以下项目和团队:

- **[Zama](https://zama.ai)** - 提供 FHE 技术和 fhEVM
- **[OpenZeppelin](https://openzeppelin.com)** - 安全的智能合约库
- **[Hardhat](https://hardhat.org)** - 以太坊开发框架
- **[Wagmi](https://wagmi.sh)** - React Hooks for Ethereum
- **[Vite](https://vitejs.dev)** - 极速构建工具

---

## 🔗 相关链接

### 项目链接
- **GitHub 仓库:** [Your Repo]
- **在线演示:** [Live Demo] (部署后更新)
- **文档站点:** [Docs Site] (可选)

### Zama 资源
- **官方文档:** https://docs.zama.ai/fhevm
- **Discord 社区:** https://discord.gg/fhe-org
- **GitHub:** https://github.com/zama-ai/fhevm
- **Devnet 浏览器:** https://explorer.devnet.zama.ai
- **测试币水龙头:** https://faucet.zama.ai

### 开发资源
- **Hardhat 文档:** https://hardhat.org/docs
- **fhevmjs 文档:** https://github.com/zama-ai/fhevmjs

---

## 📈 路线图

### ✅ 已完成 (v1.0)
- ✅ 核心智能合约开发
- ✅ FHE 加密功能集成
- ✅ 完整前端应用
- ✅ 雷神之锤 UI 设计
- ✅ 移动端适配
- ✅ Sepolia 测试网部署
- ✅ Ubuntu 服务器部署文档

### 🎯 进行中 (v1.1)
- 🎯 社区测试和反馈
- 🎯 性能优化

### 🔜 计划中 (v2.0)
- 🔜 部署到 Zama Devnet (真正的 FHE)
- 🔜 Gateway 异步解密集成
- 🔜 排行榜系统
- 🔜 成就系统
- 🔜 社交功能
- 🔜 经济模型优化

### 🚀 未来展望 (v3.0)
- 🚀 安全审计
- 🚀 主网部署
- 🚀 跨链桥接
- 🚀 移动 APP

---


## 🎮 开始体验

**准备好体验雷神之锤挖矿游戏了吗?**

### 选项 1: 在线体验 (Sepolia 测试网)
1. 🦊 安装 MetaMask 并连接 Sepolia 网络
2. 🪙 获取 [Sepolia 测试币](https://sepoliafaucet.com/)
3. 🌐 访问在线演示 (部署后更新)
4. ⚡ 开始铸造雷神之锤!

### 选项 2: 本地部署
1. 📖 阅读 [快速开始指南](#-快速开始)
2. 🚀 按照步骤部署到本地或测试网
3. 🎮 启动前端并开始游戏

### 选项 3: 服务器部署
1. 📖 查看 [DEPLOYMENT.md](DEPLOYMENT.md)
2. 🖥️ 在 Ubuntu 服务器上部署
3. 🌍 通过域名访问

```bash
# 快速开始命令
npm install
npm run compile
npm run deploy:sepolia
cd frontend && npm install && npm run dev
```

---

<div align="center">

**创建时间:** 2025-10-05
**最后更新:** 2025-10-06
**维护者:** Zama Mining Game Team

**⭐ 如果这个项目对您有帮助,请给个 Star!**

Made with ⚡ using Zama FHE Technology & Thor's Hammer Design

</div>
