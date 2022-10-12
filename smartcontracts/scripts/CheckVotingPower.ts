// IMPORTS
import { getContract } from "./DeployToken";
import { BigNumber } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();


async function checkVotingPower(address: string): Promise<BigNumber> {
  const contract = await getContract();
  const votingPower = await contract.getVotes(address);

  console.log({votingPower});

  return votingPower;
}

async function main() {
  checkVotingPower(process.env.ROB_ADDRESS)
}

if (require.main === module) {
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});  
}
