import { getContract } from "./DeployTokenizedBallot";
import { getSignerArray } from "./_accounts";
import { ethers } from "ethers";

export async function castVote(contract: any, from: ethers.Wallet, proposalIndex) {
  console.log(`Casting votes for proposal ${proposalIndex}`);
  const TOKENS_TO_VOTE = ethers.utils.parseEther("2");
  
  const voteTx = await contract.connect(from).vote(proposalIndex, TOKENS_TO_VOTE);
  const voteReceipt = await voteTx.wait();

  console.log({voteReceipt});
}

export async function main() {
  const contract = await getContract();
  const [deployer, acc1, acc2] = await getSignerArray();
  await castVote(contract, acc2, 0);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}