// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
/**
 * @title PickaxeNFT
 * @dev NFT 锄头合约,支持铸造、修理、属性管理 (FHE 前端加密版本)
 *
 * 核心功能:
 * - 五个等级的锄头(1-5级)
 * - 属性包括:等级、耐久、效率、幸运值(前端 FHE 加密)
 * - 支持修理和耐久消耗
 */
contract PickaxeNFT is ERC721, ERC721Enumerable, Ownable, ReentrancyGuard {

    // ========== 结构体定义 ==========

    struct PickaxeAttributes {
        uint8 level;            // 等级 (1-5)
        uint16 durabilityMax;   // 最大耐久
        uint16 durability;      // 当前耐久
        uint8 efficiency;       // 效率基数
        bytes encryptedLuck;    // 幸运值(FHE 加密的 bytes) - 影响稀有掉落
    }

    // ========== 状态变量 ==========

    // Token ID 计数器
    uint256 private _tokenIdCounter;

    // NFT 属性映射
    mapping(uint256 => PickaxeAttributes) private _attributes;

    // 等级配置
    struct LevelConfig {
        uint256 mintPrice;      // 铸造价格
        uint16 durabilityMax;   // 最大耐久
        uint8 efficiency;       // 效率基数
        uint8 luckMin;          // 幸运值最小值
        uint8 luckMax;          // 幸运值最大值
    }

    mapping(uint8 => LevelConfig) public levelConfigs;

    // 挖矿合约地址(有权消耗耐久)
    address public miningEngine;

    // ========== 事件 ==========

    event PickaxeMinted(
        address indexed owner,
        uint256 indexed tokenId,
        uint8 level,
        uint16 durability,
        uint8 efficiency
    );

    event PickaxeRepaired(
        uint256 indexed tokenId,
        uint16 durabilityRestored,
        uint16 newDurability
    );

    event DurabilityConsumed(
        uint256 indexed tokenId,
        uint16 amount,
        uint16 remaining
    );

    // ========== 构造函数 ==========

    constructor() ERC721("Zama Mining Pickaxe", "PICKAXE") Ownable(msg.sender) {
        _initializeLevelConfigs();
    }

    // ========== 初始化配置 ==========

    function _initializeLevelConfigs() private {
        // 等级 1: 入门锄头
        levelConfigs[1] = LevelConfig({
            mintPrice: 0.01 ether,
            durabilityMax: 100,
            efficiency: 10,
            luckMin: 1,
            luckMax: 10
        });

        // 等级 2: 普通锄头
        levelConfigs[2] = LevelConfig({
            mintPrice: 0.03 ether,
            durabilityMax: 200,
            efficiency: 20,
            luckMin: 5,
            luckMax: 20
        });

        // 等级 3: 高级锄头
        levelConfigs[3] = LevelConfig({
            mintPrice: 0.08 ether,
            durabilityMax: 300,
            efficiency: 30,
            luckMin: 10,
            luckMax: 35
        });

        // 等级 4: 稀有锄头
        levelConfigs[4] = LevelConfig({
            mintPrice: 0.20 ether,
            durabilityMax: 400,
            efficiency: 40,
            luckMin: 20,
            luckMax: 55
        });

        // 等级 5: 史诗锄头
        levelConfigs[5] = LevelConfig({
            mintPrice: 0.50 ether,
            durabilityMax: 500,
            efficiency: 50,
            luckMin: 35,
            luckMax: 80
        });
    }

    // ========== 核心功能 ==========

    /**
     * @dev 铸造锄头(接受前端 FHE 加密的幸运值)
     * @param level 锄头等级 (1-5)
     * @param encryptedLuck 前端使用 fhevmjs 加密的幸运值
     */
    function mintPickaxe(uint8 level, bytes calldata encryptedLuck) external payable nonReentrant returns (uint256) {
        require(level >= 1 && level <= 5, "Invalid level");
        LevelConfig memory config = levelConfigs[level];
        require(msg.value >= config.mintPrice, "Insufficient payment");
        require(encryptedLuck.length > 0, "Invalid encrypted luck");

        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        // 创建属性 - 直接存储前端加密的幸运值
        _attributes[newTokenId] = PickaxeAttributes({
            level: level,
            durabilityMax: config.durabilityMax,
            durability: config.durabilityMax,
            efficiency: config.efficiency,
            encryptedLuck: encryptedLuck
        });

        // 铸造 NFT
        _safeMint(msg.sender, newTokenId);

        emit PickaxeMinted(
            msg.sender,
            newTokenId,
            level,
            config.durabilityMax,
            config.efficiency
        );

        // 退还多余支付
        if (msg.value > config.mintPrice) {
            payable(msg.sender).transfer(msg.value - config.mintPrice);
        }

        return newTokenId;
    }

    /**
     * @dev 修理锄头(仅在集成 GoldToken 后实现)
     * @param tokenId 锄头 ID
     * @param amount 恢复耐久数量
     */
    function repairPickaxe(uint256 tokenId, uint16 amount) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        PickaxeAttributes storage attrs = _attributes[tokenId];

        require(attrs.durability < attrs.durabilityMax, "Already full durability");

        uint16 actualRepair = amount;
        if (attrs.durability + amount > attrs.durabilityMax) {
            actualRepair = attrs.durabilityMax - attrs.durability;
        }

        attrs.durability += actualRepair;

        emit PickaxeRepaired(tokenId, actualRepair, attrs.durability);
    }

    /**
     * @dev 消耗耐久(仅挖矿合约可调用)
     * @param tokenId 锄头 ID
     * @param amount 消耗数量
     */
    function consumeDurability(uint256 tokenId, uint16 amount) external {
        require(msg.sender == miningEngine, "Only mining engine");
        PickaxeAttributes storage attrs = _attributes[tokenId];

        require(attrs.durability >= amount, "Insufficient durability");

        attrs.durability -= amount;

        emit DurabilityConsumed(tokenId, amount, attrs.durability);
    }

    // ========== 查询功能 ==========

    /**
     * @dev 获取锄头公开属性
     */
    function getAttributes(uint256 tokenId) external view returns (
        uint8 level,
        uint16 durabilityMax,
        uint16 durability,
        uint8 efficiency
    ) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        PickaxeAttributes memory attrs = _attributes[tokenId];

        return (
            attrs.level,
            attrs.durabilityMax,
            attrs.durability,
            attrs.efficiency
        );
    }

    /**
     * @dev 获取加密幸运值
     */
    function getLuck(uint256 tokenId) external view returns (bytes memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _attributes[tokenId].encryptedLuck;
    }

    /**
     * @dev 查询玩家拥有的所有锄头
     */
    function getPlayerPickaxes(address player) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(player);
        uint256[] memory tokenIds = new uint256[](balance);

        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(player, i);
        }

        return tokenIds;
    }

    // ========== 管理员功能 ==========

    /**
     * @dev 设置挖矿合约地址
     */
    function setMiningEngine(address _miningEngine) external onlyOwner {
        require(_miningEngine != address(0), "Invalid address");
        miningEngine = _miningEngine;
    }

    /**
     * @dev 更新等级配置
     */
    function updateLevelConfig(
        uint8 level,
        uint256 mintPrice,
        uint16 durabilityMax,
        uint8 efficiency,
        uint8 luckMin,
        uint8 luckMax
    ) external onlyOwner {
        require(level >= 1 && level <= 5, "Invalid level");
        require(luckMax > luckMin, "Invalid luck range");

        levelConfigs[level] = LevelConfig({
            mintPrice: mintPrice,
            durabilityMax: durabilityMax,
            efficiency: efficiency,
            luckMin: luckMin,
            luckMax: luckMax
        });
    }

    /**
     * @dev 提取合约余额
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");
        payable(owner()).transfer(balance);
    }

    // ========== ERC721 覆盖 ==========

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
