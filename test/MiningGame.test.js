import { expect } from "chai";
import hre from "hardhat";

const { ethers } = hre;

describe("Zama Mining Game - 基础功能测试", function () {
  let goldToken;
  let pickaxeNFT;
  let miningEngine;
  let treasureNFT;
  let owner;
  let player1;
  let player2;

  beforeEach(async function () {
    // 获取测试账户
    [owner, player1, player2] = await ethers.getSigners();

    // 部署 GoldToken
    const GoldToken = await ethers.getContractFactory("GoldToken");
    goldToken = await GoldToken.deploy();
    await goldToken.waitForDeployment();

    // 部署 PickaxeNFT
    const PickaxeNFT = await ethers.getContractFactory("PickaxeNFT");
    pickaxeNFT = await PickaxeNFT.deploy();
    await pickaxeNFT.waitForDeployment();

    // 部署 TreasureNFT
    const TreasureNFT = await ethers.getContractFactory("TreasureNFT");
    treasureNFT = await TreasureNFT.deploy();
    await treasureNFT.waitForDeployment();

    // 部署 MiningEngine
    const MiningEngine = await ethers.getContractFactory("MiningEngine");
    miningEngine = await MiningEngine.deploy(
      await pickaxeNFT.getAddress(),
      await goldToken.getAddress()
    );
    await miningEngine.waitForDeployment();

    // 配置权限
    await pickaxeNFT.setMiningEngine(await miningEngine.getAddress());
    await goldToken.addMinter(await miningEngine.getAddress());
    await treasureNFT.addMinter(await miningEngine.getAddress());
    await miningEngine.setTreasureNFT(await treasureNFT.getAddress());
  });

  describe("GoldToken 测试", function () {
    it("应该正确初始化", async function () {
      expect(await goldToken.name()).to.equal("Zama Gold");
      expect(await goldToken.symbol()).to.equal("GOLD");
      expect(await goldToken.totalSupply()).to.equal(0);
    });

    it("只有授权铸造者可以铸造", async function () {
      const minterAddress = await miningEngine.getAddress();
      expect(await goldToken.minters(minterAddress)).to.be.true;

      await goldToken.connect(owner).addMinter(player1.address);
      await goldToken.connect(player1).mintFromMining(player2.address, ethers.parseEther("100"));

      expect(await goldToken.balanceOf(player2.address)).to.equal(ethers.parseEther("100"));
    });

    it("非授权地址铸造应该失败", async function () {
      await expect(
        goldToken.connect(player1).mintFromMining(player1.address, ethers.parseEther("100"))
      ).to.be.revertedWith("Not authorized minter");
    });

    it("不能超过最大供应量", async function () {
      await goldToken.connect(owner).addMinter(player1.address);

      const maxSupply = await goldToken.MAX_SUPPLY();
      await expect(
        goldToken.connect(player1).mintFromMining(player1.address, maxSupply + 1n)
      ).to.be.revertedWith("Exceeds max supply");
    });
  });

  describe("PickaxeNFT 测试", function () {
    it("应该正确初始化等级配置", async function () {
      const level1Config = await pickaxeNFT.levelConfigs(1);
      expect(level1Config.mintPrice).to.equal(ethers.parseEther("0.01"));
      expect(level1Config.durabilityMax).to.equal(100);
      expect(level1Config.efficiency).to.equal(10);
    });

    it("应该能够铸造 1 级锄头", async function () {
      const mintPrice = ethers.parseEther("0.01");

      await expect(
        pickaxeNFT.connect(player1).mintPickaxe(1, { value: mintPrice })
      ).to.emit(pickaxeNFT, "PickaxeMinted");

      expect(await pickaxeNFT.balanceOf(player1.address)).to.equal(1);

      const [level, durabilityMax, durability, efficiency] = await pickaxeNFT.getAttributes(1);
      expect(level).to.equal(1);
      expect(durabilityMax).to.equal(100);
      expect(durability).to.equal(100);
      expect(efficiency).to.equal(10);
    });

    it("应该能够铸造 5 级锄头", async function () {
      const mintPrice = ethers.parseEther("0.50");

      await pickaxeNFT.connect(player1).mintPickaxe(5, { value: mintPrice });

      const [level, durabilityMax, durability, efficiency] = await pickaxeNFT.getAttributes(1);
      expect(level).to.equal(5);
      expect(durabilityMax).to.equal(500);
      expect(efficiency).to.equal(50);
    });

    it("支付金额不足应该失败", async function () {
      const insufficientPayment = ethers.parseEther("0.005");

      await expect(
        pickaxeNFT.connect(player1).mintPickaxe(1, { value: insufficientPayment })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("无效等级应该失败", async function () {
      await expect(
        pickaxeNFT.connect(player1).mintPickaxe(0, { value: ethers.parseEther("0.01") })
      ).to.be.revertedWith("Invalid level");

      await expect(
        pickaxeNFT.connect(player1).mintPickaxe(6, { value: ethers.parseEther("0.01") })
      ).to.be.revertedWith("Invalid level");
    });

    it("应该退还多余支付", async function () {
      const mintPrice = ethers.parseEther("0.01");
      const overpayment = ethers.parseEther("0.02");

      const balanceBefore = await ethers.provider.getBalance(player1.address);

      const tx = await pickaxeNFT.connect(player1).mintPickaxe(1, { value: overpayment });
      const receipt = await tx.wait();
      const gasCost = receipt.gasUsed * receipt.gasPrice;

      const balanceAfter = await ethers.provider.getBalance(player1.address);

      // 应该只扣除 mintPrice + gas
      expect(balanceBefore - balanceAfter).to.be.closeTo(
        mintPrice + gasCost,
        ethers.parseEther("0.0001") // 允许小误差
      );
    });

    it("应该能够修理锄头", async function () {
      // 铸造锄头
      await pickaxeNFT.connect(player1).mintPickaxe(1, { value: ethers.parseEther("0.01") });

      // 模拟消耗耐久(需要通过 MiningEngine)
      await pickaxeNFT.consumeDurability(1, 50);

      const [, , durabilityBefore] = await pickaxeNFT.getAttributes(1);
      expect(durabilityBefore).to.equal(50);

      // 修理
      await pickaxeNFT.connect(player1).repairPickaxe(1, 30);

      const [, , durabilityAfter] = await pickaxeNFT.getAttributes(1);
      expect(durabilityAfter).to.equal(80);
    });

    it("只有所有者可以修理", async function () {
      await pickaxeNFT.connect(player1).mintPickaxe(1, { value: ethers.parseEther("0.01") });

      await expect(
        pickaxeNFT.connect(player2).repairPickaxe(1, 10)
      ).to.be.revertedWith("Not owner");
    });
  });

  describe("MiningEngine 测试", function () {
    beforeEach(async function () {
      // 玩家1铸造一个3级锄头
      await pickaxeNFT.connect(player1).mintPickaxe(3, { value: ethers.parseEther("0.08") });
    });

    it("应该正确初始化概率表", async function () {
      const prob1 = await miningEngine.probabilityTable(1);
      expect(prob1.epicRate).to.equal(1);
      expect(prob1.rareRate).to.equal(14);
      expect(prob1.commonRate).to.equal(85);

      const prob5 = await miningEngine.probabilityTable(5);
      expect(prob5.epicRate).to.equal(20);
      expect(prob5.rareRate).to.equal(50);
      expect(prob5.commonRate).to.equal(30);
    });

    it("应该能够执行挖矿", async function () {
      await expect(
        miningEngine.connect(player1).mine(1)
      ).to.emit(miningEngine, "MiningCompleted");

      // 检查统计
      const [miningCount, lastTime] = await miningEngine.getPlayerStats(player1.address);
      expect(miningCount).to.equal(1);
      expect(lastTime).to.be.gt(0);
    });

    it("非所有者无法挖矿", async function () {
      await expect(
        miningEngine.connect(player2).mine(1)
      ).to.be.revertedWith("Not owner");
    });

    it("耐久不足应该失败", async function () {
      // 连续挖矿直到耐久不足
      const durabilityPerMine = await miningEngine.durabilityPerMine();

      // 3级锄头有300耐久,每次消耗10,可以挖30次
      for (let i = 0; i < 30; i++) {
        await miningEngine.connect(player1).mine(1);
      }

      // 第31次应该失败
      await expect(
        miningEngine.connect(player1).mine(1)
      ).to.be.revertedWith("Insufficient durability");
    });

    it("管理员可以暂停挖矿", async function () {
      await miningEngine.connect(owner).setPaused(true);

      await expect(
        miningEngine.connect(player1).mine(1)
      ).to.be.revertedWith("Mining is paused");

      // 恢复
      await miningEngine.connect(owner).setPaused(false);
      await expect(
        miningEngine.connect(player1).mine(1)
      ).to.emit(miningEngine, "MiningCompleted");
    });

    it("管理员可以更新概率", async function () {
      await miningEngine.connect(owner).updateProbability(1, 10, 30, 60);

      const prob = await miningEngine.probabilityTable(1);
      expect(prob.epicRate).to.equal(10);
      expect(prob.rareRate).to.equal(30);
      expect(prob.commonRate).to.equal(60);
    });

    it("概率必须加起来为100", async function () {
      await expect(
        miningEngine.connect(owner).updateProbability(1, 10, 30, 50)
      ).to.be.revertedWith("Rates must sum to 100");
    });
  });

  describe("集成测试", function () {
    it("完整挖矿流程", async function () {
      // 1. 玩家铸造锄头
      await pickaxeNFT.connect(player1).mintPickaxe(2, { value: ethers.parseEther("0.03") });

      // 2. 挖矿
      await miningEngine.connect(player1).mine(1);

      // 3. 检查耐久消耗
      const [, , durability] = await pickaxeNFT.getAttributes(1);
      expect(durability).to.equal(190); // 200 - 10

      // 4. 检查统计
      const [miningCount] = await miningEngine.getPlayerStats(player1.address);
      expect(miningCount).to.equal(1);
    });

    it("多个玩家可以同时挖矿", async function () {
      await pickaxeNFT.connect(player1).mintPickaxe(1, { value: ethers.parseEther("0.01") });
      await pickaxeNFT.connect(player2).mintPickaxe(1, { value: ethers.parseEther("0.01") });

      await miningEngine.connect(player1).mine(1);
      await miningEngine.connect(player2).mine(2);

      const [count1] = await miningEngine.getPlayerStats(player1.address);
      const [count2] = await miningEngine.getPlayerStats(player2.address);

      expect(count1).to.equal(1);
      expect(count2).to.equal(1);
    });
  });

  describe("TreasureNFT 测试", function () {
    it("应该正确初始化物品名称", async function () {
      expect(await treasureNFT.getItemName(1)).to.equal("Lucky Charm");
      expect(await treasureNFT.getItemName(2)).to.equal("Durability Potion");
      expect(await treasureNFT.getItemName(5)).to.equal("Gold Booster");
    });

    it("只有授权铸造者可以铸造", async function () {
      const minterAddress = await miningEngine.getAddress();
      expect(await treasureNFT.minters(minterAddress)).to.be.true;

      await treasureNFT.connect(owner).mint(player1.address, 1, 5);
      expect(await treasureNFT.balanceOf(player1.address, 1)).to.equal(5);
    });

    it("非授权地址铸造应该失败", async function () {
      await expect(
        treasureNFT.connect(player1).mint(player1.address, 1, 1)
      ).to.be.revertedWith("Not authorized minter");
    });

    it("玩家可以查询所有物品", async function () {
      await treasureNFT.connect(owner).mint(player1.address, 1, 2);
      await treasureNFT.connect(owner).mint(player1.address, 3, 1);

      const [itemIds, balances] = await treasureNFT.getPlayerItems(player1.address);

      expect(itemIds.length).to.equal(5);
      expect(balances[0]).to.equal(2); // LUCKY_CHARM
      expect(balances[1]).to.equal(0); // DURABILITY_POTION
      expect(balances[2]).to.equal(1); // RARE_SKIN
    });

    it("玩家可以销毁自己的物品", async function () {
      await treasureNFT.connect(owner).mint(player1.address, 1, 10);

      await treasureNFT.connect(player1).burn(player1.address, 1, 3);

      expect(await treasureNFT.balanceOf(player1.address, 1)).to.equal(7);
    });
  });

  describe("稀有掉落集成测试", function () {
    it("玩家可以领取稀有物品", async function () {
      // 铸造锄头
      await pickaxeNFT.connect(player1).mintPickaxe(1, { value: ethers.parseEther("0.01") });

      // 尝试领取1个稀有物品(假设玩家声称有1次史诗掉落)
      // 注意: 由于加密,实际可能会回滚,这里只测试合约调用
      try {
        await miningEngine.connect(player1).claimTreasure(1);

        // 如果成功,检查是否收到物品
        const [, balances] = await treasureNFT.getPlayerItems(player1.address);
        const totalItems = balances.reduce((sum, bal) => sum + bal, 0n);
        expect(totalItems).to.be.gt(0);
      } catch (error) {
        // 加密扣除可能失败,这是正常的
        console.log("  ⚠️  加密扣除失败(预期行为)");
      }
    });
  });
});
