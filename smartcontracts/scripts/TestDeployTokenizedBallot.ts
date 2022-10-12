import { ethers } from "hardhat";
import { convertStringArrayToBytes32, getDefaultProposals } from "./_helper";
import * as dotenv from "dotenv";
dotenv.config();

export async function deploy() {
  const accounts = await ethers.getSigners();
  const PROPOSALS = getDefaultProposals();
  const refBlock = ethers.BigNumber.from(9);
  const TOKEN_MINT = ethers.utils.parseEther("5");
  const TOKEN_MINT_2 = ethers.utils.parseEther("2");

  const myTokenContractFactory = await ethers.getContractFactory("MyToken");
  const myTokenContract = await myTokenContractFactory.deploy();
  await myTokenContract.deployed();
  console.log(
      `MyToken contract was deployed at address ${myTokenContract.address}\n` 
  );

  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });


  const tokenizedBallotFactory = await ethers.getContractFactory("TokenizedBallot");
  const tokenizedBallotContract = await tokenizedBallotFactory.deploy(
    convertStringArrayToBytes32(PROPOSALS),
    myTokenContract.address,
    refBlock
  );
  await tokenizedBallotContract.deployed();

  console.log(`TokenizedBallot deployed to ${tokenizedBallotContract.address}`);

  const mintTx1 = await myTokenContract.mint(accounts[1].address, TOKEN_MINT);
  const mintReceipt1 = await mintTx1.wait();
  const delegateTx1 = await myTokenContract.connect(accounts[1]).delegate(accounts[1].address);
  const delegateReceipt1 = await delegateTx1.wait();

  const mintTx2 = await myTokenContract.mint(accounts[2].address, TOKEN_MINT_2);
  const mintReceipt2 = await mintTx1.wait();
  const delegateTx2 = await myTokenContract.connect(accounts[2]).delegate(accounts[2].address);
  const delegateReceipt2 = await delegateTx1.wait();

  const mintTx3 = await myTokenContract.mint(accounts[3].address, TOKEN_MINT_2);
  const mintReceipt3 = await mintTx3.wait();
  const delegateTx3 = await myTokenContract.connect(accounts[3]).delegate(accounts[3].address);
  const delegateReceipt3 = await delegateTx3.wait();
  const delegateTo4Tx3 = await myTokenContract.connect(accounts[3]).delegate(accounts[2].address);
  const delegateTo4Receipt3 = await delegateTo4Tx3.wait();

  const votesAfterDelegate1 = await myTokenContract.getVotes(accounts[1].address);
  console.log(
    `After delegate ${accounts[1].address} has a voting power of ${ethers.utils.formatEther(
      votesAfterDelegate1
    )}\n`
  );

  const votesAfterDelegate2 = await myTokenContract.getVotes(accounts[2].address);
  console.log(
    `After delegate ${accounts[2].address} has a voting power of ${ethers.utils.formatEther(
      votesAfterDelegate2
    )}\n`
  );

  const votesAfterDelegate3 = await myTokenContract.getVotes(accounts[3].address);
  console.log(
    `After delegate ${accounts[3].address} has a voting power of ${ethers.utils.formatEther(
      votesAfterDelegate3
    )}\n`
  );

  const Acc3Delegatee = await myTokenContract.delegates(accounts[3].address);
  console.log(
    `${accounts[3].address} delegated voting power to ${Acc3Delegatee}\n`
  );

  const votesAfterDelegate4 = await myTokenContract.getVotes(accounts[4].address);
  console.log(
    `After delegate ${accounts[3].address} has a voting power of ${ethers.utils.formatEther(
      votesAfterDelegate4
    )}\n`
  );
  
  // const Acc3delegateToAcc2Tx = await tokenizedBallotContract.connect(accounts[3]).delegate(accounts[2].address);
  // const Acc3delegateToAcc2Receipt = await Acc3delegateToAcc2Tx.wait();

  const currentBlock = await ethers.provider.getBlock("latest");
  console.log(`The current block number is ${currentBlock.number}\n`);

  const Acc1VotesOnP1Tx = await tokenizedBallotContract.connect(accounts[1]).vote(0, ethers.utils.parseEther("1"));
  const Acc1VotesOnP1Receipt = await Acc1VotesOnP1Tx.wait();

  const Acc2VotesOnP2Tx = await tokenizedBallotContract.connect(accounts[2]).vote(1, ethers.utils.parseEther("1"));
  const Acc2VotesOnP2Receipt = await Acc2VotesOnP2Tx.wait();
  
  const currentBlock2 = await ethers.provider.getBlock("latest");
  console.log(`The current block number is ${currentBlock2.number}\n`);

  for (let i = 0; i < getDefaultProposals().length; i++) {
    const proposal = await tokenizedBallotContract.proposals(i);
    const name = ethers.utils.parseBytes32String(proposal.name);
    console.log({ i, name, proposal });
  }

  const pastVotes = await Promise.all([
    myTokenContract.getVotes(accounts[2].address),
    myTokenContract.getPastVotes(accounts[2].address, 10),
    myTokenContract.getPastVotes(accounts[2].address, 9),
    myTokenContract.getPastVotes(accounts[2].address, 8),
    myTokenContract.getPastVotes(accounts[2].address, 7),
    myTokenContract.getPastVotes(accounts[2].address, 6),
    myTokenContract.getPastVotes(accounts[2].address, 5),
  ]);
  console.log(pastVotes);
  
  const Acc2VotesOnP2AgainTx = await tokenizedBallotContract.connect(accounts[2]).vote(1, ethers.utils.parseEther("3"));
  const Acc2VotesOnP2AgainReceipt = await Acc2VotesOnP2AgainTx.wait();

  const votesAfterDelegateAndVote1 = await myTokenContract.getVotes(accounts[1].address);
  console.log(
    `After delegate ${accounts[1].address} has a voting power of ${ethers.utils.formatEther(
      votesAfterDelegateAndVote1
    )}\n`
  );

  const votesAfterDelegateAndVote2 = await myTokenContract.getVotes(accounts[2].address);
  console.log(
    `After delegate ${accounts[2].address} has a voting power of ${ethers.utils.formatEther(
      votesAfterDelegateAndVote2
    )}\n`
  );

  const votesAfterDelegateAndVote3 = await myTokenContract.getVotes(accounts[3].address);
  console.log(
    `After delegate ${accounts[3].address} has a voting power of ${ethers.utils.formatEther(
      votesAfterDelegateAndVote3
    )}\n`
  );

  for (let i = 0; i < getDefaultProposals().length; i++) {
    const proposal = await tokenizedBallotContract.proposals(i);
    const name = ethers.utils.parseBytes32String(proposal.name);
    console.log({ i, name, proposal });
  }


}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
