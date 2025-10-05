# FHE 前端加密测试指南

## 🎯 测试目标

验证前端 FHE 加密功能是否正常工作。

## 📋 测试步骤

### 1. 访问前端
- 打开浏览器访问: http://localhost:3002
- 确保连接到 **Sepolia 测试网**

### 2. 连接钱包
- 点击右上角 "Connect Wallet"
- 连接 MetaMask 钱包
- 确保钱包在 Sepolia 网络

### 3. 进入铸造页面
- 点击导航栏的 "铸造" 按钮
- 或直接访问: http://localhost:3002/mint

### 4. 测试铸造功能

#### 步骤 A: 打开浏览器开发者工具
- 按 F12 打开控制台
- 切换到 "Console" 标签页

#### 步骤 B: 选择锄头等级
- 选择 **等级 1** (最便宜,0.01 ETH)
- 查看属性信息

#### 步骤 C: 点击铸造按钮
- 点击 "立即铸造" 按钮
- 观察控制台输出

### 5. 预期的控制台输出

```
✅ FHE 实例初始化成功
🔐 开始生成 FHE 加密幸运值...
🎲 生成加密幸运值: 7 (范围: 5-15)
📦 加密数据生成成功
📤 发送铸造交易...
```

### 6. MetaMask 确认
- MetaMask 会弹出交易确认窗口
- 检查交易详情:
  - **目标合约**: `0xd1c6187E189f4CFaae36743ba1EE0d4cCf6e7C1c` (PickaxeNFT)
  - **价值**: 0.01 ETH
  - **Gas 估算**: 应该正常显示
- 点击 "确认" 发送交易

### 7. 等待交易确认
- 查看交易状态
- Sepolia 网络大约需要 10-20 秒确认

## 🐛 可能的问题和解决方案

### 问题1: "Your instance has been created without the public blockchain key"
**原因**: FHE 实例未正确初始化或缺少网络配置
**解决方案**:
- 已修复:添加了 `networkUrl` 和 `gatewayUrl` 配置
- 确保 MetaMask 连接到 Sepolia 网络
- 刷新页面重新初始化

### 问题2: "幸运值显示 NaN"
**原因**: 合约数据解构不匹配
**解决方案**:
- 已修复:合约返回 5 个值 `[mintPrice, durabilityMax, efficiency, luckMin, luckMax]`
- 前端代码已更新匹配

### 问题3: Gas 估算失败
**原因**: 合约函数参数不匹配
**解决方案**:
- 检查 ABI 是否最新
- 重新生成 ABIs: `npm run compile` (在根目录)

### 问题4: "请连接正确网络"
**原因**: 钱包不在 Sepolia 网络
**解决方案**:
- 在 MetaMask 切换到 Sepolia 测试网
- Chain ID 应该是: 11155111

## ✅ 成功标志

铸造成功后:
1. ✅ 交易在 Etherscan 上可见
2. ✅ NFT 余额增加 (可在背包页面查看)
3. ✅ 控制台显示 "铸造成功" 相关日志

## 🔗 合约地址

### Sepolia 测试网
- **PickaxeNFT**: `0xd1c6187E189f4CFaae36743ba1EE0d4cCf6e7C1c`
- **GoldToken**: `0x2cC0ACD868F5013429Cd610Ec1E296ab2888bb7D`
- **MiningEngine**: `0x8511403A10892B8F7C4fFE07c2724cC7C3201C5b`
- **TreasureNFT**: `0x5eeC686112345485Bf23754679aCcd02aeE36D9B`

### FHE 配置
- **ACL 合约**: `0x2Fb4341027eb1d2aD8B5D9708187df8633cAFA92`
- **Chain ID**: 11155111 (Sepolia)
- **Gateway URL**: https://gateway.zama.ai
- **Network URL**: https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161

## 📊 检查交易

在 Sepolia Etherscan 查看交易:
https://sepolia.etherscan.io/address/0xd1c6187E189f4CFaae36743ba1EE0d4cCf6e7C1c

## 💡 技术细节

### FHE 加密流程
1. **前端生成随机幸运值** (luckMin 到 luckMax 之间)
2. **使用 fhevmjs 加密** (`createEncryptedInput` + `add8`)
3. **传递 Uint8Array 给合约** (作为 bytes calldata)
4. **合约存储加密数据** (不解密)

### 关键代码位置
- **FHE 工具**: `frontend/src/utils/fhe.ts`
- **铸造逻辑**: `frontend/src/pages/MintPage.tsx` (handleMint 函数)
- **合约函数**: `contracts/PickaxeNFT.sol` (mintPickaxe)

### 修复记录
- ✅ 修复 FHE 实例公钥问题 - 添加 networkUrl 和 gatewayUrl
- ✅ 修复幸运值 NaN 问题 - 更正数据解构顺序
- ✅ 修复效率显示 - 从范围改为单值

## 🚀 下一步

测试成功后,可以:
1. 尝试铸造不同等级的锄头
2. 查看背包中的 NFT
3. (待实现) 测试挖矿功能
4. (待实现) 解密查看幸运值
