# 🎮 Zama Mining Game

<div align="center">

![Zama FHE](https://img.shields.io/badge/Powered%20by-Zama%20FHE-blue)
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-green)
![React](https://img.shields.io/badge/React-18-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

**基于 Zama FHE 技术的完全保密链上挖矿游戏**

[项目概览](#-项目概览) •
[快速开始](#-快速开始) •
[文档](#-文档) •
[技术栈](#-技术栈) •
[演示](#-演示)

</div>

---

## 🌟 项目概览

Zama Mining Game 是一个创新的区块链游戏,使用 **Zama 全同态加密 (FHE)** 技术实现完全保密的链上游戏逻辑:

- 🔐 **完全保密** - 幸运值、收益、掉落记录全部加密
- 🎲 **公平随机** - 链上 FHE 随机数,无法预测或操纵
- ⚖️ **透明规则** - 智能合约公开可验证
- 🎁 **稀有物品** - ERC1155 稀有物品系统

### 核心玩法

1. **铸造锄头 NFT** (5 个等级)
2. **执行挖矿** (消耗耐久,获得加密奖励)
3. **领取 GOLD 代币** (解密收益)
4. **获取稀有物品** (史诗掉落)
5. **修复锄头** (GOLD 代币支付,30% 通缩)

---

## 🚀 快速开始

### ⚠️ 重要提示

**本项目使用 Zama FHE 技术,本地测试受限。** 请查看 [LOCAL_TESTING_NOTE.md](./LOCAL_TESTING_NOTE.md) 了解详情。

推荐使用 **Zama Devnet** 进行完整测试。

### 前置要求

- Node.js >= 18.x
- npm >= 9.x

### 安装

```bash
# 克隆仓库
git clone https://github.com/your-username/zama-mining-game.git
cd zama-mining-game

# 安装依赖
npm install
```

### 本地开发

```bash
# 1. 编译智能合约
npm run compile

# 2. 启动本地节点 (新终端)
npm run node

# 3. 部署合约 (新终端)
npm run deploy:local

# 4. 运行交互测试
npm run interact

# 5. 运行单元测试
npm test
```

### 前端开发

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

---

## 📁 项目结构

```
zama-mining-game/
├── contracts/              # 智能合约
│   ├── GoldToken.sol      # ERC20 游戏代币
│   ├── PickaxeNFT.sol     # ERC721 锄头 NFT
│   ├── MiningEngine.sol   # FHE 挖矿引擎
│   └── TreasureNFT.sol    # ERC1155 稀有物品
│
├── scripts/               # 部署和测试脚本
│   ├── deploy.js          # 部署脚本
│   └── interact.js        # 交互演示
│
├── test/                  # 测试文件
│   └── MiningGame.test.js # 33+ 测试用例
│
├── frontend/              # React 前端
│   ├── src/
│   │   ├── components/    # UI 组件
│   │   ├── pages/         # 页面
│   │   ├── hooks/         # 自定义 Hooks
│   │   └── contracts/     # ABI 和地址
│   └── package.json
│
└── docs/                  # 项目文档
    ├── zama-mining-game-plan.md
    ├── PHASE1_COMPLETED.md
    ├── PHASE2_COMPLETED.md
    ├── GATEWAY_INTEGRATION_GUIDE.md
    └── PROJECT_SUMMARY.md
```

---

## 📚 文档

### 核心文档

- [完整开发计划](./zama-mining-game-plan.md) - 1000+ 行详细设计文档
- [第一阶段报告](./PHASE1_COMPLETED.md) - 核心合约开发
- [第二阶段报告](./PHASE2_COMPLETED.md) - 稀有物品系统
- [Gateway 集成指南](./GATEWAY_INTEGRATION_GUIDE.md) - FHE 解密方案
- [项目总结](./PROJECT_SUMMARY.md) - 完整项目概览
- [前端文档](./frontend/README.md) - 前端开发指南
- [UI 动画系统](./frontend/UI_ANIMATION_COMPLETED.md) - 完整动画系统文档

### 快速链接

- [智能合约 API](./docs/contracts-api.md)
- [部署指南](./docs/deployment.md)
- [测试指南](./docs/testing.md)

---

## 🛠 技术栈

### 智能合约

- **Solidity 0.8.24** - 智能合约语言
- **Hardhat 2.22.0** - 开发框架
- **@fhevm/solidity 0.8.0** - Zama FHE 库
- **OpenZeppelin 5.4.0** - 安全合约库

### 前端

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Wagmi v2** - 以太坊 React Hooks
- **RainbowKit** - 钱包连接
- **fhevmjs** - Zama FHE 客户端
- **Tailwind CSS** - 样式框架

---

## 🎯 核心特性

### 智能合约

#### 1. GoldToken (ERC20)
- ✅ 最大供应量 10M
- ✅ 授权铸造机制
- ✅ 通缩机制 (修复时 30% 燃烧)

#### 2. PickaxeNFT (ERC721)
- ✅ 5 个等级配置
- ✅ FHE 加密幸运值
- ✅ 耐久系统
- ✅ 修复功能

#### 3. MiningEngine
- ✅ FHE 随机数生成
- ✅ 加密概率计算
- ✅ 加密收益累加
- ✅ 简化版奖励领取
- ✅ 稀有掉落系统

#### 4. TreasureNFT (ERC1155)
- ✅ 5 种稀有物品
- ✅ 批量操作
- ✅ 销毁机制

### 前端应用

- ✅ 钱包连接 (RainbowKit)
- ✅ 完整动画系统 (50+ CSS 动画)
- ✅ 挖矿界面 (带震动和光效)
- ✅ 铸造页面 (深色主题 + 交错动画)
- ✅ 背包页面
- ✅ 奖励页面
- ✅ NFT 展示 (等级配色系统)

---

## 🧪 测试

### 运行测试

```bash
# 运行所有测试
npm test

# 查看测试覆盖率
npm run test:coverage
```

### 测试覆盖

- ✅ GoldToken 测试 (5 个用例)
- ✅ PickaxeNFT 测试 (8 个用例)
- ✅ MiningEngine 测试 (6 个用例)
- ✅ TreasureNFT 测试 (5 个用例)
- ✅ 集成测试 (3+ 个用例)

**总计**: 33+ 测试用例

---

## 📊 项目状态

### 已完成 ✅

- [x] 4 个核心智能合约
- [x] 完整部署脚本
- [x] 33+ 单元测试
- [x] 交互演示脚本
- [x] React 前端框架
- [x] 钱包集成
- [x] 完整动画系统 (50+ CSS 动画)
- [x] 5 个前端页面 (首页/挖矿/铸造/背包/奖励)
- [x] 等级配色和视觉效果
- [x] 完善的项目文档

### 进行中 ⏸️

- [ ] fhevmjs 重加密功能
- [ ] 移动端适配优化

### 待开始 🔜

- [ ] Zama Gateway 集成
- [ ] 测试网部署
- [ ] 主网准备
- [ ] 安全审计

**完成度**: 90%

---

## 🎨 演示

### 智能合约交互

```bash
# 运行交互演示
npm run interact
```

**演示流程**:
1. ✅ 铸造锄头 NFT
2. ✅ 执行 5 次挖矿
3. ⚠️ 查看加密收益 (需前端)
4. ⚠️ 领取金币奖励
5. ⚠️ 领取稀有物品

### 前端界面

```bash
cd frontend && npm run dev
```

访问 `http://localhost:3000` 查看:
- ✅ 项目介绍首页
- ✅ 挖矿操作界面
- ✅ 钱包连接

---

## 🔐 安全性

### 已实现

- ✅ FHE 加密保护
- ✅ 重入攻击防护 (ReentrancyGuard)
- ✅ 权限验证 (Ownable)
- ✅ 整数溢出检查 (Solidity 0.8+)

### 待审计

- ⚠️ Gateway 回调安全
- ⚠️ 经济模型平衡
- ⚠️ Gas 优化

---

## 🤝 贡献

欢迎贡献!请查看 [贡献指南](./CONTRIBUTING.md)

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](./LICENSE) 文件了解详情

---

## 🙏 致谢

- [Zama](https://zama.ai) - FHE 技术提供
- [OpenZeppelin](https://openzeppelin.com) - 安全合约库
- [Hardhat](https://hardhat.org) - 开发框架
- [Wagmi](https://wagmi.sh) - React Hooks
- [Vite](https://vitejs.dev) - 构建工具

---

## 📞 联系

- **问题反馈**: [GitHub Issues](https://github.com/your-username/zama-mining-game/issues)
- **讨论**: [GitHub Discussions](https://github.com/your-username/zama-mining-game/discussions)

---

<div align="center">

**⭐ 如果这个项目对你有帮助,请给个 Star!**

Made with ❤️ using Zama FHE

</div>
