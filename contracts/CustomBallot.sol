// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

interface IERC20Votes {
    function getVotes(address) external returns (uint256);
    function getPastVotes(address, uint256) external returns (uint256);
}

contract CustomBallot {
    event Voted(
        address indexed voter,
        uint256 indexed proposal,
        uint256 weight,
        uint256 proposalVotes
    );

    address public voter;

    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    mapping(address => uint256) public spentVotePower;

    Proposal[] public proposals;
    IERC20Votes public voteToken;
    uint256 public referenceBlock;

    constructor(bytes32[] memory proposalNames, address _voteToken) {
        for (uint256 i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
        voteToken = IERC20Votes(_voteToken);
        referenceBlock = block.number;
    }

    function vote(uint256 proposal, uint256 amount) external {
        uint256 votingPowerAvailable = votingPower();  
         // TODO: Change this

        require(votingPowerAvailable >= amount, "Has not enough voting power");
        spentVotePower[msg.sender] += amount;
        proposals[proposal].voteCount += amount;
        emit Voted(msg.sender, proposal, amount, proposals[proposal].voteCount);
    }

    function winningProposal() public view returns (uint256 winningProposal_) {
        uint256 winningVoteCount = 0;
        for (uint256 p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }

    function votingPower() public  returns (uint256 _votingPower) {
        //TODO: do this
        _votingPower = voteToken.getVotes(msg.sender); 
        _votingPower = _votingPower - spentVotePower[msg.sender];
    }
}
