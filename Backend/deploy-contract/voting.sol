// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public superAdmin;

    struct Admin {
        bool isAdmin;
    }

    struct Voter {
        bool hasVoted;
        string candidate;
    }

    // Admins
    mapping(address => Admin) public admins;

    // Per-admin voters
    mapping(address => mapping(string => Voter)) public voters; 
    // voters[admin][voterId] => Voter

    // Per-admin candidate votes
    mapping(address => mapping(string => uint256)) public candidateVotes;
    // candidateVotes[admin][candidate] => votes

    // Per-admin candidate list
    mapping(address => string[]) public candidateList;
    // To avoid duplicates
    mapping(address => mapping(string => bool)) public isCandidateRegistered;

    event AdminAdded(address indexed admin);
    event CandidateRegistered(address indexed admin, string candidate);
    event VoteCast(address indexed admin, string voterId, string candidate);

    modifier onlySuperAdmin() {
        require(msg.sender == superAdmin, "Not super admin");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender].isAdmin, "Not admin");
        _;
    }

    constructor() {
        superAdmin = msg.sender;
        admins[msg.sender] = Admin(true);
    }

    function addAdmin(address _admin) public onlySuperAdmin {
        admins[_admin] = Admin(true);
        emit AdminAdded(_admin);
    }

    // Register candidate under the calling admin
    function registerCandidate(string memory candidate) public onlyAdmin {
        require(!isCandidateRegistered[msg.sender][candidate], "Candidate already registered");
        
        candidateList[msg.sender].push(candidate);
        isCandidateRegistered[msg.sender][candidate] = true;

        emit CandidateRegistered(msg.sender, candidate);
    }

    function castVote(string memory voterId, string memory candidate) public onlyAdmin {
        require(!voters[msg.sender][voterId].hasVoted, "Voter already voted");
        require(isCandidateRegistered[msg.sender][candidate], "Candidate not registered");

        // Record voter choice under this admin
        voters[msg.sender][voterId] = Voter(true, candidate);

        // Increment candidate vote count under this admin
        candidateVotes[msg.sender][candidate] += 1;

        emit VoteCast(msg.sender, voterId, candidate);
    }

    function hasVoted(address adminAddr, string memory voterId) public view returns (bool) {
        return voters[adminAddr][voterId].hasVoted;
    }

    function getVote(address adminAddr, string memory voterId) public view returns (string memory) {
        require(voters[adminAddr][voterId].hasVoted, "No vote found");
        return voters[adminAddr][voterId].candidate;
    }

    function getCandidateVotes(address adminAddr, string memory candidate) public view returns (uint256) {
        return candidateVotes[adminAddr][candidate];
    }

    function getAllCandidates(address adminAddr) public view returns (string[] memory) {
        return candidateList[adminAddr];
    }

    // ✅ NEW FUNCTION: get candidates + votes (including zero votes)
    function getCandidatesWithVotes(address adminAddr) 
        public 
        view 
        returns (string[] memory, uint256[] memory) 
    {
        string[] memory candidates = candidateList[adminAddr];
        uint256[] memory votes = new uint256[](candidates.length);

        for (uint i = 0; i < candidates.length; i++) {
            votes[i] = candidateVotes[adminAddr][candidates[i]];
        }

        return (candidates, votes);
    }
}
