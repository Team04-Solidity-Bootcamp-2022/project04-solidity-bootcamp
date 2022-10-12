import { convertStringArrayToBytes32, getDefaultProposals } from "./_helper";
import { getSignerArray } from "./_accounts";
import { getContract as getMyTokenContract } from "./DeployToken"
import { TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const refBlock = 8;

export async function deploy(_refBlock) {
  const [deployer, acc1, acc2] = await getSignerArray();
  
  //console.log({deployer, acc1, acc2});
  const myTokenContract = await getMyTokenContract();
  
  const tokenizedBallotContractFactory = new TokenizedBallot__factory(deployer);
  const tokenizedBallotContract = await tokenizedBallotContractFactory.deploy(
    convertStringArrayToBytes32(getDefaultProposals()),
    myTokenContract.address,
    _refBlock
  );
  
  await tokenizedBallotContract.deployed();

  console.log(
      `TokenizedBallot contract was deployed at address ${tokenizedBallotContract.address}\n` 
  );
  
  return tokenizedBallotContract;
}

export async function getContract() {
  const [deployer, acc1, acc2] = await getSignerArray();
  const factory = new TokenizedBallot__factory(deployer);
  const contract = await factory.attach(process.env.TOKENIZED_BALLOT_CONTRACT_ADDRESS ?? "");
  return contract;
}

if (require.main === module) {
  deploy(refBlock).catch(async (error) => {
    console.error(error);
    process.exitCode = 1;
  });  
}
