// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title Regen Token ($REGEN)
contract RegenToken is ERC20, Ownable {
    constructor(uint256 initialSupply)
        ERC20("Regen Token", "REGEN")
        Ownable(msg.sender)   // OZ v5 owner init
    {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    /// @notice Owner (multisig/DAO later) can mint for treasury or aid pools
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}