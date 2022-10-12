import { getSignerArray } from "./_accounts";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

export async function deploy() {
  const [deployer, acc1, acc2] = await getSignerArray();
  //console.log({deployer, acc1, acc2});
  
  const myTokenContractFactory = new MyToken__factory(deployer);
  const myTokenContract = await myTokenContractFactory.deploy();
  await myTokenContract.deployed();

  console.log(
      `MyToken contract was deployed at address ${myTokenContract.address}\n` 
  );
  
  return myTokenContract;
}

export async function getContract() {
  const [deployer, acc1, acc2] = await getSignerArray();
  const factory = new MyToken__factory(deployer);
  const contract = await factory.attach(process.env.MYTOKEN_CONTRACT_ADDRESS ?? "");
  return contract;
}

if (require.main === module) {
  deploy().catch(async (error) => {
    console.error(error);
    process.exitCode = 1;
  });  
}
