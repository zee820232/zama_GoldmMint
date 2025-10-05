import hre from "hardhat";
const { ethers } = hre;

/**
 * 配置 Sepolia 上已部署的合约权限
 *
 * 合约地址 (从上次部署获取):
 * - GoldToken: 0x16c242974D30F1209f98749Af4e13e1438950Cb6
 * - PickaxeNFT: 0xAB2F5407cf2d6A7aEd976F670241b2a6D3B55D7F
 * - MiningEngine: 0x6D2743CdbEb8B998fCf748e93EF815a51A5Ee1b7
 * - TreasureNFT: 0x9d8f35858c6B2C9bd1708436744f325BDaeC5578
 */

async function main() {
  console.log("🔧 开始配置 Sepolia 合约权限...\n");

  // 合约地址
  const addresses = {
    goldToken: "0x16c242974D30F1209f98749Af4e13e1438950Cb6",
    pickaxeNFT: "0xAB2F5407cf2d6A7aEd976F670241b2a6D3B55D7F",
    miningEngine: "0x6D2743CdbEb8B998fCf748e93EF815a51A5Ee1b7",
    treasureNFT: "0x9d8f35858c6B2C9bd1708436744f325BDaeC5578"
  };

  // 获取签名者
  const [deployer] = await ethers.getSigners();
  console.log("📍 配置账户:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 账户余额:", ethers.formatEther(balance), "ETH\n");

  // 获取合约实例
  const GoldToken = await ethers.getContractAt("GoldToken", addresses.goldToken);
  const PickaxeNFT = await ethers.getContractAt("PickaxeNFT", addresses.pickaxeNFT);
  const MiningEngine = await ethers.getContractAt("MiningEngine", addresses.miningEngine);
  const TreasureNFT = await ethers.getContractAt("TreasureNFT", addresses.treasureNFT);

  console.log("5️⃣  配置 GoldToken 权限...");
  try {
    // 检查 MiningEngine 是否已有 minter 权限
    const isMinter = await GoldToken.hasRole(
      await GoldToken.MINTER_ROLE(),
      addresses.miningEngine
    );

    if (!isMinter) {
      const tx1 = await GoldToken.addMinter(addresses.miningEngine, {
        gasLimit: 100000,
        maxFeePerGas: ethers.parseUnits("50", "gwei"),
        maxPriorityFeePerGas: ethers.parseUnits("2", "gwei")
      });
      await tx1.wait();
      console.log("   ✅ MiningEngine 已添加为 minter");
    } else {
      console.log("   ✅ MiningEngine 已有 minter 权限");
    }
  } catch (error) {
    console.log("   ⚠️ 权限配置失败:", error.message);
  }

  console.log("\n6️⃣  配置 PickaxeNFT 关联...");
  try {
    const currentMiningEngine = await PickaxeNFT.miningEngine();
    if (currentMiningEngine === ethers.ZeroAddress) {
      const tx2 = await PickaxeNFT.setMiningEngine(addresses.miningEngine, {
        gasLimit: 100000,
        maxFeePerGas: ethers.parseUnits("50", "gwei"),
        maxPriorityFeePerGas: ethers.parseUnits("2", "gwei")
      });
      await tx2.wait();
      console.log("   ✅ MiningEngine 已关联到 PickaxeNFT");
    } else {
      console.log("   ✅ PickaxeNFT 已关联 MiningEngine");
    }
  } catch (error) {
    console.log("   ⚠️ 关联失败:", error.message);
  }

  console.log("\n7️⃣  配置 TreasureNFT 权限...");
  try {
    const isMinter = await TreasureNFT.hasRole(
      await TreasureNFT.MINTER_ROLE(),
      addresses.miningEngine
    );

    if (!isMinter) {
      const tx3 = await TreasureNFT.addMinter(addresses.miningEngine, {
        gasLimit: 100000,
        maxFeePerGas: ethers.parseUnits("50", "gwei"),
        maxPriorityFeePerGas: ethers.parseUnits("2", "gwei")
      });
      await tx3.wait();
      console.log("   ✅ MiningEngine 已添加为 minter");
    } else {
      console.log("   ✅ MiningEngine 已有 minter 权限");
    }
  } catch (error) {
    console.log("   ⚠️ 权限配置失败:", error.message);
  }

  // 保存部署信息
  const deployment = {
    network: "sepolia",
    chainId: 11155111,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: addresses,
    explorer: {
      goldToken: `https://sepolia.etherscan.io/address/${addresses.goldToken}`,
      pickaxeNFT: `https://sepolia.etherscan.io/address/${addresses.pickaxeNFT}`,
      miningEngine: `https://sepolia.etherscan.io/address/${addresses.miningEngine}`,
      treasureNFT: `https://sepolia.etherscan.io/address/${addresses.treasureNFT}`
    }
  };

  // 写入文件
  const fs = await import('fs');
  fs.writeFileSync(
    './deployment-sepolia.json',
    JSON.stringify(deployment, null, 2)
  );

  console.log("\n✅ 配置完成!");
  console.log("\n📝 部署信息已保存到: deployment-sepolia.json");
  console.log("\n🔍 在 Sepolia Etherscan 查看合约:");
  console.log("   GoldToken:", deployment.explorer.goldToken);
  console.log("   PickaxeNFT:", deployment.explorer.pickaxeNFT);
  console.log("   MiningEngine:", deployment.explorer.miningEngine);
  console.log("   TreasureNFT:", deployment.explorer.treasureNFT);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 配置失败:", error);
    process.exit(1);
  });
