import { getVotesContract, getBallotContract } from "./_helper";
import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const ballotContract = await getBallotContract();

  const buyTokensTx = await ballotContract.buyTokens({
    value: ethers.utils.parseEther("0.01"),
  });
  await buyTokensTx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
