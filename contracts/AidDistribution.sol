// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IAlief {
    function isEligible(address user, uint256 householdId) external view returns (bool);
}

/// @title AidDistribution — DAO-controlled token payouts
contract AidDistribution is Ownable, ReentrancyGuard {
    IERC20 public immutable regen;
    IAlief public alief;

    struct Beneficiary {
        bool registered;
        bool verified;
        bool hasClaimed;
        uint256 householdId;
    }

    mapping(address => Beneficiary) public ben;
    mapping(uint256 => bool) public householdClaimed;

    event Registered(address indexed wallet, uint256 householdId);
    event Verified(address indexed wallet, bool status);
    event AidReleased(address indexed wallet, uint256 amount);

    constructor(address token, address aliefAddr) Ownable(msg.sender) {
        regen = IERC20(token);
        alief = IAlief(aliefAddr);
    }

    function setAlief(address a) external onlyOwner { alief = IAlief(a); }

    // Admin (DAO/owner) registers users
    function register(address wallet, uint256 householdId) external onlyOwner {
        require(wallet != address(0), "zero addr");
        require(!ben[wallet].registered, "already");
        ben[wallet] = Beneficiary(true, false, false, householdId);
        emit Registered(wallet, householdId);
    }

    function verifyBeneficiary(address wallet, bool status) external onlyOwner {
        require(ben[wallet].registered, "not reg");
        ben[wallet].verified = status;
        emit Verified(wallet, status);
    }

    /// @notice DAO triggers payout after checks
    function releaseAid(address wallet, uint256 amount) external onlyOwner nonReentrant {
        Beneficiary storage b = ben[wallet];
        require(b.registered && b.verified, "not verified");
        require(!b.hasClaimed, "already claimed");
        require(!householdClaimed[b.householdId], "household paid");
        require(alief.isEligible(wallet, b.householdId), "alief block");

        b.hasClaimed = true;
        householdClaimed[b.householdId] = true;

        require(regen.transfer(wallet, amount), "token transfer fail");
        emit AidReleased(wallet, amount);
    }
}