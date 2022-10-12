import { getVotesContract, getBallotContract } from "./_helper";
import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const votesContract = await getVotesContract();

  const votingPower =  await votesContract.getVotes(process.env.MAIN_ACCOUNT_ADDRESS ?? "");
  console.log(
    `Main Acc has voting power of ${ethers.utils.formatEther(
        votingPower
    )}\n`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});