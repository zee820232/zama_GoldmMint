# 🏔️ Zama Mining Game

> 基于 **Zama FHE (全同态加密)** 技术的完全保密链上挖矿游戏

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-green.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.22.0-yellow.svg)](https://hardhat.org/)
[![Progress](https://img.shields.io/badge/Progress-98%25-brightgreen.svg)]()

---

## ✨ 核心特性

- 🔐 **完全保密** - 幸运值、收益、掉落记录全部 FHE 加密存储
- 🎲 **公平随机** - FHE 随机数生成,无法预测或操纵
- ⚡ **性能优化** - viaIR 编译器优化,移动端完美适配
- 🎮 **即插即用** - 完整的前后端,一键部署到 Zama Devnet
- 📱 **移动友好** - 响应式设计,支持 320px - 768px 设备

---

## 🎮 游戏玩法

1. **铸造锄头** 💎
   支付 ETH,获得 NFT 锄头 (5个等级,价格 0.01 - 0.50 ETH)

2. **执行挖矿** ⛏️
   消耗耐久,获得加密奖励 (FHE 随机概率计算)

3. **领取奖励** 💰
   解密收益,铸造 GOLD 代币

4. **稀有掉落** 🎁
   史诗概率触发 5 种稀有物品 NFT

---

## 🚀 快速开始

### 5 分钟部署到 Zama Devnet

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
# - VITE_WALLETCONNECT_PROJECT_ID (从 https://cloud.walletconnect.com/ 获取)

# 4. 编译合约
npm run compile

# 5. 部署到 Zama Devnet
npm run deploy:zama

# 6. 启动前端
cd frontend
npm install
npm run dev
```

**📖 详细指南:** 查看 [QUICK_START.md](QUICK_START.md)

---

## 📦 项目结构

```
zama_GoldmMint/
├── contracts/              # 智能合约 (4个核心合约)
│   ├── GoldToken.sol      # ERC20 游戏代币 (通缩机制)
│   ├── PickaxeNFT.sol     # ERC721 锄头 NFT (FHE 加密幸运值)
│   ├── MiningEngine.sol   # FHE 挖矿引擎 (核心逻辑)
│   └── TreasureNFT.sol    # ERC1155 稀有物品 (5种类型)
│
├── frontend/              # React + TypeScript 前端
│   ├── src/
│   │   ├── components/    # UI 组件 (Button, Card, PickaxeCard...)
│   │   ├── hooks/         # 自定义 Hooks (FHE 重加密)
│   │   ├── pages/         # 页面 (挖矿/铸造/背包/奖励)
│   │   ├── contracts/     # ABI 和合约地址配置
│   │   └── utils/         # FHE 工具 (fhevmjs)
│   └── package.json
│
├── scripts/               # 部署和交互脚本
│   ├── deploy.js          # 完整部署流程
│   └── interact.js        # 交互演示
│
├── test/                  # 测试套件
│   └── MiningGame.test.js # 33+ 测试用例
│
├── hardhat.config.js      # Hardhat 配置 (Zama Devnet)
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
- ✅ **铸造页** - 铸造 5 个等级的锄头 NFT
- ✅ **挖矿页** - 选择锄头执行挖矿
- ✅ **背包页** - 查看所有 NFT 和代币余额
- ✅ **奖励页** - 领取加密收益和稀有物品

### 技术特性

- ✅ 移动端完美适配 (320px - 768px)
- ✅ 暗色主题 (黄金配色)
- ✅ FHE 重加密集成 (fhevmjs)
- ✅ 钱包连接 (MetaMask/WalletConnect)
- ✅ 实时数据刷新 (TanStack Query)
- ✅ 响应式导航栏 (汉堡菜单)

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
- **Vite** 5.0 (构建工具)
- **Wagmi** v2 + **RainbowKit** (钱包连接)
- **fhevmjs** ^0.5.0 (FHE 重加密)
- **TanStack Query** v5 (状态管理)
- **Tailwind CSS** 3.3 (样式)

---

## 📊 项目状态

### 完成度: **98%** 🎉

| 功能模块 | 进度 | 状态 |
|---------|------|------|
| 核心智能合约 (4个) | 100% | ✅ 已完成 |
| 测试套件 (33+ 用例) | 100% | ✅ 全部通过 |
| FHE 重加密功能 | 100% | ✅ 已集成 |
| 移动端适配 | 100% | ✅ 已优化 |
| Zama Devnet 配置 | 100% | ✅ 已配置 |
| 部署文档 | 100% | ✅ 已完成 |
| 实际部署 | 0% | ⏸️ 待执行 |
| Gateway 集成 | 0% | ⏸️ 可选 |
| 安全审计 | 0% | ⏸️ 待进行 |

**下一步:** 部署到 Zama Devnet (只需测试币!)

---

## 📚 完整文档

### 入门文档
- 📖 [快速开始](QUICK_START.md) - 5分钟部署指南
- 📖 [完整部署](ZAMA_DEVNET_DEPLOYMENT.md) - Zama Devnet 详细流程 (10章节)
- 📖 [配置总结](DEPLOYMENT_SUMMARY.md) - 所有修改的文件和参数

### 开发文档
- 📖 [开发指南](CLAUDE.md) - 架构和最佳实践
- 📖 [项目总结](PROJECT_SUMMARY.md) - 技术亮点和完成度
- 📖 [FHE 使用](frontend/FHE_USAGE.md) - fhevmjs 重加密指南

### 其他文档
- 📖 [Gateway 集成](GATEWAY_INTEGRATION_GUIDE.md) - 异步解密方案
- 📖 [本地测试说明](LOCAL_TESTING_NOTE.md) - FHE 环境限制
- 📖 [完成报告](COMPLETION_REPORT.md) - 详细完成清单

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

# 开发服务器
npm run dev

# 生产构建
npm run build

# 预览构建
npm run preview

# 代码检查
npm run lint
```

---

## 🛠️ 开发指南

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
- **Wagmi 文档:** https://wagmi.sh
- **fhevmjs 文档:** https://github.com/zama-ai/fhevmjs
- **Tailwind CSS:** https://tailwindcss.com

---

## 📈 路线图

### ✅ 已完成 (v1.0)
- ✅ 核心智能合约开发
- ✅ FHE 加密功能集成
- ✅ 完整前端应用
- ✅ 移动端适配
- ✅ Zama Devnet 配置

### 🎯 进行中 (v1.1)
- 🎯 部署到 Zama Devnet
- 🎯 社区测试和反馈

### 🔜 计划中 (v2.0)
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

## 💬 联系方式

- **GitHub Issues:** [项目 Issues](https://github.com/your-repo/issues)
- **Email:** your-email@example.com
- **Twitter:** [@your_handle](https://twitter.com/your_handle)
- **Discord:** [Join our server](https://discord.gg/your-invite)

---

## 🎮 开始体验

**准备好体验完全保密的链上游戏了吗?**

1. 📖 阅读 [快速开始指南](QUICK_START.md)
2. 🪙 获取 [Zama 测试币](https://faucet.zama.ai)
3. 🚀 开始部署!

```bash
npm run deploy:zama
```

---

<div align="center">

**创建时间:** 2025-10-05
**最后更新:** 2025-10-05
**维护者:** Zama Mining Game Team

**⭐ 如果这个项目对您有帮助,请给个 Star!**

Made with ❤️ using Zama FHE Technology

</div>
