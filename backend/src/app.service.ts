import { Injectable } from '@nestjs/common';
import { VotingTokenDto } from './dtos/VotingTokenDto';
import { ethers, Contract } from 'ethers';
import { JsonDB, Config } from 'node-json-db';

import * as MyTokenJson from './assets/MyToken.json';
import * as TokenizedBallotJson from './assets/TokenizedBallot.json';
import { AddToWhitelistDto } from './dtos/AddToWhitelistDto';

const MYTOKEN_CONTRACT_ADDRESS ='';
const TOKENIZEDBALLOT_CONTRACT_ADDRESS ='';

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  myTokenContract: Contract;
  tokenizedBallotContract: Contract;
  jsonDB: JsonDB;

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
    this.jsonDB = new JsonDB(new Config("src/assets/db.json", true, false, '/'));

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

  async addToWhitelist(body: AddToWhitelistDto) {
    try {
      const currentData = await this.jsonDB.getData("/whitelist");
    } catch(error) {
      this.jsonDB.push("/whitelist", []);
    }
    await this.jsonDB.push("/whitelist[]", body);
    return await this.jsonDB.getData("/whitelist[-1]");
  }
}
