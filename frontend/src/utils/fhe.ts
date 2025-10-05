import { createInstance, FhevmInstance } from 'fhevmjs';

let fhevmInstance: FhevmInstance | null = null;

/**
 * 初始化 FHE 实例
 * 注意: Sepolia 不支持原生 FHE,我们使用 mock 模式进行测试
 */
export async function initializeFHE(): Promise<FhevmInstance> {
  if (fhevmInstance) {
    return fhevmInstance;
  }

  try {
    // Sepolia 不支持 FHE,使用 mock 模式创建实例
    // 实际加密会在前端完成,合约只存储加密后的 bytes
    fhevmInstance = await createInstance({
      chainId: 11155111,
      // 不提供 publicKeyVerifyingContractAddress 将使用 mock 模式
    });

    console.log('✅ FHE 实例初始化成功 (Mock 模式)');
    return fhevmInstance;
  } catch (error) {
    console.error('❌ FHE 实例初始化失败:', error);
    throw error;
  }
}

/**
 * 获取当前 FHE 实例
 */
export function getFHEInstance(): FhevmInstance {
  if (!fhevmInstance) {
    throw new Error('FHE 实例未初始化,请先调用 initializeFHE()');
  }
  return fhevmInstance;
}

/**
 * 生成加密的随机幸运值
 * Sepolia 测试版本: 生成模拟加密数据
 *
 * @param luckMin 最小幸运值
 * @param luckMax 最大幸运值
 * @param contractAddress 合约地址
 * @param userAddress 用户地址
 * @returns 加密的幸运值(Uint8Array)
 */
export async function generateEncryptedLuck(
  luckMin: number,
  luckMax: number,
  contractAddress: string,
  userAddress: string
): Promise<Uint8Array> {
  // 生成随机数
  const randomValue = Math.floor(Math.random() * (luckMax - luckMin + 1)) + luckMin;

  console.log(`🎲 生成加密幸运值: ${randomValue} (范围: ${luckMin}-${luckMax})`);

  // Sepolia 不支持真正的 FHE,生成模拟的加密数据
  // 在生产环境(Zama Devnet)中,这里会使用真正的 FHE 加密

  // 创建一个包含随机值的 Uint8Array (模拟加密数据)
  // 格式: [value, ...random_padding]
  const mockEncryptedData = new Uint8Array(32); // 32 字节的模拟加密数据
  mockEncryptedData[0] = randomValue; // 第一个字节存储实际值

  // 填充随机数据使其看起来像加密数据
  for (let i = 1; i < 32; i++) {
    mockEncryptedData[i] = Math.floor(Math.random() * 256);
  }

  console.log(`📦 模拟加密数据生成成功 (长度: ${mockEncryptedData.length} bytes)`);

  return mockEncryptedData;
}

/**
 * 清理 FHE 实例
 */
export function cleanupFHE() {
  fhevmInstance = null;
  console.log('🧹 FHE 实例已清理');
}
