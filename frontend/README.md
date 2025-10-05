# Zama Mining Game - Frontend

基于 React + TypeScript + Vite 的 Zama FHE 挖矿游戏前端应用。

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

访问 `http://localhost:3000`

### 构建生产版本

```bash
npm run build
npm run preview
```

## 📦 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **Wagmi v2** - 以太坊 React Hooks
- **RainbowKit** - 钱包连接组件
- **fhevmjs** - Zama FHE 客户端库
- **React Router** - 路由管理
- **TanStack Query** - 数据状态管理

## 📂 项目结构

```
frontend/
├── src/
│   ├── components/       # 可复用组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── PickaxeCard.tsx
│   ├── pages/           # 页面组件
│   │   ├── HomePage.tsx
│   │   ├── MinePage.tsx
│   │   └── ...
│   ├── hooks/           # 自定义 Hooks
│   │   ├── usePickaxe.ts
│   │   └── useMining.ts
│   ├── contracts/       # 合约配置
│   │   ├── abis.ts
│   │   └── addresses.ts
│   ├── utils/           # 工具函数
│   │   ├── wagmi.ts
│   │   ├── fhevm.ts
│   │   └── helpers.ts
│   ├── types/           # TypeScript 类型定义
│   │   └── index.ts
│   ├── App.tsx          # 根组件
│   ├── main.tsx         # 入口文件
│   └── index.css        # 全局样式
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🔧 配置

### 合约地址

在 `src/contracts/addresses.ts` 中配置合约地址:

```typescript
export const CONTRACT_ADDRESSES: ContractAddresses = {
  goldToken: '0x...',
  pickaxeNFT: '0x...',
  miningEngine: '0x...',
  treasureNFT: '0x...',
};
```

### WalletConnect 项目ID

在 `src/utils/wagmi.ts` 中配置:

```typescript
projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
```

从 [WalletConnect Cloud](https://cloud.walletconnect.com/) 获取免费 Project ID。

## 📱 页面说明

### 1. 首页 (`/`)

- 项目介绍
- 核心特性展示
- 游戏流程说明

### 2. 铸造页面 (`/mint`)

- 选择锄头等级
- 支付 ETH 铸造 NFT
- 查看锄头属性

### 3. 挖矿页面 (`/mine`)

- 查看拥有的锄头
- 执行挖矿操作
- 查看挖矿统计

### 4. 背包页面 (`/inventory`)

- 查看锄头列表
- 查看稀有物品
- 修复锄头

### 5. 奖励页面 (`/rewards`)

- 查看加密收益(重加密)
- 领取 GOLD 代币
- 领取稀有物品

## 🔐 FHE 集成

### 初始化 fhevmjs

```typescript
import { initializeFhevm } from '@/utils/fhevm';

// 在应用启动时初始化
await initializeFhevm();
```

### 重加密查看数据

```typescript
import { reencryptValue } from '@/utils/fhevm';

const decryptedValue = await reencryptValue(
  contractAddress,
  userAddress,
  encryptedValue
);
```

## 🎨 组件使用

### Button

```tsx
import { Button } from '@/components/Button';

<Button variant="primary" size="lg" loading={isLoading}>
  点击
</Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';

<Card variant="elevated">
  <CardHeader>
    <CardTitle>标题</CardTitle>
  </CardHeader>
  <CardContent>
    内容
  </CardContent>
</Card>
```

## 🔌 Hooks 使用

### 查询锄头列表

```tsx
import { usePlayerPickaxes } from '@/hooks/usePickaxe';

const { data: pickaxes } = usePlayerPickaxes(address);
```

### 查询挖矿统计

```tsx
import { usePlayerStats } from '@/hooks/useMining';

const { data: stats } = usePlayerStats(address);
```

## 📝 待完成功能

- [ ] 铸造页面完整实现
- [ ] 背包页面显示所有NFT
- [ ] 奖励页面重加密功能
- [ ] 修复锄头功能
- [ ] 稀有物品使用功能
- [ ] 移动端响应式优化
- [ ] 暗黑模式支持

## 🐛 已知问题

1. **fhevmjs 重加密未实现** - 需要根据最新 API 文档完善
2. **合约地址硬编码** - 应支持多网络动态切换
3. **错误处理不完善** - 需要添加全局错误边界

## 📚 参考资源

- [Zama FHE 文档](https://docs.zama.ai)
- [fhevmjs GitHub](https://github.com/zama-ai/fhevmjs)
- [Wagmi 文档](https://wagmi.sh)
- [RainbowKit 文档](https://www.rainbowkit.com)
- [Vite 文档](https://vitejs.dev)

## 📄 许可证

MIT
