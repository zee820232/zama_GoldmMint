# Zama Devnet 部署完整指南

本文档提供将 Zama Mining Game 部署到 **Zama fhEVM Devnet** 的完整流程。

## 📋 目录

1. [准备工作](#准备工作)
2. [环境配置](#环境配置)
3. [部署合约](#部署合约)
4. [配置前端](#配置前端)
5. [测试验证](#测试验证)
6. [常见问题](#常见问题)

---

## 1. 准备工作

### 1.1 获取 Zama Devnet 测试代币

**方法一: 官方水龙头**

访问 **[Zama Faucet](https://faucet.zama.ai)** 领取测试代币:

1. 连接你的 MetaMask 钱包
2. 确保已切换到 Zama Devnet 网络
3. 点击"Request Tokens"
4. 等待 1-2 分钟,代币将发送到你的地址

**方法二: 社区渠道**

如果水龙头暂时不可用,可以:
- 加入 [Zama Discord](https://discord.gg/fhe-org)
- 在 #faucet 频道请求测试币

### 1.2 添加 Zama Devnet 到 MetaMask

**手动添加网络:**

1. 打开 MetaMask → 设置 → 网络 → 添加网络
2. 填入以下信息:

```
网络名称: Zama fhEVM Devnet
RPC URL: https://devnet.zama.ai
Chain ID: 9000
货币符号: ZAMA
区块浏览器: https://explorer.devnet.zama.ai
```

3. 保存并切换到该网络

### 1.3 获取 WalletConnect Project ID

前端需要 WalletConnect 支持:

1. 访问 [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. 注册/登录账号
3. 创建新项目 "Zama Mining Game"
4. 复制 Project ID (稍后配置到 .env)

---

## 2. 环境配置

### 2.1 创建 `.env` 文件

在项目根目录创建 `.env` 文件:

```bash
cp .env.example .env
```

### 2.2 配置环境变量

编辑 `.env` 文件,填入以下信息:

```env
# ========== 部署账户 ==========
# 从 MetaMask 导出私钥 (Settings → Security & Privacy → Reveal Private Key)
# 注意: 移除 0x 前缀
PRIVATE_KEY=your_private_key_here

# ========== Zama fhEVM Devnet ==========
ZAMA_RPC_URL=https://devnet.zama.ai
ZAMA_GATEWAY_URL=https://gateway.devnet.zama.ai
ZAMA_ACL_ADDRESS=0x2Fb4341027eb1d2aD8B5D9708187df8633cAFA92

# ========== 前端配置 ==========
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_from_walletconnect
```

**安全提示:**
- ⚠️ 永远不要提交 `.env` 文件到 Git
- ⚠️ 不要在 `.env` 中使用主网真实资金的私钥
- ✅ 使用专门的测试钱包

### 2.3 检查余额

确保部署账户有足够的测试币:

```bash
npx hardhat console --network zamaDevnet
```

在 console 中运行:

```javascript
const [deployer] = await ethers.getSigners();
console.log("部署地址:", deployer.address);
const balance = await ethers.provider.getBalance(deployer.address);
console.log("余额:", ethers.formatEther(balance), "ZAMA");
```

**建议余额:** 至少 1 ZAMA (用于 gas 费用)

---

## 3. 部署合约

### 3.1 编译合约

```bash
npm run compile
```

**预期输出:**
```
Compiled 11 Solidity files successfully (evm target: cancun).
```

**如果遇到错误:**
- 确保 `hardhat.config.js` 中 `viaIR: true` 已启用
- 运行 `npm run clean` 清理缓存后重试

### 3.2 部署到 Zama Devnet

```bash
npm run deploy:zama
```

**部署过程:**

```
🚀 开始部署 Zama 矿工应用合约...

📍 部署地址: 0x...
💰 账户余额: 5.0 ZAMA

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

========================================================================
📋 部署成功!
========================================================================

合约地址:
  - GoldToken:     0x...
  - PickaxeNFT:    0x...
  - MiningEngine:  0x...
  - TreasureNFT:   0x...

========================================================================
💾 部署信息已保存到 deployment-zamaDevnet.json
```

### 3.3 验证部署

访问 [Zama Explorer](https://explorer.devnet.zama.ai) 搜索合约地址,确认:
- ✅ 合约已部署
- ✅ 交易已确认
- ✅ 合约代码可见

---

## 4. 配置前端

### 4.1 更新合约地址

打开 `frontend/src/contracts/addresses.ts`,将部署后的合约地址填入 `ZAMA_DEVNET_ADDRESSES`:

```typescript
export const ZAMA_DEVNET_ADDRESSES: ContractAddresses = {
  goldToken: '0x...', // 从 deployment-zamaDevnet.json 复制
  pickaxeNFT: '0x...',
  miningEngine: '0x...',
  treasureNFT: '0x...',
};
```

**自动化方式 (可选):**

创建脚本 `scripts/update-frontend-addresses.js`:

```javascript
import fs from 'fs';

const deployment = JSON.parse(
  fs.readFileSync('./deployment-zamaDevnet.json', 'utf8')
);

const addressesPath = './frontend/src/contracts/addresses.ts';
let content = fs.readFileSync(addressesPath, 'utf8');

// 替换 ZAMA_DEVNET_ADDRESSES
content = content.replace(
  /export const ZAMA_DEVNET_ADDRESSES[\s\S]*?};/,
  `export const ZAMA_DEVNET_ADDRESSES: ContractAddresses = {
  goldToken: '${deployment.contracts.GoldToken}',
  pickaxeNFT: '${deployment.contracts.PickaxeNFT}',
  miningEngine: '${deployment.contracts.MiningEngine}',
  treasureNFT: '${deployment.contracts.TreasureNFT}',
};`
);

fs.writeFileSync(addressesPath, content);
console.log('✅ 前端合约地址已更新!');
```

### 4.2 配置前端环境变量

创建 `frontend/.env.local`:

```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

### 4.3 启动前端

```bash
cd frontend
npm install   # 首次运行需要安装依赖
npm run dev
```

访问 http://localhost:3000

---

## 5. 测试验证

### 5.1 连接钱包

1. 打开前端应用
2. 点击"连接钱包"
3. 选择 MetaMask
4. 确保切换到 **Zama fhEVM Devnet** (Chain ID: 9000)

### 5.2 测试核心功能

**功能1: 铸造锄头**

1. 进入"铸造"页面
2. 选择等级 1 的锄头 (0.01 ZAMA)
3. 点击"铸造"
4. 确认 MetaMask 交易
5. 等待交易确认 (约 5-10 秒)
6. 检查"背包"页面是否显示新锄头

**功能2: 执行挖矿**

1. 进入"挖矿"页面
2. 选择一个有耐久的锄头
3. 点击"开始挖矿"
4. 确认交易
5. 等待 FHE 操作完成 (可能需要 10-30 秒)
6. 检查"奖励"页面的加密收益

**功能3: 查看 FHE 数据 (重加密)**

1. 在"背包"页面查看锄头
2. 点击"查看幸运值"
3. 签名 EIP712 消息 (允许重加密)
4. 等待解密 (1-3 秒)
5. 查看解密后的幸运值

**功能4: 领取奖励**

1. 进入"奖励"页面
2. 输入要领取的金币数量
3. 点击"领取奖励"
4. 确认交易
5. 检查钱包中的 GOLD 代币余额

### 5.3 测试 FHE 特性

**验证加密性:**

1. 在区块浏览器查看 `mine` 交易
2. 确认交易数据中看不到明文奖励
3. 使用重加密才能查看自己的数据

**验证概率:**

1. 多次执行挖矿 (10+ 次)
2. 记录不同等级锄头的奖励分布
3. 验证概率表是否符合预期

---

## 6. 常见问题

### Q1: 交易一直 Pending 怎么办?

**原因:** Gas 设置过低或网络拥堵

**解决:**
1. 在 MetaMask 中加速交易 (Increase Gas)
2. 或取消交易后重试
3. 检查 [Zama Explorer](https://explorer.devnet.zama.ai) 网络状态

### Q2: 合约部署失败 "Out of Gas"

**原因:** FHE 操作消耗的 Gas 较高

**解决:**
```javascript
// 在 hardhat.config.js 中增加 Gas Limit
zamaDevnet: {
  gas: 10000000,      // 10M gas
  gasPrice: "auto",
}
```

### Q3: FHE 操作失败 "Transaction reverted"

**原因:** 在非 FHE 网络上调用了 FHE 函数

**检查:**
1. 确认 Chain ID 是 9000 (Zama Devnet)
2. 确认 RPC URL 正确
3. 尝试切换网络后重连

### Q4: 重加密签名失败

**原因:** fhevmjs 实例未正确初始化

**解决:**
```typescript
// 在 App.tsx 中确保初始化
useEffect(() => {
  initializeFhevm().catch(console.error);
}, []);
```

### Q5: 前端无法连接合约

**检查清单:**
- [ ] 合约地址配置正确
- [ ] 网络 ID 匹配 (9000)
- [ ] RPC 节点可访问
- [ ] 钱包已连接
- [ ] ABI 最新版本

---

## 7. 性能优化建议

### 7.1 减少 FHE 操作

FHE 操作昂贵,优化策略:
- 批量操作 (一次挖矿多次,而非多次挖矿一次)
- 缓存重加密结果
- 使用 localStorage 存储已解密数据

### 7.2 前端优化

```typescript
// 使用 React Query 缓存
const { data: luck } = useDecryptedLuck(pickaxeId, {
  staleTime: 5 * 60 * 1000, // 5分钟内不重新请求
  cacheTime: 10 * 60 * 1000,
});
```

---

## 8. 下一步

部署成功后,您可以:

1. **邀请用户测试**
   - 分享前端 URL
   - 提供测试代币
   - 收集反馈

2. **集成 Gateway** (可选)
   - 参考 `GATEWAY_INTEGRATION_GUIDE.md`
   - 实现异步解密
   - 优化用户体验

3. **准备主网部署**
   - 安全审计
   - 经济模型调整
   - Gas 优化

---

## 9. 有用的链接

- **Zama 官方文档:** https://docs.zama.ai/fhevm
- **Zama Discord:** https://discord.gg/fhe-org
- **Zama GitHub:** https://github.com/zama-ai/fhevm
- **Devnet 浏览器:** https://explorer.devnet.zama.ai
- **测试币水龙头:** https://faucet.zama.ai

---

## 10. 支持

遇到问题?

1. 检查 [常见问题](#常见问题)
2. 查看项目文档 (`CLAUDE.md`, `PROJECT_SUMMARY.md`)
3. 提交 GitHub Issue
4. 在 Zama Discord 寻求帮助

---

**最后更新:** 2025-10-05
**作者:** Zama Mining Game Team

🎉 **祝部署顺利!**
