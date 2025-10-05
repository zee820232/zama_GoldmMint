import "@nomicfoundation/hardhat-ethers";
import dotenv from "dotenv";

dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true,        // 必须启用! 解决 FHE 合约栈深度问题
      evmVersion: "cancun"
    }
  },
  networks: {
    // 本地 Hardhat 网络
    hardhat: {
      type: "edr-simulated",
      chainId: 31337
    },

    // Localhost (用于本地测试)
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },

    // Sepolia 测试网
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/YOUR_KEY",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111
    },

    // Zama fhEVM Devnet (官方测试网)
    zamaDevnet: {
      url: process.env.ZAMA_RPC_URL || "https://devnet.zama.ai",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 9000,  // 根据最新文档更新为 9000
      timeout: 120000, // 2分钟超时 (FHE 操作可能较慢)
      gasPrice: "auto",
      // Zama 特定配置
      gatewayUrl: process.env.ZAMA_GATEWAY_URL || "https://gateway.devnet.zama.ai",
      aclAddress: process.env.ZAMA_ACL_ADDRESS || "0x2Fb4341027eb1d2aD8B5D9708187df8633cAFA92" // 默认 ACL 地址
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD"
  },
  // 默认网络
  defaultNetwork: "hardhat"
};
