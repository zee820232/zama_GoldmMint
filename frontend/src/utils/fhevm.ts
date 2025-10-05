import { createInstance, initFhevm, FhevmInstance as FhevmjsInstance } from 'fhevmjs';
import type { BrowserProvider } from 'ethers';

let fhevmInstance: FhevmjsInstance | null = null;
let isInitializing = false;

/**
 * 初始化 fhevmjs WASM 模块
 * 这个函数只需要调用一次
 */
export async function initializeFhevm(): Promise<void> {
  if (isInitializing) {
    console.log('⏳ fhevmjs 正在初始化中...');
    return;
  }

  try {
    isInitializing = true;
    await initFhevm();
    console.log('✅ fhevmjs WASM 模块初始化成功');
  } catch (error) {
    console.error('❌ fhevmjs WASM 初始化失败:', error);
    throw error;
  } finally {
    isInitializing = false;
  }
}

/**
 * 创建 fhevmjs 实例
 *
 * @param provider ethers provider
 * @param chainId 链 ID
 * @returns fhevmjs 实例
 */
export async function createFhevmInstance(
  provider: BrowserProvider,
  chainId: number
): Promise<FhevmjsInstance> {
  try {
    // 确保 WASM 已初始化
    if (isInitializing) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (!fhevmInstance) {
      await initializeFhevm();
    }

    // 获取网络信息
    const network = await provider.getNetwork();
    const networkUrl = network.name === 'unknown'
      ? 'http://localhost:8545'
      : `https://devnet.zama.ai`;

    console.log('📡 创建 fhevmjs 实例:', { chainId, networkUrl });

    // 创建实例
    const instance = await createInstance({
      chainId,
      publicKeyVerifier: networkUrl,
      // gatewayUrl 可选,用于重加密请求
    });

    fhevmInstance = instance;
    console.log('✅ fhevmjs 实例创建成功');

    return instance;
  } catch (error) {
    console.error('❌ fhevmjs 实例创建失败:', error);
    throw error;
  }
}

/**
 * 获取当前 fhevm 实例
 */
export function getFhevmInstance(): FhevmjsInstance | null {
  return fhevmInstance;
}

/**
 * 重置 fhevm 实例 (网络切换时使用)
 */
export function resetFhevmInstance(): void {
  fhevmInstance = null;
  console.log('🔄 fhevmjs 实例已重置');
}

/**
 * 重加密加密值 (用于前端查看)
 *
 * @param instance fhevmjs 实例
 * @param contractAddress 合约地址
 * @param userAddress 用户地址
 * @param encryptedValue 从合约获取的加密句柄
 * @param signer ethers signer (用于签名)
 * @returns 解密后的 bigint 值
 */
export async function reencryptValue(
  instance: FhevmjsInstance,
  contractAddress: string,
  userAddress: string,
  encryptedValue: bigint | string,
  signer: any
): Promise<bigint> {
  try {
    // 将加密句柄转换为字符串格式
    const handle = typeof encryptedValue === 'bigint'
      ? `0x${encryptedValue.toString(16).padStart(64, '0')}`
      : encryptedValue;

    console.log('🔐 开始重加密:', { contractAddress, userAddress, handle });

    // 生成 EIP712 签名所需的公钥和签名
    const { publicKey, signature } = await instance.generateToken({
      verifyingContract: contractAddress,
    });

    // 使用 wallet signer 签名
    const eip712Signature = await signer.signTypedData(
      signature.domain,
      signature.types,
      signature.message
    );

    console.log('✍️ EIP712 签名完成');

    // 重加密请求
    const decryptedValue = instance.reencrypt(
      handle,
      publicKey,
      eip712Signature,
      contractAddress,
      userAddress
    );

    console.log('✅ 重加密成功:', decryptedValue);

    return BigInt(decryptedValue);
  } catch (error) {
    console.error('❌ 重加密失败:', error);
    throw new Error(`重加密失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 加密输入值 (用于发送交易)
 *
 * @param instance fhevmjs 实例
 * @param contractAddress 合约地址
 * @param userAddress 用户地址
 * @param value 要加密的值
 * @param bits 加密位数 (8, 16, 32, 64)
 * @returns 加密后的输入数据
 */
export async function encryptInput(
  instance: FhevmjsInstance,
  contractAddress: string,
  userAddress: string,
  value: number | bigint,
  bits: 8 | 16 | 32 | 64 = 64
): Promise<{ data: Uint8Array; inputProof: string }> {
  try {
    const input = instance.createEncryptedInput(contractAddress, userAddress);

    // 根据位数选择加密方法
    switch (bits) {
      case 8:
        input.add8(Number(value));
        break;
      case 16:
        input.add16(Number(value));
        break;
      case 32:
        input.add32(Number(value));
        break;
      case 64:
        input.add64(BigInt(value));
        break;
    }

    const encryptedInput = input.encrypt();

    console.log('🔒 输入加密成功');

    return {
      data: encryptedInput.data,
      inputProof: encryptedInput.inputProof,
    };
  } catch (error) {
    console.error('❌ 输入加密失败:', error);
    throw new Error(`输入加密失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}
