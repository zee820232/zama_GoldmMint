import hre from "hardhat";
import fs from "fs";

/**
 * 交互测试脚本 - 演示完整游戏流程
 *
 * 流程:
 * 1. 铸造锄头 NFT
 * 2. 执行挖矿操作
 * 3. 查看加密收益(需重加密)
 * 4. 领取金币奖励
 * 5. 领取稀有物品
 */

async function main() {
  console.log("🎮 开始 Zama 矿工游戏交互测试\n");

  // 读取部署信息
  if (!fs.existsSync("deployment-localhost.json")) {
    console.error("❌ 未找到部署信息,请先运行 npm run deploy:local");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync("deployment-localhost.json", "utf8"));
  const { GoldToken, PickaxeNFT, MiningEngine, TreasureNFT } = deployment.contracts;

  console.log("📍 合约地址:");
  console.log(`  - GoldToken:   ${GoldToken}`);
  console.log(`  - PickaxeNFT:  ${PickaxeNFT}`);
  console.log(`  - MiningEngine: ${MiningEngine}`);
  console.log(`  - TreasureNFT: ${TreasureNFT}\n`);

  // 获取账户
  const [player1, player2] = await hre.ethers.getSigners();
  console.log("👤 玩家地址:", player1.address);
  console.log("💰 余额:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(player1.address)), "ETH\n");

  // 获取合约实例
  const goldToken = await hre.ethers.getContractAt("GoldToken", GoldToken);
  const pickaxeNFT = await hre.ethers.getContractAt("PickaxeNFT", PickaxeNFT);
  const miningEngine = await hre.ethers.getContractAt("MiningEngine", MiningEngine);
  const treasureNFT = await hre.ethers.getContractAt("TreasureNFT", TreasureNFT);

  console.log("=" + "=".repeat(70));
  console.log("第一步: 铸造锄头 NFT");
  console.log("=" + "=".repeat(70));

  // 获取等级 1 的价格
  const level1Config = await pickaxeNFT.levelConfigs(1);
  const mintPrice = level1Config.mintPrice;
  console.log(`\n💎 等级 1 锄头价格: ${hre.ethers.formatEther(mintPrice)} ETH`);

  // 铸造锄头
  console.log("⚒️  正在铸造...");
  const mintTx = await pickaxeNFT.mintPickaxe(1, { value: mintPrice });
  const mintReceipt = await mintTx.wait();

  // 获取铸造的 NFT ID
  const mintEvent = mintReceipt.logs.find(
    (log) => log.fragment && log.fragment.name === "PickaxeMinted"
  );
  const pickaxeId = mintEvent ? mintEvent.args[1] : 1n;

  console.log(`✅ 成功铸造锄头 #${pickaxeId}\n`);

  // 查看锄头属性
  const [level, durabilityMax, durability, efficiency] = await pickaxeNFT.getAttributes(pickaxeId);
  console.log("🔍 锄头属性:");
  console.log(`  - 等级: ${level}`);
  console.log(`  - 耐久: ${durability}/${durabilityMax}`);
  console.log(`  - 效率: ${efficiency}%`);
  console.log(`  - 幸运值: [加密,需重加密查看]\n`);

  console.log("=" + "=".repeat(70));
  console.log("第二步: 挖矿操作");
  console.log("=" + "=".repeat(70));

  // 执行 5 次挖矿
  const mineCount = 5;
  console.log(`\n⛏️  执行 ${mineCount} 次挖矿...\n`);

  for (let i = 1; i <= mineCount; i++) {
    console.log(`  [${i}/${mineCount}] 挖矿中...`);
    const mineTx = await miningEngine.mine(pickaxeId);
    await mineTx.wait();
    console.log(`  ✅ 第 ${i} 次挖矿完成`);
  }

  console.log("\n✅ 所有挖矿操作完成!\n");

  // 查看挖矿统计
  const [miningCount, lastMiningTime] = await miningEngine.getPlayerStats(player1.address);
  console.log("📊 挖矿统计:");
  console.log(`  - 总挖矿次数: ${miningCount}`);
  console.log(`  - 上次挖矿时间: ${new Date(Number(lastMiningTime) * 1000).toLocaleString()}\n`);

  // 查看锄头剩余耐久
  const [, , currentDurability] = await pickaxeNFT.getAttributes(pickaxeId);
  console.log(`🔧 锄头剩余耐久: ${currentDurability}/${durabilityMax}\n`);

  console.log("=" + "=".repeat(70));
  console.log("第三步: 查看加密收益");
  console.log("=" + "=".repeat(70));

  console.log(`
⚠️  注意:
在真实的 Zama fhEVM 环境中,需要通过以下步骤查看加密数据:
1. 前端使用 fhevmjs 生成公钥
2. 请求合约重加密收益数据
3. 使用私钥解密查看

当前演示环境暂无法显示加密收益的明文值。
`);

  console.log("=" + "=".repeat(70));
  console.log("第四步: 领取金币奖励(简化方案)");
  console.log("=" + "=".repeat(70));

  // 简化方案:玩家声明要领取的金额
  const claimAmount = 100n;
  console.log(`\n💰 尝试领取 ${claimAmount} GOLD 代币...`);

  try {
    const claimTx = await miningEngine.claimRewards(claimAmount);
    await claimTx.wait();
    console.log("✅ 领取成功!\n");

    // 查看金币余额
    const goldBalance = await goldToken.balanceOf(player1.address);
    console.log(`🪙 当前 GOLD 余额: ${hre.ethers.formatEther(goldBalance)}\n`);
  } catch (error) {
    console.log("⚠️  领取失败(可能余额不足):", error.message, "\n");
  }

  console.log("=" + "=".repeat(70));
  console.log("第五步: 领取稀有物品(如果有史诗掉落)");
  console.log("=" + "=".repeat(70));

  console.log(`
ℹ️  说明:
- 挖矿时如果触发史诗掉落,会累加到加密计数器
- 玩家通过重加密查看 epicDrops 数量
- 调用 claimTreasure(count) 领取稀有物品

当前演示:假设有 1 次史诗掉落
`);

  try {
    console.log("🎁 尝试领取 1 个稀有物品...");
    const treasureTx = await miningEngine.claimTreasure(1);
    const treasureReceipt = await treasureTx.wait();
    console.log("✅ 领取成功!\n");

    // 查看稀有物品
    const [itemIds, balances] = await treasureNFT.getPlayerItems(player1.address);
    console.log("🎒 稀有物品背包:");
    for (let i = 0; i < itemIds.length; i++) {
      if (balances[i] > 0) {
        const itemName = await treasureNFT.getItemName(itemIds[i]);
        console.log(`  - ${itemName}: ${balances[i]}`);
      }
    }
    console.log();
  } catch (error) {
    console.log("⚠️  领取失败(可能没有史诗掉落):", error.message.slice(0, 100), "\n");
  }

  console.log("=" + "=".repeat(70));
  console.log("测试完成总结");
  console.log("=" + "=".repeat(70));

  console.log(`
✅ 完成的操作:
1. ✅ 铸造锄头 NFT #${pickaxeId}
2. ✅ 执行 ${mineCount} 次挖矿
3. ⚠️  查看加密收益(需 fhevmjs 重加密)
4. ⚠️  领取金币奖励(简化方案)
5. ⚠️  领取稀有物品(取决于掉落)

📋 关键发现:
- FHE 加密状态需要前端重加密才能查看
- 简化版 claimRewards 允许玩家声明领取金额
- 合约验证余额但无法直接解密判断
- 真实环境需要集成 Zama Gateway

🎯 下一步:
- 集成 Zama Gateway 实现完整解密
- 开发前端 DApp(React + fhevmjs)
- 部署到 Sepolia 测试网
`);
}

main().catch((error) => {
  console.error("❌ 测试失败:", error);
  process.exit(1);
});
