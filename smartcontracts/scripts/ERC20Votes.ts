import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

const TOKEN_MINT = ethers.utils.parseEther("2");

async function main() {
  const [deployer, acc1, acc2] = await ethers.getSigners();

  const myTokenContractFactory = await ethers.getContractFactory("MyToken");
  const myTokenContract = await myTokenContractFactory.deploy();
  await myTokenContract.deployed();
  console.log(
      `MyToken contract was deployed at address ${myTokenContract.address}\n` 
  );

  const totalSupply = await myTokenContract.totalSupply();
  console.log(`Total Supply is ${totalSupply}\n`);

  const initialVotes = await myTokenContract.getVotes(acc1.address);
  console.log(
    `At deployment ${acc1.address} has a voting power of ${initialVotes}\n`
  );

  const mintTx = await myTokenContract.mint(acc1.address, TOKEN_MINT);
  const mintReceipt = await mintTx.wait();

  const balanceAcc1 = await myTokenContract.balanceOf(acc1.address);
  
  const totalSupplyAfter = await myTokenContract.totalSupply();

  console.log(
    `After minting, total supply is ${ethers.utils.formatEther(
      totalSupplyAfter
    )}\n`
  );
  
  console.log(
    `After minting, ${acc1.address} balance is ${ethers.utils.formatEther(
      balanceAcc1
    )}\n`
  );
  
  const votesAfter = await myTokenContract.getVotes(acc1.address);
  console.log(
    `At deployment ${acc1.address} has a voting power of ${votesAfter}\n`
  );

  const delegateTx = await myTokenContract.connect(acc1).delegate(acc1.address);
  const delegateReceipt = await delegateTx.wait();

  const votesAfterDelegate = await myTokenContract.getVotes(acc1.address);
  console.log(
    `After delegate ${acc1.address} has a voting power of ${ethers.utils.formatEther(
      votesAfterDelegate
    )}\n`
  );

  const currentBlock = await ethers.provider.getBlock("latest");
  console.log(`The current block number is ${currentBlock.number}\n`);

  const mintTx2 = await myTokenContract.mint(acc2.address, 0);
  const mintReceipt2 = await mintTx.wait();
  const currentBlock2 = await ethers.provider.getBlock("latest");
  console.log(`The current block number is ${currentBlock2.number}\n`);
  const mintTx3 = await myTokenContract.mint(acc2.address, 0);
  const mintReceipt3 = await mintTx.wait();
  const currentBlock3 = await ethers.provider.getBlock("latest");
  console.log(`The current block number is ${currentBlock3.number}\n`);
  
  const pastVotes = await Promise.all([
    myTokenContract.getPastVotes(acc1.address, 4),
    myTokenContract.getPastVotes(acc1.address, 3),
    myTokenContract.getPastVotes(acc1.address, 2),
    myTokenContract.getPastVotes(acc1.address, 1),
  ]);
  console.log(pastVotes);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});