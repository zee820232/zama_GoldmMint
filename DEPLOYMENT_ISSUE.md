# 部署问题解决方案

## 问题说明

当前遇到 Hardhat 3.x 与 hardhat-ethers 版本兼容性问题。

## 临时解决方案

由于 Hardhat 3.x 是最新版本,生态工具链尚未完全适配。建议采用以下方案之一:

### 方案 1: 降级到 Hardhat 2.x (推荐)

```bash
# 卸载当前版本
npm uninstall hardhat @nomicfoundation/hardhat-ethers

# 安装 Hardhat 2.x
npm install --save-dev hardhat@^2.22.0 @nomicfoundation/hardhat-ethers@^3.0.0 --legacy-peer-deps

# 更新配置文件
# hardhat.config.js 中移除 type: "edr-simulated" 等 Hardhat 3.x 特有配置
```

### 方案 2: 使用 Hardhat Ignition (Hardhat 3.x 推荐)

Hardhat 3.x 推荐使用 Ignition 部署系统:

```bash
npm install --save-dev @nomicfoundation/hardhat-ignition

# 创建 ignition/modules/deploy.js
```

### 方案 3: 使用 ethers.js 直接部署

不依赖 Hardhat 插件,直接使用 ethers.js:

```javascript
import { ethers } from "ethers";
import fs from "fs";

// 读取编译后的 artifacts
const GoldTokenArtifact = JSON.parse(fs.readFileSync("./artifacts/contracts/GoldToken.sol/GoldToken.json"));

// 连接到节点
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const signer = await provider.getSigner();

// 部署
const GoldTokenFactory = new ethers.ContractFactory(
  GoldTokenArtifact.abi,
  GoldTokenArtifact.bytecode,
  signer
);

const goldToken = await GoldTokenFactory.deploy();
await goldToken.waitForDeployment();
```

## 当前状态

- ✅ 合约已成功编译
- ✅ 本地节点已启动(localhost:8545)
- ⏸️ 部署脚本因版本兼容性暂停

## 下一步建议

1. **快速验证**: 使用方案 1 降级到 Hardhat 2.x
2. **长期方案**: 等待 Zama fhEVM 生态完全适配 Hardhat 3.x
3. **替代方案**: 直接在 Zama 测试网部署(跳过本地测试)

## 已验证的工作内容

虽然部署未完成,但以下内容已经完全就绪:

1. **3 个智能合约** - 编译通过,无语法错误
2. **完整的项目结构** - 符合 Hardhat 标准
3. **测试用例框架** - 可在解决版本问题后直接使用

您可以选择继续按方案 1 降级,或者我可以帮您直接准备测试网部署方案。
