import { ethers } from "hardhat";
import { convertStringArrayToBytes32, getDefaultProposals } from "./_helper";
import * as dotenv from "dotenv";
dotenv.config();

export async function main() {
  /*************************************************************************************
   * SETUP
   **************************************************************************************/

  //ACCOUNTS
  const [deployer, acc1, acc2, acc3, acc4] = await ethers.getSigners();

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
  console.log(`Proposals:\n ${getDefaultProposals()}\n`);

  //GIVE BALLOT ROLES FOR MINTING
  const MINTER_ROLE = await VOTES_CONTRACT.MINTER_ROLE();
  const grantRoleTx = await VOTES_CONTRACT.grantRole(
    MINTER_ROLE,
    BALLOT_CONTRACT.address
  );
  const roleReceipt = await grantRoleTx.wait();
  console.log(`Assign Role \n Role receipt hash ${roleReceipt.blockHash}`);
  console.log(` Role receipt blockNumber ${roleReceipt.blockNumber}\n`);

  //DISPLAY ALL PROPOSALS
  const results = await BALLOT_CONTRACT.allProposals();
  console.log(`All Proposals`);
  for (let x = 0; x < results.length; x++) {
    console.log(
      ` Proposal ${x}: ${ethers.utils.parseBytes32String(
        results[x].name
      )} Votes: ${ethers.utils.formatUnits(results[x].voteCount)}`
    );
  }

  /*************************************************************************************
   * MINT
   **************************************************************************************/

  //BUY TOKENS - ACC 1
  console.log("\nBuy 2 tokens with account 1");
  const buyTokensTx = await BALLOT_CONTRACT.connect(acc1).buyTokens({
    value: ethers.utils.parseEther("2"),
  });
  await buyTokensTx.wait();
  const balance = await BALLOT_CONTRACT.getBalance(acc1.address);
  console.log(` Account 1 balance: ${ethers.utils.formatEther(balance)}\n`);

  //BUY TOKENS - ACC 2
  console.log("\nBuy 2 tokens with account 2");
  const buyTokensTx2 = await BALLOT_CONTRACT.connect(acc2).buyTokens({
    value: ethers.utils.parseEther("2"),
  });
  await buyTokensTx2.wait();
  const balance2 = await BALLOT_CONTRACT.getBalance(acc2.address);
  console.log(` Account 2 balance: ${ethers.utils.formatEther(balance2)}\n`);

  //BUY TOKENS - ACC 3
  console.log("\nBuy 3 tokens with account 3");
  const buyTokensTx3 = await BALLOT_CONTRACT.connect(acc3).buyTokens({
    value: ethers.utils.parseEther("3"),
  });
  await buyTokensTx3.wait();
  const balance3 = await BALLOT_CONTRACT.getBalance(acc3.address);
  console.log(` Account 3 balance: ${ethers.utils.formatEther(balance3)}\n`);

  //TOTAL SUPPLY
  const totalSupply = await BALLOT_CONTRACT.getTotalSupply();
  console.log(`Total supply ${ethers.utils.formatEther(totalSupply)}\n`);

  /*************************************************************************************
   * VOTING POWER (BEFORE DELEGATION)
   **************************************************************************************/

  //CHECK VOTING POWER OF ACC 1 (BEFORE DELEGATION)
  const votesBeforeSelfDelegate = await BALLOT_CONTRACT.connect(
    acc1
  ).getVotes();
  console.log(
    `Account 1 has voting power of ${ethers.utils.formatEther(
      votesBeforeSelfDelegate
    )} before self delegation\n`
  );

  //CHECK VOTING POWER OF ACC 2 (BEFORE DELEGATION)
  const votesBeforeSelfDelegate2 = await BALLOT_CONTRACT.connect(
    acc2
  ).getVotes();
  console.log(
    `Account 2 has voting power of ${ethers.utils.formatEther(
      votesBeforeSelfDelegate2
    )} before self delegation\n`
  );

  //CHECK VOTING POWER OF ACC 3 (BEFORE DELEGATION)
  const votesBeforeSelfDelegate3 = await BALLOT_CONTRACT.connect(
    acc3
  ).getVotes();
  console.log(
    `Account 3 has voting power of ${ethers.utils.formatEther(
      votesBeforeSelfDelegate3
    )} before delegation\n`
  );

  /*************************************************************************************
   * DELEGATE
   **************************************************************************************/

  //SELF DELEGATE - ACC 1
  const delegateTx = await VOTES_CONTRACT.connect(acc1).delegate(acc1.address);
  await delegateTx.wait();
  console.log(
    ` Account 1 self delegation blockNumber ${delegateTx.blockNumber}\n`
  );

  //SELF DELEGATE - ACC 2
  const delegateTx2 = await VOTES_CONTRACT.connect(acc2).delegate(acc2.address);
  await delegateTx2.wait();
  console.log(
    ` Account 2 self delegation blockNumber ${delegateTx2.blockNumber}\n`
  );

  //DELEGATE ACC3 TOKENS TO ACC1
  const delegate = await BALLOT_CONTRACT.connect(acc3).delegate(acc1.address);
  await delegate.wait();
  console.log(
    `Account 3 delegation to 1 \n receipt hash ${delegate.blockHash}\n`
  );

  /*************************************************************************************
   * SET BLOCK
   **************************************************************************************/

  //CURRENT BLOCK
  const currentBlock2 = await ethers.provider.getBlock("latest");
  console.log(`The current block number is ${currentBlock2.number}\n`);

  //SET BLOCK
  const setBlockTx = await BALLOT_CONTRACT.connect(deployer).setBlock(
    currentBlock2.number
  );
  await setBlockTx.wait();

  /*************************************************************************************
   * VOTING POWER (AFTER DELEGATION)
   **************************************************************************************/

  //CHECK VOTING POWER OF ACC 1 (AFTER DELEGATION)
  const votesBeforeSelfDelegate4 = await BALLOT_CONTRACT.connect(
    acc1
  ).getPastVotes();
  console.log(
    `Account 1 has voting power of ${ethers.utils.formatEther(
      votesBeforeSelfDelegate4
    )} after self delegation\n`
  );

  //CHECK VOTING POWER OF ACC 2 (AFTER DELEGATION)
  const votesBeforeSelfDelegate5 = await BALLOT_CONTRACT.connect(
    acc2
  ).getPastVotes();
  console.log(
    `Account 2 has voting power of ${ethers.utils.formatEther(
      votesBeforeSelfDelegate5
    )} after self delegation\n`
  );

  //CHECK VOTING POWER OF ACC 3 (AFTER DELEGATION)
  const votesBeforeSelfDelegate6 = await BALLOT_CONTRACT.connect(
    acc3
  ).getPastVotes();
  console.log(
    `Account 3 has voting power of ${ethers.utils.formatEther(
      votesBeforeSelfDelegate6
    )} after delegation\n`
  );

  /*************************************************************************************
   * VOTING
   **************************************************************************************/

  //VOTE - ACC 1
  const voteTx = await BALLOT_CONTRACT.connect(acc1).vote(
    1,
    ethers.utils.parseEther("1")
  );
  await voteTx.wait();
  console.log(`Account 1 vote: \n receipt hash ${voteTx.blockHash}\n`);

  //VOTE - ACC 2
  const voteTx1 = await BALLOT_CONTRACT.connect(acc2).vote(
    2,
    ethers.utils.parseEther("2")
  );
  await voteTx1.wait();
  console.log(`Account 2 vote: \n receipt hash ${voteTx1.blockHash}\n`);

  /*************************************************************************************
   * DISPLAY
   **************************************************************************************/

  //DISPLAY ALL PROPOSALS
  const results2 = await BALLOT_CONTRACT.allProposals();
  console.log(`All Proposals`);
  for (let x = 0; x < results2.length; x++) {
    console.log(
      ` Proposal ${x}: ${ethers.utils.parseBytes32String(
        results2[x].name
      )} Votes: ${ethers.utils.formatUnits(results2[x].voteCount)}`
    );
  }

  /*************************************************************************************
   * WINNER
   **************************************************************************************/

  //GET WINNING PROPOSAL BEFORE DELEGATE
  const winningProposal = await BALLOT_CONTRACT.winnerName();
  console.log(
    `\nWinning proposal ${ethers.utils.parseBytes32String(winningProposal)}\n`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
