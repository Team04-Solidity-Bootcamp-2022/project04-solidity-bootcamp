// IMPORTS
import { getContract } from "./DeployToken";
import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

const voters = [
  process.env.FRANCISCO_ADDRESS_2,
  process.env.FRANCISCO_ADDRESS_3,
  process.env.PATRICK_ADDRESS,
  process.env.ROB_ADDRESS,
  process.env.STEFANO_ADDRESS,
  process.env.TATIANA_ADDRESS
];

export async function mintTokens(contract: any) {
  const TOKEN_MINT_DEFAULT_AMOUNT = ethers.utils.parseEther("5");
  
  for(let i=0; i < voters.length; i++) {
    const mintTx = await contract.mint(voters[i], TOKEN_MINT_DEFAULT_AMOUNT);
    const mintReceipt = await mintTx.wait();
    console.log({mintReceipt});
  }
}

export async function main() {
    const contract = await getContract();
    mintTokens(contract);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });  
}
