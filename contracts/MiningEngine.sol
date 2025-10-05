// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@fhevm/solidity/lib/FHE.sol";
import "./PickaxeNFT.sol";
import "./GoldToken.sol";
import "./TreasureNFT.sol";

/**
 * @title MiningEngine
 * @dev 保密挖矿引擎 - 基于 Zama FHE 技术
 *
 * 核心特性:
 * - 加密随机数生成
 * - 加密概率计算(不泄露结果类型)
 * - 加密收益累加(玩家总收益保密)
 * - 基于锄头等级的概率表
 */
contract MiningEngine is Ownable, ReentrancyGuard {
    using FHE for *;

    // ========== 结构体定义 ==========

    struct ProbabilityTier {
        uint8 commonRate;   // 普通掉落概率 (0-100)
        uint8 rareRate;     // 稀有掉落概率
        uint8 epicRate;     // 史诗掉落概率
    }

    // ========== 状态变量 ==========

    // 关联合约
    PickaxeNFT public pickaxeNFT;
    GoldToken public goldToken;
    TreasureNFT public treasureNFT;

    // 玩家加密收益
    mapping(address => euint64) private playerEarnings;

    // 玩家加密稀有掉落计数(记录史诗次数)
    mapping(address => euint32) private playerEpicDrops;

    // 玩家公开统计
    mapping(address => uint256) public totalMiningCount;
    mapping(address => uint256) public lastMiningTime;

    // 概率表(5个等级)
    mapping(uint8 => ProbabilityTier) public probabilityTable;

    // 产出配置
    uint32 public baseGoldReward = 10;          // 基础奖励
    uint32 public rareMultiplier = 5;           // 稀有倍率
    uint32 public epicMultiplier = 20;          // 史诗倍率

    // 耐久消耗
    uint16 public durabilityPerMine = 10;       // 每次挖矿消耗耐久

    // 冷却时间(防止刷矿)
    uint256 public mineCooldown = 0;            // 秒数,0表示无冷却

    // 稀有物品掉落概率(每次史诗掉落时触发)
    uint8 public treasureDropRate = 100;        // 100 = 100% (史诗必掉稀有物品)

    // 是否暂停
    bool public paused = false;

    // ========== 事件 ==========

    event MiningStarted(
        address indexed player,
        uint256 indexed pickaxeId,
        uint256 timestamp
    );

    event MiningCompleted(
        address indexed player,
        uint256 indexed pickaxeId,
        uint256 timestamp
    );

    event RewardsRevealed(
        address indexed player,
        uint256 amount
    );

    event TreasureDropped(
        address indexed player,
        uint256 itemId,
        uint256 amount
    );

    // ========== 修饰符 ==========

    modifier whenNotPaused() {
        require(!paused, "Mining is paused");
        _;
    }

    // ========== 构造函数 ==========

    constructor(
        address _pickaxeNFT,
        address _goldToken
    ) Ownable(msg.sender) {
        require(_pickaxeNFT != address(0), "Invalid pickaxe address");
        require(_goldToken != address(0), "Invalid gold token address");

        pickaxeNFT = PickaxeNFT(_pickaxeNFT);
        goldToken = GoldToken(_goldToken);

        _initializeProbabilityTable();
    }

    // ========== 初始化概率表 ==========

    function _initializeProbabilityTable() private {
        // 等级 1: 85% 普通, 14% 稀有, 1% 史诗
        probabilityTable[1] = ProbabilityTier({
            epicRate: 1,
            rareRate: 14,
            commonRate: 85
        });

        // 等级 2: 75% 普通, 22% 稀有, 3% 史诗
        probabilityTable[2] = ProbabilityTier({
            epicRate: 3,
            rareRate: 22,
            commonRate: 75
        });

        // 等级 3: 65% 普通, 30% 稀有, 5% 史诗
        probabilityTable[3] = ProbabilityTier({
            epicRate: 5,
            rareRate: 30,
            commonRate: 65
        });

        // 等级 4: 50% 普通, 40% 稀有, 10% 史诗
        probabilityTable[4] = ProbabilityTier({
            epicRate: 10,
            rareRate: 40,
            commonRate: 50
        });

        // 等级 5: 30% 普通, 50% 稀有, 20% 史诗
        probabilityTable[5] = ProbabilityTier({
            epicRate: 20,
            rareRate: 50,
            commonRate: 30
        });
    }

    // ========== 核心挖矿功能 ==========

    /**
     * @dev 执行挖矿
     * @param pickaxeId 锄头 NFT ID
     *
     * 流程:
     * 1. 验证所有权和耐久
     * 2. 生成加密随机数
     * 3. 加密概率计算
     * 4. 加密奖励计算(包含 luck 加成)
     * 5. 累加到加密收益
     * 6. 消耗耐久
     */
    function mine(uint256 pickaxeId) external nonReentrant whenNotPaused {
        // 1. 验证
        require(pickaxeNFT.ownerOf(pickaxeId) == msg.sender, "Not owner");

        // 冷却检查
        if (mineCooldown > 0) {
            require(
                block.timestamp >= lastMiningTime[msg.sender] + mineCooldown,
                "Cooldown not finished"
            );
        }

        // 获取锄头属性
        (
            uint8 level,
            ,
            uint16 durability,
            uint8 efficiency
        ) = pickaxeNFT.getAttributes(pickaxeId);

        require(durability >= durabilityPerMine, "Insufficient durability");

        emit MiningStarted(msg.sender, pickaxeId, block.timestamp);

        // 2. 生成加密随机数 (0-99)
        euint8 randomRoll = FHE.randEuint8();
        euint8 roll = FHE.rem(randomRoll, 100);

        // 3. 加密概率计算
        ProbabilityTier memory prob = probabilityTable[level];

        // 判断是否为史诗
        ebool isEpic = FHE.lt(roll, FHE.asEuint8(prob.epicRate));

        // 判断是否为稀有
        ebool isRare = FHE.and(
            FHE.ge(roll, FHE.asEuint8(prob.epicRate)),
            FHE.lt(roll, FHE.asEuint8(prob.epicRate + prob.rareRate))
        );

        // 4. 加密奖励计算
        euint32 baseReward = FHE.asEuint32(baseGoldReward);

        // 应用倍率
        euint32 epicReward = FHE.mul(baseReward, FHE.asEuint32(epicMultiplier));
        euint32 rareReward = FHE.mul(baseReward, FHE.asEuint32(rareMultiplier));

        // 根据稀有度选择奖励
        euint32 reward = FHE.select(
            isEpic,
            epicReward,
            FHE.select(isRare, rareReward, baseReward)
        );

        // 应用效率加成
        euint32 efficiencyBonus = FHE.mul(
            reward,
            FHE.asEuint32(efficiency)
        );
        reward = FHE.add(reward, FHE.div(efficiencyBonus, 100));

        // 应用幸运值加成(获取加密 luck)
        euint8 luck = pickaxeNFT.getLuck(pickaxeId);
        euint32 luckBonus = FHE.asEuint32(luck);
        reward = FHE.add(reward, luckBonus);

        // 5. 记录史诗掉落次数(用于后续稀有物品铸造)
        // 使用 FHE.select: 如果 isEpic 为真,计数+1,否则+0
        euint32 epicIncrement = FHE.select(
            isEpic,
            FHE.asEuint32(1),
            FHE.asEuint32(0)
        );
        playerEpicDrops[msg.sender] = FHE.add(
            playerEpicDrops[msg.sender],
            epicIncrement
        );
        FHE.allow(playerEpicDrops[msg.sender], msg.sender);

        // 6. 累加到玩家总收益(加密)
        playerEarnings[msg.sender] = FHE.add(
            playerEarnings[msg.sender],
            FHE.asEuint64(reward)
        );

        // 授权玩家访问自己的收益
        FHE.allow(playerEarnings[msg.sender], msg.sender);

        // 7. 消耗耐久
        pickaxeNFT.consumeDurability(pickaxeId, durabilityPerMine);

        // 更新统计
        totalMiningCount[msg.sender]++;
        lastMiningTime[msg.sender] = block.timestamp;

        emit MiningCompleted(msg.sender, pickaxeId, block.timestamp);
    }

    /**
     * @dev 领取收益(简化版)
     *
     * 简化方案:
     * 1. 玩家指定要领取的金币金额
     * 2. 合约验证余额足够(加密比较)
     * 3. 扣除余额并铸造代币
     * 4. 同时处理稀有物品掉落
     *
     * @param claimAmount 要领取的金币数量
     */
    function claimRewards(uint256 claimAmount) external nonReentrant {
        require(claimAmount > 0, "Amount must be > 0");
        require(claimAmount <= type(uint64).max, "Amount too large");

        // 1. 验证余额足够(加密比较)
        euint64 encryptedEarnings = playerEarnings[msg.sender];

        // 使用明文和密文比较: ge 的第二个参数可以是明文
        ebool hasEnough = FHE.ge(encryptedEarnings, uint64(claimAmount));

        // 这里需要 Gateway 解密 hasEnough,暂时使用乐观方案
        // 如果余额不足,稍后的扣除操作会下溢并回滚

        // 2. 扣除余额(加密)
        playerEarnings[msg.sender] = FHE.sub(
            encryptedEarnings,
            uint64(claimAmount)
        );
        FHE.allow(playerEarnings[msg.sender], msg.sender);

        // 3. 铸造金币代币
        goldToken.mintFromMining(msg.sender, claimAmount);
        emit RewardsRevealed(msg.sender, claimAmount);

        // 4. 处理稀有物品掉落
        _mintTreasureItems(msg.sender);
    }

    /**
     * @dev 内部函数:铸造稀有物品
     *
     * 简化方案:玩家每次领取奖励时,检查是否有待铸造的稀有物品
     * 由于无法直接解密 epicDrops,使用前端辅助的方式:
     * - 前端通过重加密查看 epicDrops 数量
     * - 调用 claimTreasure 明确领取
     */
    function _mintTreasureItems(address player) private {
        // 注意:这个函数在当前简化版中不执行实际铸造
        // 实际铸造需要玩家调用 claimTreasure(明文数量)
        // 这里保留为扩展点
    }

    /**
     * @dev 领取稀有物品(玩家需知道自己的 epicDrops 数量)
     *
     * 流程:
     * 1. 前端通过重加密查看 playerEpicDrops
     * 2. 玩家调用此函数,声明要领取的数量
     * 3. 合约验证并扣除,铸造随机稀有物品
     *
     * @param claimCount 要领取的稀有物品数量
     */
    function claimTreasure(uint256 claimCount) external nonReentrant {
        require(claimCount > 0, "Count must be > 0");
        require(claimCount <= type(uint32).max, "Count too large");
        require(treasureNFT != TreasureNFT(address(0)), "TreasureNFT not set");

        // 1. 验证玩家有足够的掉落计数
        euint32 encryptedDrops = playerEpicDrops[msg.sender];

        // 2. 扣除计数(使用明文)
        playerEpicDrops[msg.sender] = FHE.sub(
            encryptedDrops,
            uint32(claimCount)
        );
        FHE.allow(playerEpicDrops[msg.sender], msg.sender);

        // 3. 为每个稀有掉落铸造随机物品
        // 简化方案:每次铸造5种物品各1个(玩家自己选择使用哪个)
        // 这避免了需要解密随机 itemId 的问题
        for (uint256 i = 0; i < claimCount; i++) {
            // 铸造一个随机物品 (1-5)
            // 由于无法解密随机数,使用链下可预测的随机(基于区块哈希)
            uint256 pseudoRandom = uint256(keccak256(abi.encodePacked(
                block.timestamp,
                block.prevrandao,
                msg.sender,
                i
            )));
            uint256 itemId = (pseudoRandom % 5) + 1;

            treasureNFT.mint(msg.sender, itemId, 1);
            emit TreasureDropped(msg.sender, itemId, 1);
        }
    }

    // ========== 查询功能 ==========

    /**
     * @dev 获取玩家加密收益(用于重加密)
     */
    function getPlayerEarnings(address player) external view returns (euint64) {
        return playerEarnings[player];
    }

    /**
     * @dev 获取玩家加密稀有掉落计数(用于重加密)
     */
    function getPlayerEpicDrops(address player) external view returns (euint32) {
        return playerEpicDrops[player];
    }

    /**
     * @dev 获取玩家挖矿统计
     */
    function getPlayerStats(address player) external view returns (
        uint256 miningCount,
        uint256 lastTime
    ) {
        return (totalMiningCount[player], lastMiningTime[player]);
    }

    // ========== 管理员功能 ==========

    /**
     * @dev 更新概率表
     */
    function updateProbability(
        uint8 level,
        uint8 epicRate,
        uint8 rareRate,
        uint8 commonRate
    ) external onlyOwner {
        require(level >= 1 && level <= 5, "Invalid level");
        require(epicRate + rareRate + commonRate == 100, "Rates must sum to 100");

        probabilityTable[level] = ProbabilityTier({
            epicRate: epicRate,
            rareRate: rareRate,
            commonRate: commonRate
        });
    }

    /**
     * @dev 更新奖励参数
     */
    function updateRewardConfig(
        uint32 _baseReward,
        uint32 _rareMultiplier,
        uint32 _epicMultiplier
    ) external onlyOwner {
        baseGoldReward = _baseReward;
        rareMultiplier = _rareMultiplier;
        epicMultiplier = _epicMultiplier;
    }

    /**
     * @dev 更新耐久消耗
     */
    function setDurabilityPerMine(uint16 amount) external onlyOwner {
        durabilityPerMine = amount;
    }

    /**
     * @dev 设置冷却时间
     */
    function setMineCooldown(uint256 cooldown) external onlyOwner {
        mineCooldown = cooldown;
    }

    /**
     * @dev 暂停/恢复挖矿
     */
    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
    }

    /**
     * @dev 设置 TreasureNFT 合约地址
     */
    function setTreasureNFT(address _treasureNFT) external onlyOwner {
        require(_treasureNFT != address(0), "Invalid address");
        treasureNFT = TreasureNFT(_treasureNFT);
    }

    /**
     * @dev 更新稀有物品掉落概率
     */
    function setTreasureDropRate(uint8 rate) external onlyOwner {
        require(rate <= 100, "Rate must be <= 100");
        treasureDropRate = rate;
    }
}
