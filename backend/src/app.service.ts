import { Injectable } from '@nestjs/common';
import { VotingTokenDto } from './dtos/VotingTokenDto';
import { ethers, Contract } from 'ethers';

import * as MyTokenJson from './assets/MyToken.json';
import * as TokenizedBallotJson from './assets/TokenizedBallot.json';

const MYTOKEN_CONTRACT_ADDRESS ='';
const TOKENIZEDBALLOT_CONTRACT_ADDRESS ='';

@Injectable()
export class AppService {
  
  provider: ethers.providers.Provider;
  myTokenContract: Contract;
  tokenizedBallotContract: Contract;

  constructor() {
    this.provider = ethers.getDefaultProvider('goerli');
    this.myTokenContract = new ethers.Contract(
      MYTOKEN_CONTRACT_ADDRESS,
      MyTokenJson.abi,
      this.provider,
    );
    this.tokenizedBallotContract = new ethers.Contract(
      TOKENIZEDBALLOT_CONTRACT_ADDRESS,
      TokenizedBallotJson.abi,
      this.provider,
    );
  }

  recentVotes(): string {
    throw new Error("Method not implemented.");
  }
  
  getContractAddress(): string {
    return "potatoAddr";
  }

  claimTokens(body: VotingTokenDto) {
    return true;
  }
}
