# 完整部署指南

本文档提供 Zama Mining Game 的详细部署步骤,包括本地测试、测试网部署和主网准备。

---

## 📋 目录

- [环境准备](#环境准备)
- [本地部署](#本地部署)
- [Sepolia 测试网部署](#sepolia-测试网部署)
- [Zama Devnet 部署](#zama-devnet-部署)
- [前端部署](#前端部署)
- [验证合约](#验证合约)
- [常见问题](#常见问题)

---

## 🔧 环境准备

### 必需工具

```bash
# Node.js (>=18.x)
node --version

# npm (>=9.x)
npm --version

# Git
git --version
```

### 安装项目依赖

```bash
# 克隆项目
git clone <your-repo>
cd zama-mining-game

# 安装合约依赖
npm install

# 安装前端依赖
cd frontend
npm install
cd ..
```

### 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件
nano .env
```

**必填字段**:
```env
# 部署账户私钥 (不要泄露!)
PRIVATE_KEY=your_private_key_here

# Sepolia RPC (从 Infura 或 Alchemy 获取)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_API_KEY

# Etherscan API (用于合约验证)
ETHERSCAN_API_KEY=your_etherscan_api_key
```

---

## 🏠 本地部署

### 1. 编译合约

```bash
npm run compile
```

**预期输出**:
```
Compiled 11 Solidity files successfully
```

### 2. 运行测试

```bash
npm test
```

**预期输出**:
```
  ✓ 33 passing tests
```

### 3. 启动本地节点

```bash
# 在新终端中运行
npm run node
```

**预期输出**:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

### 4. 部署到本地网络

```bash
# 在另一个终端中
npm run deploy:local
```

**预期输出**:
```
🚀 开始部署 Zama 矿工应用合约...

✅ GoldToken 部署成功: 0x5FbDB...
✅ PickaxeNFT 部署成功: 0xe7f17...
✅ MiningEngine 部署成功: 0x9fE46...
✅ TreasureNFT 部署成功: 0xCf7Ed...
✅ 权限配置完成

📋 部署成功!
💾 部署信息已保存
```

### 5. 测试交互

```bash
npm run interact
```

---

## 🌐 Sepolia 测试网部署

### 准备工作

1. **获取测试 ETH**
   - 访问 [Sepolia Faucet](https://sepoliafaucet.com/)
   - 或 [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
   - 获取至少 0.5 ETH 用于部署

2. **配置 RPC 节点**
   - 注册 [Infura](https://infura.io/) 或 [Alchemy](https://www.alchemy.com/)
   - 获取 Sepolia RPC URL
   - 更新 `.env` 文件

3. **准备私钥**
   ```bash
   # 从 MetaMask 导出私钥
   # Settings -> Security & Privacy -> Reveal Private Key
   ```

### 部署步骤

#### 1. 验证环境变量

```bash
# 检查 .env 配置
cat .env | grep SEPOLIA
```

#### 2. 检查余额

```bash
# 使用 Hardhat console
npx hardhat console --network sepolia

# 在 console 中
const [deployer] = await ethers.getSigners();
console.log("Deployer:", deployer.address);
console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));
```

#### 3. 部署合约

```bash
npm run deploy:sepolia
```

**预期输出**:
```
📍 部署地址: 0x...
💰 账户余额: 1.5 ETH

1️⃣  部署 GoldToken...
✅ GoldToken 部署成功: 0x...

2️⃣  部署 PickaxeNFT...
✅ PickaxeNFT 部署成功: 0x...

3️⃣  部署 MiningEngine...
✅ MiningEngine 部署成功: 0x...

4️⃣  部署 TreasureNFT...
✅ TreasureNFT 部署成功: 0x...

5️⃣  配置合约权限...
✅ 权限配置完成

📋 部署成功!
💾 部署信息已保存到 deployment-sepolia.json
```

#### 4. 保存部署信息

```bash
cat deployment-sepolia.json
```

复制合约地址,更新前端配置:
```typescript
// frontend/src/contracts/addresses.ts
export const CONTRACT_ADDRESSES: ContractAddresses = {
  goldToken: '0x...', // 从 deployment-sepolia.json 复制
  pickaxeNFT: '0x...',
  miningEngine: '0x...',
  treasureNFT: '0x...',
};
```

---

## 🔐 Zama Devnet 部署

### 准备工作

1. **申请 Zama Devnet 访问**
   - 访问 https://fhevm.zama.ai
   - 填写开发者申请表
   - 等待审批通过

2. **获取测试代币**
   - 使用 Zama Devnet 水龙头
   - 或通过官方渠道申请

3. **配置网络**

编辑 `hardhat.config.js`:
```javascript
zamaDevnet: {
  type: "http",
  url: process.env.ZAMA_RPC_URL || "https://devnet.zama.ai",
  accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
  chainId: 8009
}
```

### 部署步骤

```bash
# 1. 添加 Zama 网络到 package.json
# 添加脚本: "deploy:zama": "hardhat run scripts/deploy.js --network zamaDevnet"

# 2. 部署
npm run deploy:zama

# 3. 验证部署
npx hardhat console --network zamaDevnet
```

---

## 🎨 前端部署

### 本地测试

```bash
cd frontend

# 1. 更新合约地址
# 编辑 src/contracts/addresses.ts

# 2. 配置 WalletConnect Project ID
# 编辑 src/utils/wagmi.ts
# 从 https://cloud.walletconnect.com/ 获取免费 ID

# 3. 启动开发服务器
npm run dev
```

访问 `http://localhost:3000`

### 部署到 Vercel

#### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 2. 构建项目

```bash
cd frontend
npm run build
```

#### 3. 部署

```bash
vercel deploy --prod
```

### 部署到 Netlify

#### 1. 构建

```bash
cd frontend
npm run build
```

#### 2. 通过 Netlify CLI 部署

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### 环境变量配置

在 Vercel/Netlify 控制面板设置:
```
VITE_GOLDTOKEN_ADDRESS=0x...
VITE_PICKAXENFT_ADDRESS=0x...
VITE_MININGENGINE_ADDRESS=0x...
VITE_TREASURENFT_ADDRESS=0x...
VITE_WALLETCONNECT_PROJECT_ID=...
```

---

## ✅ 验证合约

### Sepolia 上验证

#### 1. 安装验证插件

```bash
npm install --save-dev @nomicfoundation/hardhat-verify
```

#### 2. 配置 Hardhat

```javascript
// hardhat.config.js
import "@nomicfoundation/hardhat-verify";

export default {
  // ... 其他配置
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
```

#### 3. 验证合约

```bash
# GoldToken
npx hardhat verify --network sepolia <GOLDTOKEN_ADDRESS>

# PickaxeNFT
npx hardhat verify --network sepolia <PICKAXENFT_ADDRESS>

# MiningEngine
npx hardhat verify --network sepolia <MININGENGINE_ADDRESS> \
  <PICKAXENFT_ADDRESS> <GOLDTOKEN_ADDRESS>

# TreasureNFT
npx hardhat verify --network sepolia <TREASURENFT_ADDRESS>
```

**预期输出**:
```
Successfully verified contract GoldToken on Etherscan.
https://sepolia.etherscan.io/address/0x...#code
```

---

## 🐛 常见问题

### 问题 1: Gas 不足

**错误**:
```
Error: insufficient funds for gas * price + value
```

**解决**:
```bash
# 检查余额
npx hardhat console --network sepolia
const [deployer] = await ethers.getSigners();
await ethers.provider.getBalance(deployer.address);

# 从水龙头获取更多测试 ETH
```

### 问题 2: Nonce 太低

**错误**:
```
Error: nonce has already been used
```

**解决**:
```bash
# 重置账户 nonce
npx hardhat clean
rm -rf cache artifacts
```

### 问题 3: 合约验证失败

**错误**:
```
Error: Bytecode does not match
```

**解决**:
```bash
# 1. 确保编译器版本和优化设置一致
# 2. 检查构造函数参数
# 3. 使用 --constructor-args 参数

npx hardhat verify --network sepolia \
  --constructor-args arguments.js \
  <CONTRACT_ADDRESS>
```

**arguments.js**:
```javascript
module.exports = [
  "0x...", // pickaxeNFT address
  "0x...", // goldToken address
];
```

### 问题 4: RPC 连接失败

**错误**:
```
Error: could not connect to network
```

**解决**:
```bash
# 1. 检查 RPC URL
echo $SEPOLIA_RPC_URL

# 2. 测试连接
curl -X POST $SEPOLIA_RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# 3. 尝试其他 RPC 提供商
```

### 问题 5: 前端无法连接合约

**检查清单**:
- [ ] 合约地址配置正确
- [ ] 网络 ID 匹配
- [ ] RPC 节点可访问
- [ ] 钱包已连接
- [ ] ABI 最新版本

---

## 📝 部署后检查清单

### 智能合约

- [ ] 所有合约部署成功
- [ ] 权限配置正确
- [ ] 在区块浏览器上验证
- [ ] 测试基本功能
- [ ] 保存部署信息

### 前端

- [ ] 合约地址已更新
- [ ] 网络配置正确
- [ ] WalletConnect 配置
- [ ] 环境变量设置
- [ ] 构建成功

### 测试

- [ ] 铸造锄头
- [ ] 执行挖矿
- [ ] 领取奖励
- [ ] 钱包交互
- [ ] 错误处理

---

## 🚀 部署流程总结

### 快速部署 (Sepolia)

```bash
# 1. 环境准备
cp .env.example .env
# 编辑 .env,填入 PRIVATE_KEY 和 SEPOLIA_RPC_URL

# 2. 编译和测试
npm run compile
npm test

# 3. 部署合约
npm run deploy:sepolia

# 4. 验证合约
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>

# 5. 更新前端配置
# 编辑 frontend/src/contracts/addresses.ts

# 6. 部署前端
cd frontend
npm run build
vercel deploy --prod
```

### 完整检查

```bash
# 1. 检查部署信息
cat deployment-sepolia.json

# 2. 在 Etherscan 上验证
# 访问 https://sepolia.etherscan.io/address/<CONTRACT_ADDRESS>

# 3. 测试前端
# 访问部署的 URL,连接钱包测试
```

---

## 📚 相关资源

- [Hardhat 文档](https://hardhat.org/docs)
- [Sepolia 测试网](https://sepolia.dev/)
- [Zama 文档](https://docs.zama.ai)
- [Etherscan API](https://docs.etherscan.io/)
- [Vercel 文档](https://vercel.com/docs)

---

**更新时间**: 2025-10-05
**维护者**: Zama Mining Game Team

有问题请提交 [GitHub Issue](https://github.com/your-repo/issues)
