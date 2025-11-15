// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title AliefVerification (stub for Wave 2)
/// @notice In Wave 4 we’ll plug real ML/Oracle checks.
contract AliefVerification {
    mapping(address => bool) public flagged;   // simple demo flag

    function setFlag(address user, bool isFlagged) external {
        flagged[user] = isFlagged;
    }

    function isEligible(address user, uint256 /*householdId*/) external view returns (bool) {
        return !flagged[user];
    }
}