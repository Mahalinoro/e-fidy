// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IVoterRegistry {
    function isVoterEligible(address voter) external view returns (bool);
}

interface ICandidateRegistry {
    function isCandidateRegistered(uint256 uid) external view returns (bool);
}

contract ElectionFactory {
    address public immutable owner;
    address public immutable voterRegistry;
    address public immutable candidateRegistry;
    address[] public allElections;

    event ElectionCreated(address indexed electionAddress, string electionName);

    /**
     *  @notice Constructor sets the contract deployer as the owner
     *  @param _voterRegistry The address of the Voter Registry contract
     *  @param _candidateRegistry The address of the Candidate Registry contract
     */
    constructor(address _voterRegistry, address _candidateRegistry) {
        owner = msg.sender;
        voterRegistry = _voterRegistry;
        candidateRegistry = _candidateRegistry;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    /**
     *  @notice Creates a new Election contract
     *  @param _owner The owner of the election
     *  @param electionName The name of the election
     *  @param startTime The start time of the election
     *  @param endTime The end time of the election
     *  @return address The address of the newly created Election contract
     */
    function createElection(
        address _owner,
        string memory electionName,
        uint startTime,
        uint endTime
    ) public onlyOwner returns (address) {
        Election newElection = new Election(
            _owner,
            electionName,
            startTime,
            endTime,
            voterRegistry,
            candidateRegistry
        );

        allElections.push(address(newElection));

        emit ElectionCreated(address(newElection), electionName);

        return address(newElection);
    }

    /**
     *  @notice Returns all created elections
     *  @return address[] Array of election contract addresses
     */
    function getAllElections() public view returns (address[] memory) {
        return allElections;
    }
}

contract Election {
    enum State {
        Pending,
        Active,
        Closed
    }

    address public immutable owner;
    address public immutable voterRegistry;
    address public immutable candidateRegistry;

    string public electionName;
    uint public startTime;
    uint public endTime;
    mapping(uint => bool) public isCandidateInElection;
    uint[] public participatingCandidateIDs;
    mapping(uint => uint) public voteTally;
    mapping(address => bool) private _hasVoted;
    uint public totalVotesCast;
    State public electionState;

    event VoteCasted(address indexed voter, uint indexed candidateId);
    event ElectionStateChanged(State newState);

    /**
     *  @notice Constructor sets the election parameters
     *  @param _owner The owner of the election
     *  @param _electionName The name of the election
     *  @param _startTime The start time of the election
     *  @param _endTime The end time of the election
     *  @param _voterRegistry The address of the Voter Registry contract
     *  @param _candidateRegistry The address of the Candidate Registry contract
     */
    constructor(
        address _owner,
        string memory _electionName,
        uint _startTime,
        uint _endTime,
        address _voterRegistry,
        address _candidateRegistry
    ) {
        owner = _owner;
        electionName = _electionName;
        startTime = _startTime;
        endTime = _endTime;
        voterRegistry = _voterRegistry;
        candidateRegistry = _candidateRegistry;
        electionState = State.Pending;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    /**
     *  @notice Starts the election
     *  @dev Can only be called by the owner
     */
    function startElection() public onlyOwner {
        require(electionState == State.Pending, "Already started");

        electionState = State.Active;
        emit ElectionStateChanged(State.Active);
    }

    /**
     *  @notice Ends the election
     *  @dev Can only be called by the owner
     */
    function endElection() public onlyOwner {
        require(electionState == State.Active, "Not active");

        electionState = State.Closed;
        emit ElectionStateChanged(State.Closed);
    }

    /**
     *  @notice Adds a candidate to the election
     *  @param candidateId The ID of the candidate to be added
     *  @dev Can only be called by the owner
     */
    function addCandidateToElection(uint candidateId) public onlyOwner {
        require(electionState == State.Pending, "Election already started");
        require(!isCandidateInElection[candidateId], "Candidate already added");
        require(
            ICandidateRegistry(candidateRegistry).isCandidateRegistered(
                candidateId
            ),
            "Candidate not registered in CandidateRegistry"
        );

        isCandidateInElection[candidateId] = true;
        voteTally[candidateId] = 0;
        participatingCandidateIDs.push(candidateId);
    }

    /**
     *  @notice Casts a vote for a candidate
     *  @param candidateId The ID of the candidate to vote for
     */
    function castVote(uint candidateId) public {
        require(electionState == State.Active, "Election is not active");
        require(!_hasVoted[msg.sender], "Voter has already voted");
        require(isCandidateInElection[candidateId], "Invalid candidate");
        require(
            IVoterRegistry(voterRegistry).isVoterEligible(msg.sender),
            "Voter is not eligible"
        );

        _hasVoted[msg.sender] = true;
        voteTally[candidateId]++;
        totalVotesCast++;

        emit VoteCasted(msg.sender, candidateId);
    }

    /**
     *  @notice Validates if a voter has cast their vote
     *  @param voter The address of the voter to validate
     *  @return bool True if the voter has cast their vote, false otherwise
     */
    function validateVoteCast(address voter) public view returns (bool) {
        return _hasVoted[voter];
    }

    /**
     * @notice Returns the vote tally for a candidate
     * @param candidateId The ID of the candidate
     * @return uint The vote tally for the candidate
     */
    function getVoteTally(uint candidateId) public view returns (uint) {
        return voteTally[candidateId];
    }

    /**
     * @notice Returns the total number of votes cast in the election
     * @return uint The total number of votes cast
     */
    function getTotalVotesCast() public view returns (uint) {
        return totalVotesCast;
    }

    /**
     *  @notice Returns the list of participating candidate IDs
     *  @return uint[] Array of candidate IDs
     */
    function getParticipatingCandidates() public view returns (uint[] memory) {
        return participatingCandidateIDs;
    }

    /**
     * @notice Returns information about the election
     * @return string Election name
     * @return uint Start time
     * @return uint End time
     * @return State Current state of the election
     */
    function getElectionInfo() public view returns (string memory, uint, uint, State) {
        return (electionName, startTime, endTime, electionState);
    }
}
