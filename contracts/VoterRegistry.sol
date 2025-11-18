// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract VoterRegistry {
    mapping(address => bool) private _isEligible;
    mapping(address => bool) private _isIndexed;
    address private owner;
    address[] private voterList;

    /**
     *  @notice Constructor sets the contract deployer as the owner
     */
    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    event VoterRegistered(address indexed voter);

    /**
     *  @notice Registers a voter in the Voter Registry
     *  @param voter The address of the voter
     */
    function registerVoter(address voter) public onlyOwner {
        require(!_isIndexed[voter], "Voter is already registered");

        _isEligible[voter] = true;
        _isIndexed[voter] = true;
        voterList.push(voter);

        emit VoterRegistered(voter);
    }

    /**
     *  @notice Checks if a voter is eligible
     *  @param voter The address of the voter
     *  @return True if the voter is eligible, false otherwise
     */
    function isVoterEligible(address voter) public view returns (bool) {
        return _isEligible[voter];
    }

    /**
     *  @notice Returns the list of all registered voters
     *  @return An array of addresses of all registered voters
     */
    function getVoterList() public view returns (address[] memory) {
        return voterList;
    }
}
