# FHE 重加密功能使用文档

## 概述

本项目已完成 fhevmjs 重加密功能集成,允许用户查看以下加密数据:
- 锄头的幸运值 (euint8)
- 玩家的累计收益 (euint64)
- 玩家的史诗掉落次数 (euint32)

## 文件结构

```
frontend/src/
├── utils/
│   └── fhevm.ts          # FHE 工具函数 (初始化、重加密、加密输入)
├── hooks/
│   ├── useFHE.ts         # FHE 相关 Hooks
│   ├── usePickaxe.ts     # 锄头 Hooks (已集成解密)
│   └── useMining.ts      # 挖矿 Hooks (已集成解密)
├── types/
│   └── index.ts          # TypeScript 类型定义
└── examples/
    └── UsageExample.tsx  # 使用示例
```

## 核心功能

### 1. FHE 工具模块 (`utils/fhevm.ts`)

#### `initializeFhevm()`
初始化 fhevmjs WASM 模块,应用启动时调用一次。

```typescript
import { initializeFhevm } from '@/utils/fhevm';

// 在 App.tsx 或 main.tsx 中
useEffect(() => {
  initializeFhevm();
}, []);
```

#### `createFhevmInstance(provider, chainId)`
创建 fhevmjs 实例,自动由 `useFhevmInstance` Hook 调用。

#### `reencryptValue(instance, contractAddress, userAddress, encryptedValue, signer)`
重加密加密值,返回解密后的 bigint。

#### `encryptInput(instance, contractAddress, userAddress, value, bits)`
加密输入值,用于发送加密交易。

### 2. FHE Hooks (`hooks/useFHE.ts`)

#### `useFhevmInstance()`
管理 fhevmjs 实例,自动处理网络切换。

```typescript
const { instance, isLoading, error } = useFhevmInstance();
```

#### `useReencrypt(contractAddress, encryptedValue, enabled)`
通用重加密 Hook。

```typescript
const { decryptedValue, isLoading, error, refetch } = useReencrypt(
  contractAddress,
  encryptedValue,
  true
);
```

#### `useDecryptedLuck(pickaxeId, encryptedLuck, pickaxeNftAddress)`
解密锄头幸运值。

```typescript
const { luck, isLoading, error } = useDecryptedLuck(
  pickaxeId,
  encryptedLuck,
  pickaxeNftAddress
);
```

#### `useDecryptedEarnings(encryptedEarnings, miningEngineAddress)`
解密玩家收益。

```typescript
const { earnings, isLoading, error } = useDecryptedEarnings(
  encryptedEarnings,
  miningEngineAddress
);
```

#### `useDecryptedEpicDrops(encryptedEpicDrops, miningEngineAddress)`
解密玩家史诗掉落次数。

```typescript
const { epicDrops, isLoading, error } = useDecryptedEpicDrops(
  encryptedEpicDrops,
  miningEngineAddress
);
```

### 3. 集成后的 Hooks

#### `usePickaxeFullInfo(tokenId)` (在 `hooks/usePickaxe.ts`)
获取锄头完整信息,包括自动解密的幸运值。

```typescript
import { usePickaxeFullInfo } from '@/hooks/usePickaxe';

function MyComponent() {
  const {
    level,
    durability,
    durabilityMax,
    efficiency,
    luck,        // 自动解密的幸运值 (number | null)
    isLoading,
    isError,
    error,
    refetch,
  } = usePickaxeFullInfo(pickaxeId);

  return (
    <div>
      {luck !== null ? (
        <div>幸运值: {luck}</div>
      ) : (
        <div>解密中...</div>
      )}
    </div>
  );
}
```

#### `useDecryptedPlayerEarnings(address)` (在 `hooks/useMining.ts`)
获取玩家解密后的收益。

```typescript
import { useDecryptedPlayerEarnings } from '@/hooks/useMining';
import { formatEther } from 'ethers';

function MyComponent() {
  const { address } = useAccount();
  const { earnings, isLoading, error } = useDecryptedPlayerEarnings(address);

  return (
    <div>
      {earnings !== null ? (
        <div>收益: {formatEther(earnings)} GOLD</div>
      ) : (
        <div>解密中...</div>
      )}
    </div>
  );
}
```

#### `useDecryptedPlayerEpicDrops(address)` (在 `hooks/useMining.ts`)
获取玩家解密后的史诗掉落次数。

```typescript
import { useDecryptedPlayerEpicDrops } from '@/hooks/useMining';

function MyComponent() {
  const { address } = useAccount();
  const { epicDrops, isLoading, error } = useDecryptedPlayerEpicDrops(address);

  return (
    <div>
      {epicDrops !== null ? (
        <div>史诗掉落: {epicDrops} 次</div>
      ) : (
        <div>解密中...</div>
      )}
    </div>
  );
}
```

#### `usePlayerMiningData(address)` (在 `hooks/useMining.ts`)
获取玩家完整挖矿数据 (统计 + 解密收益 + 解密史诗掉落)。

```typescript
import { usePlayerMiningData } from '@/hooks/useMining';
import { formatEther } from 'ethers';

function MyComponent() {
  const { address } = useAccount();
  const {
    miningCount,
    lastMiningTime,
    earnings,      // 自动解密
    epicDrops,     // 自动解密
    isLoading,
    error,
  } = usePlayerMiningData(address);

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;

  return (
    <div>
      <div>挖矿次数: {miningCount?.toString()}</div>
      <div>收益: {earnings ? formatEther(earnings) : '0'} GOLD</div>
      <div>史诗掉落: {epicDrops ?? 0} 次</div>
    </div>
  );
}
```

## 使用流程

### 步骤 1: 初始化 FHE (应用启动时)

在 `App.tsx` 或 `main.tsx` 中:

```typescript
import { useEffect } from 'react';
import { initializeFhevm } from '@/utils/fhevm';

function App() {
  useEffect(() => {
    initializeFhevm().catch(console.error);
  }, []);

  return <YourApp />;
}
```

### 步骤 2: 在组件中使用解密 Hooks

```typescript
import { useAccount } from 'wagmi';
import { usePickaxeFullInfo } from '@/hooks/usePickaxe';
import { usePlayerMiningData } from '@/hooks/useMining';

function GameDashboard() {
  const { address } = useAccount();

  // 获取锄头信息 (含解密后的幸运值)
  const pickaxe = usePickaxeFullInfo(1n);

  // 获取挖矿数据 (含解密后的收益和史诗掉落)
  const miningData = usePlayerMiningData(address);

  return (
    <div>
      <h2>锄头信息</h2>
      {pickaxe.luck !== null && <div>幸运值: {pickaxe.luck}</div>}

      <h2>挖矿数据</h2>
      {miningData.earnings && <div>收益: {formatEther(miningData.earnings)}</div>}
      {miningData.epicDrops !== null && <div>史诗掉落: {miningData.epicDrops}</div>}
    </div>
  );
}
```

## 加载状态处理

所有解密 Hook 都提供 `isLoading` 和 `error` 状态:

```typescript
const { luck, isLoading, error } = useDecryptedLuck(...);

if (isLoading) {
  return <Spinner />;
}

if (error) {
  return <ErrorMessage error={error} />;
}

return <div>幸运值: {luck}</div>;
```

## 重新解密

所有解密 Hook 都提供 `refetch` 函数:

```typescript
const { earnings, refetch } = useDecryptedPlayerEarnings(address);

// 手动重新解密
<button onClick={refetch}>刷新收益</button>
```

## 错误处理

### 常见错误

1. **FHE 未初始化**
   - 确保在应用启动时调用了 `initializeFhevm()`

2. **网络不支持**
   - 确保连接到支持 FHE 的网络 (Zama Devnet)

3. **签名被拒绝**
   - 用户需要签署 EIP712 消息以进行重加密

4. **合约地址错误**
   - 检查 `contracts/addresses.ts` 中的合约地址

### 错误处理示例

```typescript
const { earnings, error } = useDecryptedPlayerEarnings(address);

if (error) {
  if (error.message.includes('未初始化')) {
    return <div>请刷新页面重试</div>;
  }

  if (error.message.includes('签名')) {
    return <div>您需要签名才能查看收益</div>;
  }

  return <div>加载失败: {error.message}</div>;
}
```

## 性能优化

### 1. 缓存 FHE 实例

`useFhevmInstance` 会自动缓存实例,避免重复创建。

### 2. 条件启用

使用 `enabled` 参数控制何时执行重加密:

```typescript
const { luck } = useDecryptedLuck(
  pickaxeId,
  encryptedLuck,
  pickaxeNftAddress
  // enabled 默认为 true,当 pickaxeId 或 encryptedLuck 为 undefined 时自动禁用
);
```

### 3. 避免不必要的重加密

解密结果会被缓存,除非:
- 加密值变化
- 手动调用 `refetch()`
- 组件重新挂载

## 测试建议

### 单元测试

测试 FHE 工具函数:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { reencryptValue } from '@/utils/fhevm';

describe('reencryptValue', () => {
  it('应该正确解密加密值', async () => {
    const mockInstance = createMockFhevmInstance();
    const result = await reencryptValue(
      mockInstance,
      '0x123...',
      '0xabc...',
      123n,
      mockSigner
    );

    expect(result).toBeInstanceOf(BigInt);
  });
});
```

### 集成测试

测试 Hooks:

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useDecryptedLuck } from '@/hooks/useFHE';

it('应该解密幸运值', async () => {
  const { result } = renderHook(() =>
    useDecryptedLuck(1n, 123n, '0x...')
  );

  await waitFor(() => {
    expect(result.current.luck).not.toBeNull();
  });

  expect(result.current.luck).toBeGreaterThan(0);
});
```

### 端到端测试

使用 Playwright 测试完整流程:

```typescript
test('用户应该能查看解密后的幸运值', async ({ page }) => {
  await page.goto('/inventory');
  await page.click('[data-testid="pickaxe-1"]');

  // 等待解密完成
  await expect(page.locator('[data-testid="luck-value"]'))
    .toContainText(/\d+/);
});
```

## 常见问题

### Q: 为什么解密需要用户签名?

A: FHE 重加密需要用户的私钥参与,通过 EIP712 签名来验证用户身份,确保只有数据所有者才能解密。

### Q: 解密需要多长时间?

A: 通常在 1-3 秒内完成,取决于网络状况和 FHE 计算复杂度。

### Q: 可以批量解密吗?

A: 目前每个值需要单独解密。可以并行调用多个解密 Hook,它们会同时执行。

### Q: 网络切换后需要重新解密吗?

A: 是的,`useFhevmInstance` 会自动检测网络切换并重置实例,解密 Hooks 会自动重新执行。

### Q: 如何在移动端使用?

A: 确保移动钱包支持 EIP712 签名,其余使用方式相同。

## 下一步

- 实现批量解密优化
- 添加解密结果的持久化缓存
- 实现离线解密 (如果可能)
- 添加解密进度指示器
- 优化移动端体验
