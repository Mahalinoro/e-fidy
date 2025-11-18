// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract CandidateRegistry {
    struct Candidate {
        uint256 uid;
        string name;
        string photoURL;
        string partyURL;
    }

    mapping(uint256 => Candidate) private candidates;
    mapping(uint256 => bool) private _isIndexed;
    address private owner;
    uint256[] private candidateList;

    /**
     *  @notice Sets the contract deployer as the owner of the Candidate Registry
     */
    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    event CandidateRegistered(uint256 indexed uid, string name);

    /**
     *  @notice Registers a candidate in the Candidate Registry
     *  @param uid The unique ID of the candidate
     *  @param name The name of the candidate
     *  @param photoURL The URL of the candidate's photo
     *  @param partyURL The URL of the candidate's party logo
     */
    function registerCandidate(
        uint256 uid,
        string memory name,
        string memory photoURL,
        string memory partyURL
    ) public onlyOwner {
        require(!_isIndexed[uid], "Candidate is already registered");

        candidates[uid] = Candidate(uid, name, photoURL, partyURL);
        _isIndexed[uid] = true;
        candidateList.push(uid);

        emit CandidateRegistered(uid, name);
    }    

    /**
     *  @notice Checks if a candidate is registered
     *  @param uid The unique ID of the candidate
     *  @return True if the candidate is registered, false otherwise
     */
    function isCandidateRegistered(uint256 uid) public view returns (bool) {
        return _isIndexed[uid];
    }

    /**
     *  @notice Retrieves candidate details by UID
     *  @param uid The unique ID of the candidate
     *  @return The Candidate struct containing candidate details
     */
    function getCandidate(uint256 uid) public view returns (Candidate memory) {
        require(_isIndexed[uid], "Candidate is not registered");
        return candidates[uid];
    }
    
    /**
     *  @notice Retrieves the list of all registered candidate UIDs
     *  @return An array of candidate UIDs
     */
    function getCandidateList() public view returns (uint256[] memory) {
        return candidateList;
    }
}
