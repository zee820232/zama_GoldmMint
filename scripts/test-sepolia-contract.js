import hre from "hardhat";
const { ethers } = hre;

/**
 * 测试 Sepolia 合约是否可以正常调用
 */

const ADDRESSES = {
  pickaxeNFT: "0xAB2F5407cf2d6A7aEd976F670241b2a6D3B55D7F",
  miningEngine: "0x6D2743CdbEb8B998fCf748e93EF815a51A5Ee1b7",
  goldToken: "0x16c242974D30F1209f98749Af4e13e1438950Cb6",
};

async function main() {
  console.log("🧪 测试 Sepolia 合约调用...\n");

  // 获取 PickaxeNFT 合约
  const PickaxeNFT = await ethers.getContractAt("PickaxeNFT", ADDRESSES.pickaxeNFT);

  console.log("1️⃣  测试 levelConfigs(1)...");
  try {
    const config = await PickaxeNFT.levelConfigs(1); // 使用正确的函数名
    console.log("   ✅ Level 1 配置:");
    console.log("      价格:", ethers.formatEther(config.mintPrice), "ETH");
    console.log("      最大耐久:", config.durabilityMax.toString());
    console.log("      效率:", config.efficiency.toString());
    console.log("      幸运值范围:", config.luckMin.toString(), "-", config.luckMax.toString());
  } catch (error) {
    console.log("   ❌ 调用失败:", error.message);
  }

  console.log("\n2️⃣  测试 levelConfigs(5)...");
  try {
    const config = await PickaxeNFT.levelConfigs(5); // 使用正确的函数名
    console.log("   ✅ Level 5 配置:");
    console.log("      价格:", ethers.formatEther(config.mintPrice), "ETH");
    console.log("      最大耐久:", config.durabilityMax.toString());
  } catch (error) {
    console.log("   ❌ 调用失败:", error.message);
  }

  console.log("\n3️⃣  测试合约名称...");
  try {
    const name = await PickaxeNFT.name();
    const symbol = await PickaxeNFT.symbol();
    console.log("   ✅ 合约:", name, "(" + symbol + ")");
  } catch (error) {
    console.log("   ❌ 调用失败:", error.message);
  }

  console.log("\n4️⃣  检查 MiningEngine 地址...");
  try {
    const miningEngine = await PickaxeNFT.miningEngine();
    console.log("   当前 MiningEngine:", miningEngine);
    console.log("   预期 MiningEngine:", ADDRESSES.miningEngine);
    console.log("   状态:", miningEngine.toLowerCase() === ADDRESSES.miningEngine.toLowerCase() ? "✅ 正确" : "❌ 不匹配");
  } catch (error) {
    console.log("   ❌ 调用失败:", error.message);
  }

  console.log("\n✅ 测试完成!");
  console.log("\n💡 如果所有调用都成功,说明合约部署正常");
  console.log("   如果前端仍显示'请连接正确网络',可能是:");
  console.log("   1. 前端 RPC 连接问题");
  console.log("   2. Wagmi 配置问题");
  console.log("   3. 浏览器钱包网络不匹配");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 测试失败:", error);
    process.exit(1);
  });
