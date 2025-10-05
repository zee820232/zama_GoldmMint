# 🏔️ Zama Mining Game

基于 **Zama FHE (全同态加密)** 技术的完全保密链上挖矿游戏。

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-green.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.22.0-yellow.svg)](https://hardhat.org/)

## ✨ 核心特性

- 🔐 **完全保密**: 幸运值、收益、掉落记录全部 FHE 加密
- 🎲 **公平随机**: FHE 随机数生成,无法预测或操纵
- ⚡ **性能优化**: viaIR 编译器,移动端完美适配
- 🎮 **即插即用**: 完整的前后端,一键部署到 Zama Devnet

## 🚀 快速开始

### 5 分钟部署

```bash
# 1. 克隆项目
git clone <your-repo>
cd zama_GoldmMint

# 2. 配置环境
cp .env.example .env
# 编辑 .env 填入 PRIVATE_KEY 和 VITE_WALLETCONNECT_PROJECT_ID

# 3. 部署合约
npm install
npm run compile
npm run deploy:zama

# 4. 启动前端
cd frontend
npm install
npm run dev
```

**详细指南:** 查看 [QUICK_START.md](QUICK_START.md)

## 📦 项目结构

```
zama_GoldmMint/
├── contracts/              # 智能合约 (4个核心合约)
│   ├── GoldToken.sol      # ERC20 游戏代币
│   ├── PickaxeNFT.sol     # ERC721 锄头 NFT (FHE 幸运值)
│   ├── MiningEngine.sol   # FHE 挖矿引擎
│   └── TreasureNFT.sol    # ERC1155 稀有物品
├── frontend/              # React + TypeScript 前端
│   ├── src/
│   │   ├── components/    # UI 组件
│   │   ├── hooks/         # FHE Hooks (重加密)
│   │   ├── pages/         # 页面 (挖矿/铸造/背包)
│   │   └── utils/         # FHE 工具 (fhevmjs)
├── scripts/               # 部署和交互脚本
├── test/                  # 33+ 测试用例
└── hardhat.config.js      # Hardhat 配置 (Zama Devnet)
```

## 🎮 游戏玩法

1. **铸造锄头** → 支付 ETH,获得 NFT 锄头 (5个等级)
2. **执行挖矿** → 消耗耐久,获得加密奖励 (FHE 随机)
3. **领取奖励** → 解密收益,铸造 GOLD 代币
4. **稀有掉落** → 史诗概率触发 5 种稀有物品

## 🔐 FHE 技术亮点

### 加密概率计算
```solidity
// 生成 0-99 随机数 (完全加密)
euint8 roll = FHE.rem(FHE.randEuint8(), 100);

// 加密条件判断
ebool isEpic = FHE.lt(roll, FHE.asEuint8(prob.epicRate));

// 加密奖励选择
euint32 reward = FHE.select(isEpic, epicReward, baseReward);
```

### 前端重加密
```typescript
// 自动解密锄头幸运值
const { luck } = usePickaxeFullInfo(pickaxeId);

// 自动解密玩家收益
const { earnings, epicDrops } = usePlayerMiningData(address);
```

## 🌐 支持的网络

| 网络 | Chain ID | RPC URL | 状态 |
|------|----------|---------|------|
| Localhost | 31337 | http://127.0.0.1:8545 | ✅ 开发 |
| **Zama Devnet** | **9000** | https://devnet.zama.ai | ✅ **推荐** |
| Sepolia | 11155111 | https://sepolia.infura.io | ⚠️ 不支持 FHE |

**获取测试币:** [Zama Faucet](https://faucet.zama.ai)

## 📚 文档

- [快速开始](QUICK_START.md) - 5分钟部署指南
- [完整部署](ZAMA_DEVNET_DEPLOYMENT.md) - Zama Devnet 详细流程
- [开发指南](CLAUDE.md) - 架构和最佳实践
- [项目总结](PROJECT_SUMMARY.md) - 技术亮点和完成度
- [FHE 使用](frontend/FHE_USAGE.md) - fhevmjs 重加密指南

## 🧪 测试

```bash
# 运行完整测试套件 (33+ 用例)
npm test

# 本地交互测试
npm run node          # 新终端
npm run deploy:local  # 部署
npm run interact:local
```

## 🎨 前端功能

- ✅ 移动端完美适配 (320px - 768px)
- ✅ 暗色主题 (黄金配色)
- ✅ FHE 重加密集成
- ✅ 钱包连接 (MetaMask/WalletConnect)
- ✅ 实时数据刷新

## 🔧 技术栈

### 智能合约
- Solidity 0.8.24 + Hardhat 2.22
- @fhevm/solidity ^0.8.0 (FHE 库)
- @openzeppelin/contracts ^5.4.0

### 前端
- React 18 + TypeScript + Vite
- Wagmi v2 + RainbowKit (钱包)
- fhevmjs ^0.5.0 (FHE 重加密)
- Tailwind CSS (样式)

## 📊 项目状态

**完成度:** 98% 🎉

| 功能模块 | 状态 |
|---------|------|
| 核心智能合约 (4个) | ✅ 100% |
| 测试套件 (33+ 用例) | ✅ 100% |
| FHE 重加密功能 | ✅ 100% |
| 移动端适配 | ✅ 100% |
| Zama Devnet 配置 | ✅ 100% |
| 部署文档 | ✅ 100% |
| Gateway 集成 | ⏸️ 可选 |
| 安全审计 | ⏸️ 待进行 |

## 🤝 贡献

欢迎 PR 和 Issue!

开发规范:
```bash
# 编码前
npm run compile  # 编译检查
npm test         # 运行测试

# 提交前
git add .
npm run compile  # 再次确认
```

## 📄 许可证

MIT License

## 🙏 致谢

- [Zama](https://zama.ai) - FHE 技术支持
- [OpenZeppelin](https://openzeppelin.com) - 安全合约库
- [Hardhat](https://hardhat.org) - 开发框架

## 🔗 链接

- **项目主页:** [GitHub Repo]
- **在线演示:** [Live Demo] (部署后更新)
- **Zama 文档:** https://docs.zama.ai/fhevm
- **Discord 社区:** https://discord.gg/fhe-org

---

**创建时间:** 2025-10-05
**最后更新:** 2025-10-05
**维护者:** Zama Mining Game Team

🎮 **准备好体验完全保密的链上游戏了吗?** [开始部署 →](QUICK_START.md)
