import { getBallotContract } from "./_helper";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const ballotContract = await getBallotContract();
  const buyTokensTx = await ballotContract.setBlock(7786135);
  await buyTokensTx.wait();
  console.log("Set Block");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
