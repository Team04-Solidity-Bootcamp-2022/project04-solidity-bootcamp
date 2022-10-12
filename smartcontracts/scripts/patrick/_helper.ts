import { ethers } from "hardhat";
import { PK_Ballot__factory, PK_Votes__factory } from "../../typechain-types";
import { getSigner } from "./_deploy";

export const getDefaultProposals = () => {
  return ["Proposal 1", "Proposal 2", "Proposal 3"];
};

export const convertStringArrayToBytes32 = (array: string[]) => {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
};

export async function getVotesContract() {
  const signer = await getSigner();
  const factory = new PK_Votes__factory(signer);
  const contract = await factory.attach(process.env.VOTES_CONTRACT_ADDRESS ?? "");
  return contract;
}

export async function getBallotContract() {
  const signer = await getSigner();
  const factory = new PK_Ballot__factory(signer);
  const contract = await factory.attach(process.env.BALLOT_CONTRACT_ADDRESS ?? "");
  return contract;
}