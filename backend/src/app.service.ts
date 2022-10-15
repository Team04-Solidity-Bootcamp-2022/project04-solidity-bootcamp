import { Injectable, HttpException } from '@nestjs/common';
import { VotingTokenDto } from './dtos/VotingTokenDto';
import { ethers, Contract } from 'ethers';
import { JsonDB, Config } from 'node-json-db';
import * as dotenv from "dotenv";

import * as MyTokenJson from './assets/MyToken.json';
import * as TokenizedBallotJson from './assets/TokenizedBallot.json';
import { AddToWhitelistDto } from './dtos/AddToWhitelistDto';

dotenv.config();

const MYTOKEN_CONTRACT_ADDRESS ='';
const TOKENIZED_BALLOT_CONTRACT_ADDRESS ='';

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  myTokenContract: Contract;
  tokenizedBallotContract: Contract;
  jsonDB: JsonDB;

  constructor() {
    this.provider = ethers.getDefaultProvider('goerli');
    this.myTokenContract = new ethers.Contract(
      process.env.MYTOKEN_CONTRACT_ADDRESS,
      MyTokenJson.abi,
      this.provider,
    );
    this.tokenizedBallotContract = new ethers.Contract(
      process.env.TOKENIZED_BALLOT_CONTRACT_ADDRESS,
      TokenizedBallotJson.abi,
      this.provider,
    );
    this.jsonDB = new JsonDB(new Config("src/assets/db.json", true, false, '/'));

  }

  recentVotes(): string {
    throw new Error("Method not implemented.");
  }
  
  getContractAddress(): string {
    return process.env.MYTOKEN_CONTRACT_ADDRESS;
  }

  async claimTokens(body: VotingTokenDto) {
    let whitelistArr: Array<any>;
    try {
      whitelistArr = await this.jsonDB.getData("/whitelist");
    } catch(error) {
      this.jsonDB.push("/whitelist", []);
      return false;
    }
    const whitelistEntry = whitelistArr.find((element) => 
      ((element.id === body.id) && (element.name === body.name)));
    if (whitelistEntry) {
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_1);
        const signer = wallet.connect(this.provider);
        const signedContract = this.myTokenContract.connect(signer);

        const amount: ethers.BigNumber = ethers.utils.parseEther(
          process.env.TOKEN_DEFAULT_AMOUNT
        );

        const tx = await signedContract.mint(
          body.address,
          amount
        );
        const receipt = await tx.wait();
        const etherscan = "https://goerli.etherscan.io/tx/" + receipt.transactionHash;
        return { etherscan };
    } else {
      return false;
    }
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
