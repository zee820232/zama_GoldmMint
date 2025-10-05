import hre from "hardhat";
import fs from "fs";

async function main() {
  console.log("🚀 开始部署 Zama 矿工应用合约...\n");

  const signers = await hre.ethers.getSigners();
  const deployer = signers[0];

  console.log("📍 部署地址:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 账户余额:", hre.ethers.formatEther(balance), "ETH\n");

  // ========== 1. 部署 GoldToken ==========
  console.log("1️⃣  部署 GoldToken...");
  const GoldToken = await hre.ethers.getContractFactory("GoldToken");
  const goldToken = await GoldToken.deploy();
  await goldToken.waitForDeployment();
  const goldTokenAddress = await goldToken.getAddress();
  console.log("✅ GoldToken 部署成功:", goldTokenAddress);

  // ========== 2. 部署 PickaxeNFT ==========
  console.log("2️⃣  部署 PickaxeNFT...");
  const PickaxeNFT = await hre.ethers.getContractFactory("PickaxeNFT");
  const pickaxeNFT = await PickaxeNFT.deploy();
  await pickaxeNFT.waitForDeployment();
  const pickaxeNFTAddress = await pickaxeNFT.getAddress();
  console.log("✅ PickaxeNFT 部署成功:", pickaxeNFTAddress);

  // ========== 3. 部署 MiningEngine ==========
  console.log("3️⃣  部署 MiningEngine...");
  const MiningEngine = await hre.ethers.getContractFactory("MiningEngine");
  const miningEngine = await MiningEngine.deploy(
    pickaxeNFTAddress,
    goldTokenAddress
  );
  await miningEngine.waitForDeployment();
  const miningEngineAddress = await miningEngine.getAddress();
  console.log("✅ MiningEngine 部署成功:", miningEngineAddress);

  // ========== 4. 部署 TreasureNFT ==========
  console.log("4️⃣  部署 TreasureNFT...");
  const TreasureNFT = await hre.ethers.getContractFactory("TreasureNFT");
  const treasureNFT = await TreasureNFT.deploy();
  await treasureNFT.waitForDeployment();
  const treasureNFTAddress = await treasureNFT.getAddress();
  console.log("✅ TreasureNFT 部署成功:", treasureNFTAddress);

  // ========== 5. 配置权限 ==========
  console.log("5️⃣  配置合约权限...");
  await pickaxeNFT.setMiningEngine(miningEngineAddress);
  await goldToken.addMinter(miningEngineAddress);
  await treasureNFT.addMinter(miningEngineAddress);
  await miningEngine.setTreasureNFT(treasureNFTAddress);
  console.log("✅ 权限配置完成\n");

  // ========== 5. 输出摘要 ==========
  console.log("=" + "=".repeat(70));
  console.log("📋 部署成功!");
  console.log("=" + "=".repeat(70));
  console.log(`
合约地址:
  - GoldToken:     ${goldTokenAddress}
  - PickaxeNFT:    ${pickaxeNFTAddress}
  - MiningEngine:  ${miningEngineAddress}
  - TreasureNFT:   ${treasureNFTAddress}
  `);
  console.log("=" + "=".repeat(70));

  // 保存部署信息
  const deploymentInfo = {
    network: "localhost",
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      GoldToken: goldTokenAddress,
      PickaxeNFT: pickaxeNFTAddress,
      MiningEngine: miningEngineAddress,
      TreasureNFT: treasureNFTAddress
    }
  };

  fs.writeFileSync("deployment-localhost.json", JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 部署信息已保存\n");
}

main().catch((error) => {
  console.error("❌ 部署失败:", error);
  process.exit(1);
});
