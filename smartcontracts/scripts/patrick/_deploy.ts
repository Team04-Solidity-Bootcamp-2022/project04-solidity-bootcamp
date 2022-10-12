import { ethers } from "ethers";
import { convertStringArrayToBytes32, getDefaultProposals } from "./_helper";
import { PK_Ballot__factory, PK_Votes__factory } from "../../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

export async function getSigner() {
  const options = {
    alchemy: process.env.ALCHEMY_API_KEY,
    infura: process.env.INFURA_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
  };
  const provider = ethers.getDefaultProvider("goerli", options);
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
  console.log(`Using address ${wallet.address}`);
  const signer = wallet.connect(provider);
  return signer;
}
export async function deployVotes() {
  const signer = await getSigner();
  const factory = new PK_Votes__factory(signer);
  const contract = await factory.deploy();
  await contract.deployed();
  return contract;
}

export async function deployBallot(votesContract: any) {
  const signer = await getSigner();
  const factory = new PK_Ballot__factory(signer);
  const contract = await factory.deploy(
    convertStringArrayToBytes32(getDefaultProposals()),
    votesContract.address,
    ethers.BigNumber.from(process.env.BLOCK_NUMBER ?? 1)
  );
  await contract.deployed();
  return contract;
}
