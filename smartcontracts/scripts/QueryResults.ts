import { ethers } from "ethers";
import { getContract } from "./DeployTokenizedBallot";
import { getDefaultProposals } from "./_helper";

export async function queryResults(contract: any) {
  for (let i = 0; i < getDefaultProposals().length; i++) {
    const proposal = await contract.proposals(i);
    const name = ethers.utils.parseBytes32String(proposal.name);
    console.log({ i, name, proposal });
  }
}

export async function main() {
  const contract = await getContract();
  await queryResults(contract);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}