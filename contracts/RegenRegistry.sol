// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title RegenRegistry
/// @notice Canonical on-chain registry for RegenDAG DAO members
/// @dev Acts as the single source of truth for membership state
contract RegenRegistry {
    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    error NotDAO();
    error AlreadyRegistered();
    error InvalidAddress();
    error InvalidHouseholdCount();

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    event MemberRegistered(
        address indexed member,
        uint256 householdCount,
        uint256 timestamp
    );

    event DAOUpdated(address indexed oldDAO, address indexed newDAO);

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/

    address public dao;

    struct Member {
        bool exists;
        uint256 householdCount;
        uint256 registeredAt;
    }

    mapping(address => Member) private members;

    /*//////////////////////////////////////////////////////////////
                                MODIFIERS
    //////////////////////////////////////////////////////////////*/

    modifier onlyDAO() {
        if (msg.sender != dao) revert NotDAO();
        _;
    }

    /*//////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(address _dao) {
        if (_dao == address(0)) revert InvalidAddress();
        dao = _dao;
    }

    /*//////////////////////////////////////////////////////////////
                        DAO MANAGEMENT (OPTIONAL)
    //////////////////////////////////////////////////////////////*/

    function updateDAO(address newDAO) external onlyDAO {
        if (newDAO == address(0)) revert InvalidAddress();
        address old = dao;
        dao = newDAO;
        emit DAOUpdated(old, newDAO);
    }

    /*//////////////////////////////////////////////////////////////
                        REGISTRATION LOGIC
    //////////////////////////////////////////////////////////////*/

    function registerMember(
        address member,
        uint256 householdCount
    ) external onlyDAO {
        if (member == address(0)) revert InvalidAddress();
        if (householdCount == 0) revert InvalidHouseholdCount();
        if (members[member].exists) revert AlreadyRegistered();

        members[member] = Member({
            exists: true,
            householdCount: householdCount,
            registeredAt: block.timestamp
        });

        emit MemberRegistered(member, householdCount, block.timestamp);
    }

    /*//////////////////////////////////////////////////////////////
                        READ FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function isRegistered(address member) external view returns (bool) {
        return members[member].exists;
    }

    function getHouseholdCount(address member) external view returns (uint256) {
        return members[member].householdCount;
    }

    function getRegistrationTime(address member) external view returns (uint256) {
        return members[member].registeredAt;
    }
}
