import { Injectable } from '@angular/core';
import { ethers, Signer } from 'ethers';
import TokenizedBallot from '../../assets/TokenizedBallot.json';

//FIXME: Get from env
const TOKENIZEDBALLOT_CONTRACT_ADDRESS ='';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  provider: ethers.providers.Web3Provider;
  contract?: ethers.Contract;
  walletAddress: string[];

  constructor() { 
    this.provider = new ethers.providers.Web3Provider((window as any).ethereum);
    this.walletAddress = ['Loading...'];
  }

  async initializeContract() {
    if (await this.isAccountConnected()) {
      this.contract = new ethers.Contract(
        TOKENIZEDBALLOT_CONTRACT_ADDRESS,
        TokenizedBallot.abi
      ).connect(await this.accountInfo());
    }
    this.walletAddress = await this.provider.listAccounts();
  }

  async isAccountConnected(): Promise<boolean> {
    return (await this.provider.listAccounts()).length > 0;
  }

  async accountInfo(): Promise<Signer> {
    return this.provider.getSigner();
  }

  async connectAccount(): Promise<Signer> {
    await this.provider.send('eth_requestAccounts', []);
    //await this.initializeContract();

    return await this.accountInfo();
  }

  async settleUp(groupId: string) {}
}
