// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/*//////////////////////////////////////////////////////////////
                            INTERFACES
//////////////////////////////////////////////////////////////*/

interface IAidDistribution {
    function verifyBeneficiary(address wallet, bool status) external;
    function releaseAid(address wallet, uint256 amount) external;
    function transferOwnership(address newOwner) external;
}

interface IRegenRegistry {
    function registerMember(address wallet, uint256 householdId) external;
    function updateDAO(address newDAO) external;
}

/*//////////////////////////////////////////////////////////////
                            DAO
//////////////////////////////////////////////////////////////*/

contract RegenDAO is Ownable {
    IAidDistribution public aid;
    IRegenRegistry public registry;

    constructor() Ownable(msg.sender) {}

    /*//////////////////////////////////////////////////////////////
                        SETUP FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function setAidDistribution(address aidAddr) external onlyOwner {
        require(aidAddr != address(0), "Invalid aid address");
        aid = IAidDistribution(aidAddr);
    }

    function setRegistry(address registryAddr) external onlyOwner {
        require(registryAddr != address(0), "Invalid registry address");
        registry = IRegenRegistry(registryAddr);
    }

    /*//////////////////////////////////////////////////////////////
                    GOVERNANCE MIGRATION (CRITICAL)
    //////////////////////////////////////////////////////////////*/

    /// @notice Updates the DAO address inside RegenRegistry
    /// @dev MUST be called from the OLD DAO during migration
    function daoUpdateRegistryDAO(address newDAO) external onlyOwner {
        require(address(registry) != address(0), "Registry not set");
        registry.updateDAO(newDAO);
    }

    /// @notice Transfers ownership of AidDistribution to a new DAO
    function daoTransferAidOwnership(address newDAO) external onlyOwner {
        require(address(aid) != address(0), "Aid not set");
        aid.transferOwnership(newDAO);
    }

    /*//////////////////////////////////////////////////////////////
                        DAO ACTIONS
    //////////////////////////////////////////////////////////////*/

    function daoRegister(address wallet, uint256 householdId) external onlyOwner {
        require(address(registry) != address(0), "Registry not set");
        registry.registerMember(wallet, householdId);
    }

    function daoVerify(address wallet, bool status) external onlyOwner {
        require(address(aid) != address(0), "Aid not set");
        aid.verifyBeneficiary(wallet, status);
    }

    function daoRelease(address wallet, uint256 amount) external onlyOwner {
        require(address(aid) != address(0), "Aid not set");
        aid.releaseAid(wallet, amount);
    }
}
