// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface IAidDistribution {
    function register(address wallet, uint256 householdId) external;
    function verifyBeneficiary(address wallet, bool status) external;
    function releaseAid(address wallet, uint256 amount) external;
    function transferOwnership(address newOwner) external;
}

/// @title RegenDAO (Wave-2 minimal owner DAO)
/// @dev In Wave 4 we can upgrade to OZ Governor.
contract RegenDAO is Ownable {
    IAidDistribution public aid;

    constructor() Ownable(msg.sender) {}

    function setAidDistribution(address aidAddr) external onlyOwner {
        aid = IAidDistribution(aidAddr);
    }

    // Convenience wrappers so all actions are auditable via DAO
    function daoRegister(address wallet, uint256 householdId) external onlyOwner {
        aid.register(wallet, householdId);
    }

    function daoVerify(address wallet, bool status) external onlyOwner {
        aid.verifyBeneficiary(wallet, status);
    }

    function daoRelease(address wallet, uint256 amount) external onlyOwner {
        aid.releaseAid(wallet, amount);
    }
}