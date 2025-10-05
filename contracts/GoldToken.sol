// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GoldToken
 * @dev 游戏内黄金代币,由挖矿产出
 *
 * 核心功能:
 * - 挖矿合约可铸造新代币
 * - 修理消耗代币并部分销毁(通缩机制)
 * - 可自由交易
 */
contract GoldToken is ERC20, ERC20Burnable, Ownable {
    // ========== 状态变量 ==========

    // 总供应上限
    uint256 public constant MAX_SUPPLY = 10_000_000 * 10**18; // 1000万枚

    // 授权铸造者
    mapping(address => bool) public minters;

    // 通缩金库(修理消耗的30%进入这里)
    address public treasury;

    // 修理销毁率(30% = 3000 / 10000)
    uint256 public constant BURN_RATE = 3000;
    uint256 public constant BURN_DENOMINATOR = 10000;

    // ========== 事件 ==========

    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event MintedFromMining(address indexed player, uint256 amount);
    event BurnedForRepair(address indexed player, uint256 amount, uint256 burned, uint256 toTreasury);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);

    // ========== 修饰符 ==========

    modifier onlyMinter() {
        require(minters[msg.sender], "Not authorized minter");
        _;
    }

    // ========== 构造函数 ==========

    constructor() ERC20("Zama Gold", "GOLD") Ownable(msg.sender) {
        treasury = msg.sender; // 初始金库为部署者
    }

    // ========== 铸造功能 ==========

    /**
     * @dev 从挖矿铸造代币
     * @param player 玩家地址
     * @param amount 铸造数量
     */
    function mintFromMining(address player, uint256 amount) external onlyMinter {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");

        _mint(player, amount);

        emit MintedFromMining(player, amount);
    }

    // ========== 修理消耗 ==========

    /**
     * @dev 修理消耗代币
     * @param player 玩家地址
     * @param amount 消耗数量
     *
     * 经济模型:
     * - 30% 销毁(通缩)
     * - 70% 进入金库
     */
    function burnForRepair(address player, uint256 amount) external onlyMinter {
        require(balanceOf(player) >= amount, "Insufficient balance");

        // 计算销毁和金库数量
        uint256 burnAmount = (amount * BURN_RATE) / BURN_DENOMINATOR;
        uint256 treasuryAmount = amount - burnAmount;

        // 从玩家转移到本合约
        _transfer(player, address(this), amount);

        // 销毁部分
        _burn(address(this), burnAmount);

        // 金库部分
        _transfer(address(this), treasury, treasuryAmount);

        emit BurnedForRepair(player, amount, burnAmount, treasuryAmount);
    }

    // ========== 管理员功能 ==========

    /**
     * @dev 添加铸造者(通常是挖矿合约)
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
     * @dev 更新金库地址
     */
    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid address");
        address oldTreasury = treasury;
        treasury = newTreasury;
        emit TreasuryUpdated(oldTreasury, newTreasury);
    }

    /**
     * @dev 初始空投(用于测试或初始分发)
     */
    function airdrop(address[] calldata recipients, uint256 amount) external onlyOwner {
        require(totalSupply() + (recipients.length * amount) <= MAX_SUPPLY, "Exceeds max supply");

        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amount);
        }
    }
}
