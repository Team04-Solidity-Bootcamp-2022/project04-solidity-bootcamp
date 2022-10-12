import { getContract } from "./DeployToken";
import { deploy } from "./DeployTokenizedBallot";
import { delegate } from "./Delegate";
import { castVote } from "./Cast";
import { queryResults } from "./QueryResults";
import { getSignerArray } from "./_accounts";
import { Contract, ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    const myTokenContract = await getContract();
    const [deployer, acc1, acc2] = await getSignerArray();

    //const delegatees = [
    //    process.env.ROB_ADDRESS,
    //];

    //for(let i = 0; i < delegatees.length; i++) {
    //    await delegate(myTokenContract, acc2, delegatees[i]);
    //}
    const currentBlock = await deployer.provider.getBlock("latest");
    const currentBlockNumber = currentBlock.number;

    const pastVotes = await Promise.all([
        myTokenContract.getPastVotes(acc1.address, currentBlock.number-1),
        myTokenContract.getPastVotes(acc2.address, currentBlock.number-1),
        myTokenContract.getPastVotes(deployer.address, currentBlock.number-1),
    ]);
    console.log({pastVotes});

    const tokenizedBallotContract = await deploy(currentBlockNumber-1);
    await castVote(tokenizedBallotContract, acc1, 1);

    queryResults(tokenizedBallotContract);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });  
}
