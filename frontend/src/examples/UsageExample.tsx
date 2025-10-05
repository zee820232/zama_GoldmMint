/**
 * FHE 重加密功能使用示例
 *
 * 本文件展示如何在组件中使用 FHE Hooks 来查看加密数据
 */

import { useAccount } from 'wagmi';
import {
  usePickaxeFullInfo,
  usePlayerPickaxes
} from '@/hooks/usePickaxe';
import {
  usePlayerMiningData,
  useDecryptedPlayerEarnings,
  useDecryptedPlayerEpicDrops,
} from '@/hooks/useMining';
import { useFhevmInstance } from '@/hooks/useFHE';
import { formatEther } from 'ethers';

/**
 * 示例 1: 显示锄头完整信息 (包括解密后的幸运值)
 */
export function PickaxeInfoExample() {
  const pickaxeId = 1n; // 锄头 ID

  // 使用 usePickaxeFullInfo 获取完整信息
  const {
    level,
    durability,
    durabilityMax,
    efficiency,
    luck, // 自动解密的幸运值
    isLoading,
    isError,
    error,
  } = usePickaxeFullInfo(pickaxeId);

  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (isError) {
    return <div>错误: {error?.message}</div>;
  }

  return (
    <div className="pickaxe-card">
      <h3>锄头 #{pickaxeId.toString()}</h3>
      <div>等级: {level}</div>
      <div>耐久度: {durability}/{durabilityMax}</div>
      <div>效率: {efficiency}</div>
      {luck !== null ? (
        <div>🍀 幸运值: {luck}</div>
      ) : (
        <div>🔒 幸运值解密中...</div>
      )}
    </div>
  );
}

/**
 * 示例 2: 显示玩家挖矿数据 (包括解密后的收益和史诗掉落)
 */
export function PlayerMiningDataExample() {
  const { address } = useAccount();

  // 使用 usePlayerMiningData 获取完整挖矿数据
  const {
    miningCount,
    lastMiningTime,
    earnings, // 自动解密的收益
    epicDrops, // 自动解密的史诗掉落次数
    isLoading,
    isError,
    error,
  } = usePlayerMiningData(address);

  if (!address) {
    return <div>请先连接钱包</div>;
  }

  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (isError) {
    return <div>错误: {error?.message}</div>;
  }

  return (
    <div className="mining-stats">
      <h3>我的挖矿数据</h3>
      <div>挖矿次数: {miningCount?.toString() || '0'}</div>
      <div>上次挖矿时间: {lastMiningTime ? new Date(Number(lastMiningTime) * 1000).toLocaleString() : '未挖矿'}</div>

      {earnings !== null ? (
        <div>💰 总收益: {formatEther(earnings)} GOLD</div>
      ) : (
        <div>🔒 收益解密中...</div>
      )}

      {epicDrops !== null ? (
        <div>⭐ 史诗掉落次数: {epicDrops}</div>
      ) : (
        <div>🔒 史诗掉落解密中...</div>
      )}
    </div>
  );
}

/**
 * 示例 3: 分别使用解密 Hooks
 */
export function SeparateDecryptExample() {
  const { address } = useAccount();

  // 分别使用各个解密 Hook
  const {
    earnings,
    isLoading: earningsLoading,
    error: earningsError,
  } = useDecryptedPlayerEarnings(address);

  const {
    epicDrops,
    isLoading: epicDropsLoading,
    error: epicDropsError,
  } = useDecryptedPlayerEpicDrops(address);

  return (
    <div>
      <h3>分别解密示例</h3>

      <div>
        {earningsLoading ? (
          <span>收益解密中...</span>
        ) : earningsError ? (
          <span>收益解密失败: {earningsError.message}</span>
        ) : (
          <span>收益: {earnings ? formatEther(earnings) : '0'} GOLD</span>
        )}
      </div>

      <div>
        {epicDropsLoading ? (
          <span>史诗掉落解密中...</span>
        ) : epicDropsError ? (
          <span>史诗掉落解密失败: {epicDropsError.message}</span>
        ) : (
          <span>史诗掉落: {epicDrops ?? 0}</span>
        )}
      </div>
    </div>
  );
}

/**
 * 示例 4: 检查 FHE 实例状态
 */
export function FhevmInstanceStatusExample() {
  const { instance, isLoading, error } = useFhevmInstance();

  return (
    <div className="fhevm-status">
      <h3>FHE 状态</h3>
      {isLoading && <div>⏳ FHE 初始化中...</div>}
      {error && <div>❌ FHE 初始化失败: {error.message}</div>}
      {instance && <div>✅ FHE 已就绪</div>}
    </div>
  );
}

/**
 * 示例 5: 显示玩家所有锄头的幸运值
 */
export function AllPickaxesLuckExample() {
  const { address } = useAccount();
  const { data: pickaxeIds } = usePlayerPickaxes(address);

  if (!address) {
    return <div>请先连接钱包</div>;
  }

  if (!pickaxeIds || pickaxeIds.length === 0) {
    return <div>您还没有锄头</div>;
  }

  return (
    <div>
      <h3>我的所有锄头</h3>
      <div className="pickaxe-grid">
        {(pickaxeIds as bigint[]).map((id) => (
          <PickaxeCard key={id.toString()} pickaxeId={id} />
        ))}
      </div>
    </div>
  );
}

/**
 * 单个锄头卡片组件
 */
function PickaxeCard({ pickaxeId }: { pickaxeId: bigint }) {
  const pickaxeInfo = usePickaxeFullInfo(pickaxeId);

  return (
    <div className="card">
      <h4>锄头 #{pickaxeId.toString()}</h4>

      {pickaxeInfo.isLoading && <div>加载中...</div>}

      {!pickaxeInfo.isLoading && (
        <>
          <div>等级: Lv.{pickaxeInfo.level}</div>
          <div>耐久: {pickaxeInfo.durability}/{pickaxeInfo.durabilityMax}</div>
          <div>效率: {pickaxeInfo.efficiency}</div>

          {pickaxeInfo.luck !== null ? (
            <div className="luck">🍀 幸运: {pickaxeInfo.luck}</div>
          ) : (
            <div className="luck-loading">🔒 幸运值解密中...</div>
          )}
        </>
      )}

      {pickaxeInfo.isError && (
        <div className="error">错误: {pickaxeInfo.error?.message}</div>
      )}
    </div>
  );
}
