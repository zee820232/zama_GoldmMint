# 🚀 快速开始 - Zama Devnet 部署

这是一个快速参考指南,帮助您立即开始部署。完整文档请查看 `ZAMA_DEVNET_DEPLOYMENT.md`。

## ⚡ 5分钟快速部署

### 步骤 1: 准备测试币

1. 安装 MetaMask 并添加 Zama Devnet:
   ```
   网络名称: Zama fhEVM Devnet
   RPC URL: https://devnet.zama.ai
   Chain ID: 9000
   货币符号: ZAMA
   ```

2. 访问水龙头领取测试币: https://faucet.zama.ai

### 步骤 2: 配置环境

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件,填入:
# PRIVATE_KEY=你的私钥(从MetaMask导出,移除0x前缀)
# VITE_WALLETCONNECT_PROJECT_ID=从 https://cloud.walletconnect.com/ 获取
```

### 步骤 3: 部署合约

```bash
# 安装依赖 (首次运行)
npm install

# 编译合约
npm run compile

# 部署到 Zama Devnet
npm run deploy:zama
```

### 步骤 4: 配置前端

```bash
# 更新合约地址
# 打开 frontend/src/contracts/addresses.ts
# 将 deployment-zamaDevnet.json 中的地址复制到 ZAMA_DEVNET_ADDRESSES

# 启动前端
cd frontend
npm install  # 首次运行
npm run dev
```

### 步骤 5: 测试

1. 访问 http://localhost:3000
2. 连接钱包 (选择 Zama Devnet)
3. 铸造锄头 → 挖矿 → 查看奖励

## 📝 检查清单

部署前:
- [ ] 获得至少 1 ZAMA 测试币
- [ ] 配置 `.env` 文件
- [ ] 获取 WalletConnect Project ID

部署后:
- [ ] 合约地址已保存到 `deployment-zamaDevnet.json`
- [ ] 前端合约地址已更新
- [ ] 前端 `.env.local` 已配置
- [ ] 可以成功连接钱包
- [ ] 可以铸造锄头和挖矿

## 🔗 重要链接

- **水龙头:** https://faucet.zama.ai
- **浏览器:** https://explorer.devnet.zama.ai
- **WalletConnect:** https://cloud.walletconnect.com/
- **完整文档:** `ZAMA_DEVNET_DEPLOYMENT.md`

## ❓ 常见问题

**Q: 部署失败 "insufficient funds"**
A: 检查账户余额,至少需要 1 ZAMA

**Q: 前端无法连接**
A: 确认 Chain ID 是 9000,RPC URL 是 https://devnet.zama.ai

**Q: FHE 操作失败**
A: 确保在 Zama Devnet 上操作,本地 Hardhat 不支持 FHE

## 🆘 获取帮助

- 查看完整文档: `ZAMA_DEVNET_DEPLOYMENT.md`
- 技术指南: `CLAUDE.md`
- 项目总结: `PROJECT_SUMMARY.md`
- Zama Discord: https://discord.gg/fhe-org

---

准备好了吗? 开始部署吧! 🚀
