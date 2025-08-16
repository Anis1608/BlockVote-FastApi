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

    mapping(address => Admin) public admins;
    mapping(string => Voter) public voters; // voterID => Voter

    event AdminAdded(address indexed admin);
    event VoteCast(string voterId, string candidate);

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

    function castVote(string memory voterId, string memory candidate) public onlyAdmin {
        require(!voters[voterId].hasVoted, "Voter already voted");
        voters[voterId] = Voter(true, candidate);
        emit VoteCast(voterId, candidate);
    }

    function hasVoted(string memory voterId) public view returns (bool) {
        return voters[voterId].hasVoted;
    }

    function getVote(string memory voterId) public view returns (string memory) {
        require(voters[voterId].hasVoted, "No vote found");
        return voters[voterId].candidate;
    }
}
