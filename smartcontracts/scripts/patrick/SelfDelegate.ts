import { getVotesContract } from "./_helper";
import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const votesContract = await getVotesContract();

  const delegateTx = await votesContract.delegate(
    process.env.MAIN_ACCOUNT_ADDRESS ?? ""
  );
  await delegateTx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
