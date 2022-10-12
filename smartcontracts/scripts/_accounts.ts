import { ethers } from "ethers";

export async function getSignerArray(): Promise<ethers.Wallet[]> {
    const provider = ethers.getDefaultProvider("goerli");
    const deployer = new ethers.Wallet(process.env.PRIVATE_KEY_1 ?? "");
    const acc1 = new ethers.Wallet(process.env.PRIVATE_KEY_2 ?? "");
    const acc2 = new ethers.Wallet(process.env.PRIVATE_KEY_3 ?? "");
  
    console.log(`Using addresses:\n${deployer.address}\n${acc1.address}\n${acc2.address}`);
    
    const deployerSigner = deployer.connect(provider);
    const deployerAcc1 = acc1.connect(provider);
    const deployerAcc2 = acc2.connect(provider);
  
    return [
      deployerSigner,
      deployerAcc1,
      deployerAcc2
    ];
    
}