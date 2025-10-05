import { useAccount, useChainId } from 'wagmi';
import { getContractAddresses } from '@/contracts/addresses';
import { usePickaxeLevelConfig } from '@/hooks/usePickaxe';

export function DebugPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const { data: level1Config, isLoading: loading1, error: error1 } = usePickaxeLevelConfig(1);
  const { data: level5Config, isLoading: loading5, error: error5 } = usePickaxeLevelConfig(5);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🔍 调试信息</h1>

      {/* 钱包状态 */}
      <div className="mb-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-bold mb-4">💼 钱包状态</h2>
        <p>连接状态: {isConnected ? '✅ 已连接' : '❌ 未连接'}</p>
        <p>钱包地址: {address || '未连接'}</p>
      </div>

      {/* 网络信息 */}
      <div className="mb-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-bold mb-4">🌐 网络信息</h2>
        <p>当前 Chain ID: <span className="text-yellow-400 font-mono">{chainId}</span></p>
        <p>预期 Sepolia: <span className="text-green-400 font-mono">11155111</span></p>
        <p>匹配状态: {chainId === 11155111 ? '✅ 正确' : '❌ 不匹配'}</p>
      </div>

      {/* 合约地址 */}
      <div className="mb-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-bold mb-4">📝 合约地址</h2>
        <div className="font-mono text-sm">
          <p>GoldToken: <span className="text-blue-400">{addresses.goldToken}</span></p>
          <p>PickaxeNFT: <span className="text-blue-400">{addresses.pickaxeNFT}</span></p>
          <p>MiningEngine: <span className="text-blue-400">{addresses.miningEngine}</span></p>
          <p>TreasureNFT: <span className="text-blue-400">{addresses.treasureNFT}</span></p>
        </div>
        <p className="mt-4">
          地址是否为零地址: {addresses.pickaxeNFT === '0x0000000000000000000000000000000000000000' ? '❌ 是零地址' : '✅ 正常'}
        </p>
      </div>

      {/* Level 1 配置 */}
      <div className="mb-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-bold mb-4">⚙️ Level 1 配置</h2>
        <p>加载状态: {loading1 ? '⏳ 加载中...' : '✅ 完成'}</p>
        {error1 && (
          <div className="text-red-400 mt-2">
            <p>❌ 错误: {error1.message}</p>
            <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(error1, null, 2)}</pre>
          </div>
        )}
        {level1Config && (
          <div className="text-green-400 mt-2">
            <p>✅ 配置已加载:</p>
            <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(level1Config, (key, value) =>
              typeof value === 'bigint' ? value.toString() : value
            , 2)}</pre>
          </div>
        )}
        {!loading1 && !error1 && !level1Config && (
          <p className="text-yellow-400 mt-2">⚠️ 未获取到数据 (usingMockData = true)</p>
        )}
      </div>

      {/* Level 5 配置 */}
      <div className="mb-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-bold mb-4">⚙️ Level 5 配置</h2>
        <p>加载状态: {loading5 ? '⏳ 加载中...' : '✅ 完成'}</p>
        {error5 && (
          <div className="text-red-400 mt-2">
            <p>❌ 错误: {error5.message}</p>
          </div>
        )}
        {level5Config && (
          <div className="text-green-400 mt-2">
            <p>✅ 配置已加载</p>
          </div>
        )}
      </div>

      {/* 环境变量 */}
      <div className="mb-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-bold mb-4">🔧 环境变量</h2>
        <p>VITE_WALLETCONNECT_PROJECT_ID: {import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '❌ 未设置'}</p>
        <p>VITE_PICKAXENFT_ADDRESS: {import.meta.env.VITE_PICKAXENFT_ADDRESS || '❌ 未设置'}</p>
      </div>

      {/* 建议 */}
      <div className="mb-8 p-4 bg-yellow-900 rounded-lg">
        <h2 className="text-xl font-bold mb-4">💡 问题排查</h2>
        {chainId !== 11155111 && (
          <p className="text-yellow-300">⚠️ 请在 MetaMask 中切换到 Sepolia 测试网!</p>
        )}
        {addresses.pickaxeNFT === '0x0000000000000000000000000000000000000000' && (
          <p className="text-red-300">❌ 合约地址为零地址,请检查 addresses.ts 配置!</p>
        )}
        {!level1Config && !loading1 && (
          <p className="text-red-300">❌ 无法读取合约配置,可能原因:</p>
        )}
        <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-sm">
          <li>RPC 连接问题</li>
          <li>合约地址错误</li>
          <li>网络不匹配</li>
          <li>合约函数名错误</li>
        </ul>
      </div>
    </div>
  );
}
