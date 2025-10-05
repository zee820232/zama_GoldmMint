// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TreasureNFT
 * @dev ERC1155 稀有物品 NFT
 *
 * 物品类型:
 * - ID 1: 幸运符 (+10% luck加成)
 * - ID 2: 耐久药剂 (恢复50耐久)
 * - ID 3: 稀有锄头皮肤 (纯装饰)
 * - ID 4: 史诗宝箱 (随机奖励)
 * - ID 5: 黄金加速器 (挖矿奖励x2,持续10次)
 */
contract TreasureNFT is ERC1155, Ownable, ReentrancyGuard {
    // ========== 物品类型常量 ==========
    uint256 public constant LUCKY_CHARM = 1;        // 幸运符
    uint256 public constant DURABILITY_POTION = 2;  // 耐久药剂
    uint256 public constant RARE_SKIN = 3;          // 稀有皮肤
    uint256 public constant EPIC_CHEST = 4;         // 史诗宝箱
    uint256 public constant GOLD_BOOSTER = 5;       // 黄金加速器

    // ========== 状态变量 ==========

    // 授权铸造者(通常是 MiningEngine)
    mapping(address => bool) public minters;

    // 物品元数据 URI
    mapping(uint256 => string) private _tokenURIs;

    // 物品总供应量
    mapping(uint256 => uint256) public totalSupply;

    // 物品名称
    mapping(uint256 => string) public itemNames;

    // ========== 事件 ==========

    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event TreasureMinted(address indexed to, uint256 indexed itemId, uint256 amount);
    event TreasureBurned(address indexed from, uint256 indexed itemId, uint256 amount);

    // ========== 修饰符 ==========

    modifier onlyMinter() {
        require(minters[msg.sender], "Not authorized minter");
        _;
    }

    // ========== 构造函数 ==========

    constructor() ERC1155("") Ownable(msg.sender) {
        _initializeItems();
    }

    // ========== 初始化物品 ==========

    function _initializeItems() private {
        itemNames[LUCKY_CHARM] = "Lucky Charm";
        itemNames[DURABILITY_POTION] = "Durability Potion";
        itemNames[RARE_SKIN] = "Rare Pickaxe Skin";
        itemNames[EPIC_CHEST] = "Epic Treasure Chest";
        itemNames[GOLD_BOOSTER] = "Gold Booster";
    }

    // ========== 铸造功能 ==========

    /**
     * @dev 铸造稀有物品(仅授权铸造者)
     * @param to 接收地址
     * @param itemId 物品ID
     * @param amount 数量
     */
    function mint(address to, uint256 itemId, uint256 amount) external onlyMinter {
        require(itemId >= 1 && itemId <= 5, "Invalid item ID");
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be > 0");

        _mint(to, itemId, amount, "");
        totalSupply[itemId] += amount;

        emit TreasureMinted(to, itemId, amount);
    }

    /**
     * @dev 批量铸造
     */
    function mintBatch(
        address to,
        uint256[] memory itemIds,
        uint256[] memory amounts
    ) external onlyMinter {
        require(to != address(0), "Invalid address");
        require(itemIds.length == amounts.length, "Length mismatch");

        _mintBatch(to, itemIds, amounts, "");

        for (uint256 i = 0; i < itemIds.length; i++) {
            totalSupply[itemIds[i]] += amounts[i];
            emit TreasureMinted(to, itemIds[i], amounts[i]);
        }
    }

    // ========== 销毁功能 ==========

    /**
     * @dev 销毁物品(使用物品)
     */
    function burn(address from, uint256 itemId, uint256 amount) external {
        require(
            from == msg.sender || isApprovedForAll(from, msg.sender),
            "Not approved"
        );

        _burn(from, itemId, amount);
        totalSupply[itemId] -= amount;

        emit TreasureBurned(from, itemId, amount);
    }

    // ========== 查询功能 ==========

    /**
     * @dev 查询物品名称
     */
    function getItemName(uint256 itemId) external view returns (string memory) {
        require(itemId >= 1 && itemId <= 5, "Invalid item ID");
        return itemNames[itemId];
    }

    /**
     * @dev 查询玩家所有物品
     */
    function getPlayerItems(address player) external view returns (
        uint256[] memory itemIds,
        uint256[] memory balances
    ) {
        itemIds = new uint256[](5);
        balances = new uint256[](5);

        for (uint256 i = 1; i <= 5; i++) {
            itemIds[i - 1] = i;
            balances[i - 1] = balanceOf(player, i);
        }

        return (itemIds, balances);
    }

    /**
     * @dev 覆盖 uri 函数
     */
    function uri(uint256 itemId) public view override returns (string memory) {
        require(itemId >= 1 && itemId <= 5, "Invalid item ID");

        string memory tokenURI = _tokenURIs[itemId];
        if (bytes(tokenURI).length > 0) {
            return tokenURI;
        }

        // 如果没有设置自定义 URI,返回默认值
        return super.uri(itemId);
    }

    // ========== 管理员功能 ==========

    /**
     * @dev 添加铸造者
     */
    function addMinter(address minter) external onlyOwner {
        require(minter != address(0), "Invalid address");
        minters[minter] = true;
        emit MinterAdded(minter);
    }

    /**
     * @dev 移除铸造者
     */
    function removeMinter(address minter) external onlyOwner {
        minters[minter] = false;
        emit MinterRemoved(minter);
    }

    /**
     * @dev 设置物品 URI
     */
    function setTokenURI(uint256 itemId, string memory newURI) external onlyOwner {
        require(itemId >= 1 && itemId <= 5, "Invalid item ID");
        _tokenURIs[itemId] = newURI;
    }

    /**
     * @dev 设置基础 URI
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _setURI(newBaseURI);
    }

    /**
     * @dev 更新物品名称
     */
    function setItemName(uint256 itemId, string memory newName) external onlyOwner {
        require(itemId >= 1 && itemId <= 5, "Invalid item ID");
        itemNames[itemId] = newName;
    }
}
