import hre from "hardhat";
const { ethers } = hre;

const ADDRESSES = {
  pickaxeNFT: "0xAB2F5407cf2d6A7aEd976F670241b2a6D3B55D7F",
};

async function main() {
  console.log("🧪 测试铸造锄头...\n");

  const [signer] = await ethers.getSigners();
  console.log("账户:", signer.address);

  const balance = await ethers.provider.getBalance(signer.address);
  console.log("余额:", ethers.formatEther(balance), "ETH\n");

  const PickaxeNFT = await ethers.getContractAt("PickaxeNFT", ADDRESSES.pickaxeNFT);

  // 测试铸造 Level 1
  console.log("1️⃣  尝试铸造 Level 1 锄头...");
  try {
    const config = await PickaxeNFT.levelConfigs(1);
    console.log("   价格:", ethers.formatEther(config.mintPrice), "ETH");

    // 尝试铸造
    const tx = await PickaxeNFT.mintPickaxe(1, {
      value: config.mintPrice,
      gasLimit: 500000, // 手动设置 gas limit
    });

    console.log("   交易已发送:", tx.hash);
    console.log("   等待确认...");

    const receipt = await tx.wait();
    console.log("   ✅ 铸造成功!");
    console.log("   Gas 使用:", receipt.gasUsed.toString());

    // 检查是否收到 NFT
    const balance = await PickaxeNFT.balanceOf(signer.address);
    console.log("   当前拥有锄头数量:", balance.toString());

  } catch (error) {
    console.log("   ❌ 铸造失败!");
    console.log("   错误类型:", error.code);
    console.log("   错误信息:", error.message);

    if (error.reason) {
      console.log("   失败原因:", error.reason);
    }

    if (error.data) {
      console.log("   错误数据:", error.data);
    }

    // 尝试解析 revert 原因
    if (error.error && error.error.message) {
      console.log("   Revert 信息:", error.error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("脚本执行失败:", error);
    process.exit(1);
  });
