import { ethers } from "hardhat";
import { convertStringArrayToBytes32, getDefaultProposals } from "./_helper";
import * as dotenv from "dotenv";
dotenv.config();

export async function deploy() {
  //ACCOUNTS
  const [deployer, acc1, acc2] = await ethers.getSigners();

  //DEPLOY VOTES ERC
  const VOTES_CONTRACT_FACTORY = await ethers.getContractFactory("PK_Votes");
  const VOTES_CONTRACT = await VOTES_CONTRACT_FACTORY.deploy();
  await VOTES_CONTRACT.deployed();
  console.log(`Votes deployed to ${VOTES_CONTRACT.address}\n`);

  //CURRENT BLOCK
  const currentBlock = await ethers.provider.getBlock("latest");
  console.log(`The current block number is ${currentBlock.number}\n`);

  //DEPLOY BALLOT
  const BALLOT_CONTRACT_FACTORY = await ethers.getContractFactory("PK_Ballot");
  const BALLOT_CONTRACT = await BALLOT_CONTRACT_FACTORY.deploy(
    convertStringArrayToBytes32(getDefaultProposals()),
    VOTES_CONTRACT.address,
    ethers.BigNumber.from(currentBlock.number)
  );
  await BALLOT_CONTRACT.deployed();
  console.log(`Ballot deployed to ${BALLOT_CONTRACT.address}\n`);

  //ROLES FOR MINTING
  const MINTER_ROLE = await VOTES_CONTRACT.MINTER_ROLE();
  const grantRoleTx = await VOTES_CONTRACT.grantRole(
    MINTER_ROLE,
    BALLOT_CONTRACT.address
  );
  await grantRoleTx.wait();

  //BUY TOKENS - ACC 1
  const buyTokensTx = await BALLOT_CONTRACT.connect(acc1).buyTokens({
    value: ethers.utils.parseEther("2"),
  });
  const buyTokensTxReceipt = await buyTokensTx.wait();
  console.log(`Account 1 buy tokens ${buyTokensTxReceipt}\n`);
  const balance = await VOTES_CONTRACT.balanceOf(acc1.address);
  console.log(`Account 1 balance ${ethers.utils.formatEther(balance)}\n`);

  //BUY TOKENS - ACC 2
  const buyTokensTx2 = await BALLOT_CONTRACT.connect(acc2).buyTokens({
    value: ethers.utils.parseEther("4"),
  });
  const buyTokensTxReceipt2 = await buyTokensTx2.wait();
  console.log(`Account 2 buy tokens ${buyTokensTxReceipt2}\n`);
  const balance2 = await VOTES_CONTRACT.balanceOf(acc2.address);
  console.log(`Account 2 balance ${ethers.utils.formatEther(balance2)}\n`);

  //TOTAL SUPPLY
  const totalSupply = await VOTES_CONTRACT.totalSupply();
  console.log(`Total supply ${ethers.utils.formatEther(totalSupply)}\n`);

  //SELF DELEGATE - ACC 1
  const delegateTx = await VOTES_CONTRACT.connect(acc1).delegate(acc1.address);
  await delegateTx.wait();

  //SELF DELEGATE - ACC 2
  const delegateTx2 = await VOTES_CONTRACT.connect(acc2).delegate(acc2.address);
  await delegateTx2.wait();

  //SET BLOCK
  const setBlockTx = await BALLOT_CONTRACT.connect(deployer).setBlock(8);
  await setBlockTx.wait();

  //CHECK VOTING POWER
  const votesAfterDelegate = await VOTES_CONTRACT.getVotes(acc1.address);
  console.log(
    `Account 1 has voting power of ${ethers.utils.formatEther(
      votesAfterDelegate
    )} after self delegation\n`
  );

  //CHECK VOTING POWER
  const votesAfterDelegate2 = await VOTES_CONTRACT.getVotes(acc2.address);
  console.log(
    `Account 2 has voting power of ${ethers.utils.formatEther(
      votesAfterDelegate2
    )} after self delegation\n`
  );

  //VOTE - ACC 1
  const voteTx = await BALLOT_CONTRACT.connect(acc1).vote(
    1,
    ethers.utils.parseEther("1")
  );
  await voteTx.wait();

  //VOTE - ACC 2
  const voteTx1 = await BALLOT_CONTRACT.connect(acc2).vote(
    2,
    ethers.utils.parseEther("2")
  );
  await voteTx1.wait();

  //GET WINNING PROPOSAL BEFORE DELEGATE
  const winningProposal = await BALLOT_CONTRACT.winnerName();
  console.log(
    `Winning proposal ${ethers.utils.parseBytes32String(winningProposal)}\n`
  );

  //DELEGATE
  const delegateTx3 = await BALLOT_CONTRACT.connect(acc2).delegate(acc1.address);
  await delegateTx3.wait();

  //GET WINNING PROPOSAL AFTER DELEGATE
  const winningProposal2 = await BALLOT_CONTRACT.winnerName();
  console.log(
    `Winning proposal ${ethers.utils.parseBytes32String(winningProposal2)}\n`
  );
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
