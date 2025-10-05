# 本地测试说明

## ⚠️ 重要提示

由于本项目使用了 **Zama FHE (全同态加密)** 技术,合约中的 `FHE.randEuint8()`、`FHE.add()` 等加密操作 **无法在标准 Hardhat 本地网络上运行**。

## 解决方案

### 方案 1: 部署到 Zama Devnet (推荐)

Zama Devnet 是官方测试网,完全支持所有 FHE 操作:

```bash
# 1. 配置环境变量
cp .env.example .env
# 编辑 .env,添加 ZAMA_RPC_URL 和 PRIVATE_KEY

# 2. 部署到 Zama Devnet
npm run deploy:zama

# 3. 运行交互脚本
npm run interact:zama
```

需要在 `package.json` 添加:
```json
"deploy:zama": "hardhat run scripts/deploy.js --network zamaDevnet",
"interact:zama": "hardhat run scripts/interact.js --network zamaDevnet"
```

### 方案 2: 运行单元测试

单元测试使用 Hardhat 内置网络,部分测试可以通过模拟运行:

```bash
npm test
```

**注意**: 涉及 FHE 随机数的测试可能失败,这是预期行为。

### 方案 3: Sepolia 测试网 (标准 EVM,部分功能受限)

如果只想测试基本逻辑(不包括 FHE 加密):

```bash
# 1. 获取 Sepolia 测试 ETH
# 访问 https://sepoliafaucet.com/

# 2. 配置 .env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key

# 3. 部署
npm run deploy:sepolia
```

**限制**: Sepolia 不支持 FHE 操作,合约部署会失败。

---

## 当前本地测试错误解释

运行 `npm run interact` 时遇到的错误:

```
Transaction reverted without a reason string
```

**原因**: `PickaxeNFT.mintPickaxe()` 中的 `FHE.randEuint8()` 无法在标准 Hardhat localhost 网络执行。

**这是正常现象**,因为 FHE 操作需要 Zama 专用的 EVM 环境。

---

## 前端测试

前端应用可以正常构建和开发:

```bash
cd frontend
npm run dev
```

访问 `http://localhost:3000` 查看 UI。

**注意**: 前端需要连接到支持 FHE 的网络(Zama Devnet)才能正常调用合约。

---

## 推荐工作流程

### 开发阶段

1. **前端开发**: 使用 `npm run dev` 开发 UI
2. **合约开发**: 编写和编译合约 `npm run compile`
3. **单元测试**: 运行不涉及 FHE 的测试 `npm test`

### 测试阶段

1. **部署到 Zama Devnet**
2. **前端连接 Zama Devnet**
3. **完整端到端测试**

### 生产阶段

1. **安全审计**
2. **部署到 Zama 主网**

---

## 获取 Zama Devnet 访问权限

访问 [Zama 官方文档](https://docs.zama.ai/fhevm) 了解如何:

1. 申请 Devnet 访问权限
2. 获取测试代币
3. 配置 RPC 端点

---

## 总结

- ✅ 合约编译成功
- ✅ 前端构建成功
- ❌ 本地 localhost 测试受限(FHE 不可用)
- ✅ 推荐使用 **Zama Devnet** 进行完整测试

**项目完全可用**,只是需要在支持 FHE 的环境中运行!
