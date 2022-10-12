import { ethers } from "ethers";

export async function delegate(contract: any, from: ethers.Wallet, to: string) {
  const delegateTx = await contract.connect(from).delegate(to);
  const delegateReceipt = await delegateTx.wait();

  console.log({ delegateReceipt });
}
