# Zama Gateway 集成指南

本文档说明如何集成 Zama Gateway 实现完整的 FHE 解密功能。

---

## 📋 什么是 Zama Gateway?

Zama Gateway 是一个去中心化的解密服务,允许智能合约请求对 FHE 加密值进行阈值解密。

**核心工作流程**:
1. 智能合约提交解密请求到 Gateway
2. Gateway 将请求转发给 KMS 网络
3. KMS 节点使用阈值签名协同解密
4. Gateway 通过回调返回明文结果给合约

---

## 🔧 当前项目的限制

### 简化实现 vs 完整实现

| 功能 | 当前简化版 | Gateway 完整版 |
|------|-----------|---------------|
| **奖励领取** | 玩家声明金额,合约验证 | 合约自动解密并验证 |
| **稀有掉落** | 玩家声明计数,合约扣除 | 合约解密计数并铸造 |
| **随机物品** | 链下伪随机(可预测) | FHE 随机数解密(不可预测) |
| **余额显示** | 前端需重加密 | 合约可公开明文 |

---

## 🏗️ Gateway 集成步骤

### 1. 部署 Gateway 合约

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@zama/gateway/GatewayContract.sol";

contract MiningEngineWithGateway is MiningEngine {
    GatewayContract public gateway;

    // 解密请求 ID 映射
    mapping(uint256 => address) public decryptRequests;

    constructor(
        address _pickaxeNFT,
        address _goldToken,
        address _gateway
    ) MiningEngine(_pickaxeNFT, _goldToken) {
        gateway = GatewayContract(_gateway);
    }

    // 请求解密收益
    function requestDecryptEarnings() external nonReentrant returns (uint256) {
        euint64 encryptedEarnings = playerEarnings[msg.sender];

        // 提交解密请求
        uint256 requestId = gateway.requestDecryption(
            encryptedEarnings,
            this.callbackClaimRewards.selector
        );

        decryptRequests[requestId] = msg.sender;

        return requestId;
    }

    // Gateway 回调函数
    function callbackClaimRewards(
        uint256 requestId,
        uint64 decryptedValue
    ) external onlyGateway {
        address player = decryptRequests[requestId];
        require(player != address(0), "Invalid request");

        // 铸造代币
        goldToken.mintFromMining(player, decryptedValue);

        // 重置收益
        playerEarnings[player] = FHE.asEuint64(0);

        emit RewardsRevealed(player, decryptedValue);

        delete decryptRequests[requestId];
    }

    modifier onlyGateway() {
        require(msg.sender == address(gateway), "Only gateway");
        _;
    }
}
```

### 2. 配置 KMS 网络

```javascript
// hardhat.config.js
export default {
  networks: {
    zamaDevnet: {
      url: 'https://devnet.zama.ai',
      accounts: [process.env.PRIVATE_KEY],
      gateway: {
        url: 'https://gateway.devnet.zama.ai',
        aclAddress: '0x...', // ACL 合约地址
      },
    },
  },
};
```

### 3. 前端集成

```typescript
// 请求解密
import { useWriteContract } from 'wagmi';

function ClaimRewardsButton() {
  const { writeContract } = useWriteContract();

  const handleClaim = async () => {
    // 步骤1: 请求解密
    const tx = await writeContract({
      address: miningEngineAddress,
      abi: MiningEngineABI,
      functionName: 'requestDecryptEarnings',
    });

    const receipt = await tx.wait();

    // 步骤2: 监听 Gateway 事件
    const requestId = receipt.logs[0].args.requestId;

    // 步骤3: 等待 Gateway 回调
    // (自动触发,无需手动操作)

    // 步骤4: 监听 RewardsRevealed 事件
    // 表示领取完成
  };

  return <button onClick={handleClaim}>领取奖励</button>;
}
```

---

## 📚 示例: 完整的解密流程

### 场景: 领取加密收益

#### 1. 玩家发起请求

```solidity
// 玩家调用
uint256 requestId = miningEngine.requestDecryptEarnings();
```

#### 2. 合约提交到 Gateway

```solidity
// 内部调用
uint256 requestId = gateway.requestDecryption(
    playerEarnings[msg.sender],
    this.callbackClaimRewards.selector
);
```

#### 3. Gateway 转发给 KMS

```
Gateway -> KMS 网络 (多个节点协同解密)
```

#### 4. KMS 返回明文

```
KMS -> Gateway -> 合约回调
```

#### 5. 合约处理结果

```solidity
function callbackClaimRewards(uint256 requestId, uint64 value) external {
    // 铸造代币
    goldToken.mint(player, value);

    // 清零余额
    playerEarnings[player] = FHE.asEuint64(0);
}
```

---

## 🎯 需要修改的代码

### MiningEngine.sol

1. **添加 Gateway 依赖**
   ```solidity
   GatewayContract public gateway;
   ```

2. **替换 claimRewards**
   - 移除简化版的直接领取
   - 改为异步解密请求

3. **添加回调函数**
   ```solidity
   function callbackClaimRewards(uint256 requestId, uint64 value) external onlyGateway
   function callbackClaimTreasure(uint256 requestId, uint32 count) external onlyGateway
   ```

### 前端

1. **等待解密完成**
   - 监听 Gateway 事件
   - 显示"解密中..."状态

2. **错误处理**
   - 超时处理
   - 解密失败提示

---

## 🚧 部署 Gateway 的步骤

### 本地测试

1. **启动本地 KMS 节点**
   ```bash
   docker run -p 8545:8545 ghcr.io/zama-ai/kms-node:latest
   ```

2. **部署 Gateway 合约**
   ```bash
   npx hardhat run scripts/deployGateway.js --network localhost
   ```

3. **配置 MiningEngine**
   ```bash
   npx hardhat run scripts/setGateway.js --network localhost
   ```

### Zama 测试网

1. **获取测试网访问权限**
   - 访问 https://fhevm.zama.ai
   - 申请开发者访问

2. **配置网络**
   ```javascript
   zamaDevnet: {
     url: 'https://devnet.zama.ai',
     gateway: '0x...' // Zama 提供的 Gateway 地址
   }
   ```

3. **部署合约**
   ```bash
   npx hardhat run scripts/deploy.js --network zamaDevnet
   ```

---

## 📖 参考资源

- [Zama Gateway 官方文档](https://docs.zama.ai/fhevm/guides/gateway)
- [fhEVM 示例项目](https://github.com/zama-ai/fhevm-hardhat-template)
- [KMS 网络说明](https://docs.zama.ai/fhevm/fundamentals/decryption)

---

## ⚠️ 注意事项

1. **Gas 成本**
   - 解密请求需要支付 Gateway 费用
   - 回调执行需要额外 Gas

2. **异步性**
   - 解密不是即时的,需要等待
   - 前端需要处理等待状态

3. **安全性**
   - 只有 Gateway 能调用回调函数
   - 验证 requestId 和 player 映射

4. **测试**
   - 本地测试可能无法完整模拟 KMS
   - 建议在 Zama 测试网测试

---

## 🎓 学习路径

1. 阅读 Zama Gateway 文档
2. 运行 fhEVM 官方示例
3. 在测试网部署简单的解密合约
4. 集成到本项目
5. 优化 Gas 和用户体验

---

**更新时间**: 2025-10-05
**状态**: 待实现

后续版本将完整集成 Gateway 功能!
