import { createInstance, initFhevm } from 'fhevmjs';
import type { FhevmInstance } from '@/types';

let fhevmInstance: FhevmInstance | null = null;

/**
 * 初始化 fhevmjs 实例
 */
export async function initializeFhevm(): Promise<FhevmInstance> {
  if (fhevmInstance) {
    return fhevmInstance;
  }

  try {
    // 初始化 WASM 模块
    await initFhevm();

    // 创建实例
    // 注意: 这里需要根据实际的 Zama 网络配置调整
    const instance = await createInstance({
      chainId: 8009, // Zama Devnet Chain ID
      // 可能需要其他配置...
    });

    fhevmInstance = instance as unknown as FhevmInstance;
    console.log('✅ fhevmjs 初始化成功');

    return fhevmInstance;
  } catch (error) {
    console.error('❌ fhevmjs 初始化失败:', error);
    throw error;
  }
}

/**
 * 获取 fhevm 实例
 */
export function getFhevmInstance(): FhevmInstance | null {
  return fhevmInstance;
}

/**
 * 重加密加密值(用于前端查看)
 *
 * @param contractAddress 合约地址
 * @param userAddress 用户地址
 * @param encryptedValue 加密值
 * @returns 解密后的 bigint 值
 */
export async function reencryptValue(
  _contractAddress: string,
  _userAddress: string,
  _encryptedValue: string
): Promise<bigint> {
  const instance = getFhevmInstance();
  if (!instance) {
    throw new Error('fhevmjs 未初始化');
  }

  try {
    // TODO: 实现重加密逻辑
    // 这里需要根据 fhevmjs 的实际 API 调整
    // 1. 生成 EIP712 签名
    // 2. 请求重加密
    // 3. 解密结果

    console.warn('⚠️ reencryptValue 功能待实现');
    return 0n; // 临时返回
  } catch (error) {
    console.error('重加密失败:', error);
    throw error;
  }
}

/**
 * 加密输入值
 *
 * @param contractAddress 合约地址
 * @param userAddress 用户地址
 * @param value 要加密的值
 * @returns 加密后的数据
 */
export async function encryptInput(
  contractAddress: string,
  userAddress: string,
  _value: number | bigint
): Promise<Uint8Array> {
  const instance = getFhevmInstance();
  if (!instance) {
    throw new Error('fhevmjs 未初始化');
  }

  try {
    instance.createEncryptedInput(contractAddress, userAddress);
    // TODO: 添加加密值
    // input.add64(value);

    console.warn('⚠️ encryptInput 功能待实现');
    return new Uint8Array(); // 临时返回
  } catch (error) {
    console.error('加密输入失败:', error);
    throw error;
  }
}
