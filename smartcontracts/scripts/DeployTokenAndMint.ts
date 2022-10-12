import { deploy } from "./DeployToken";
import { mintTokens } from "./MintTokens";
import { Contract } from "ethers";

async function main() {
    const myTokenContract: Promise<Contract> = await deploy();
    await mintTokens(myTokenContract);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });  
}
