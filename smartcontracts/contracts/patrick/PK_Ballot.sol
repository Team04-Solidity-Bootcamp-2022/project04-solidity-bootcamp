// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IERC20Votes {
    function getPastVotes(address, uint256) external view returns (uint256);

    function mint(address to, uint256 amount) external;

    function delegate(address delegatee) external;
}

contract PK_Ballot {
    uint256 public referenceBlock;
    IERC20Votes public tokenContract;
    address public owner;

    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    Proposal[] public proposals;
    mapping(address => uint256) public votingPowerSpent;

    constructor(
        bytes32[] memory proposalNames,
        address _tokenContract,
        uint256 _referenceBlock
    ) {
        for (uint256 i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
        referenceBlock = _referenceBlock;
        tokenContract = IERC20Votes(_tokenContract);
        owner = msg.sender;
    }

    // Modifier to check that the caller is the owner of
    // the contract.
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        // Underscore is a special character only used inside
        // a function modifier and it tells Solidity to
        // execute the rest of the code.
        _;
    }

    function buyTokens() public payable {
        uint256 paymentReceived = msg.value;
        tokenContract.mint(msg.sender, paymentReceived);
    }

   function delegate(address to) external {
        tokenContract.delegate(to);
    }

    function setBlock (uint blockNumber) public onlyOwner {
        referenceBlock = blockNumber;
    }

    function vote(uint256 proposal, uint256 amount) external {
        uint256 _votingPower = getVotingPower(msg.sender);

        require(_votingPower >= amount, "Has not enough voting power to vote");

        votingPowerSpent[msg.sender] += amount;
        proposals[proposal].voteCount += amount;
    }

    function getVotingPower(address voter)
        internal
        view
        returns (uint256 votingPower_)
    {
        votingPower_ =
            tokenContract.getPastVotes(voter, referenceBlock) -
            votingPowerSpent[voter];
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
}
