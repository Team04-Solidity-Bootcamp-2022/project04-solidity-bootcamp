import { Injectable } from '@nestjs/common';
import { VotingTokenDto } from './dtos/VotingTokenDto';
import { ethers, Contract } from 'ethers';
import { ContractReaderDto } from './dtos/ContractReader.dto';

import * as MyTokenJson from './assets/MyToken.json';
import * as TokenizedBallotJson from './assets/TokenizedBallot.json';

@Injectable()
export class AppService {
  MYTOKEN_CONTRACT_ADDRESS: string;
  TOKENIZEDBALLOT_CONTRACT_ADDRESS: string;
  provider: ethers.providers.Provider;
  myTokenContract: Contract;
  tokenizedBallotContract: Contract;

  constructor() {
    this.MYTOKEN_CONTRACT_ADDRESS = process.env.MYTOKEN_CONTRACT_ADDRESS;
    this.TOKENIZEDBALLOT_CONTRACT_ADDRESS =
      process.env.TOKENIZEDBALLOT_CONTRACT_ADDRESS;

    this.provider = ethers.getDefaultProvider('goerli');
    this.myTokenContract = new ethers.Contract(
      this.MYTOKEN_CONTRACT_ADDRESS,
      MyTokenJson.abi,
      this.provider,
    );
    this.tokenizedBallotContract = new ethers.Contract(
      this.TOKENIZEDBALLOT_CONTRACT_ADDRESS,
      TokenizedBallotJson.abi,
      this.provider,
    );
  }

  votingToken(body: VotingTokenDto): string {
    throw new Error('Method not implemented.');
  }

  castVotes(body: CastVotesDto): string {
    throw new Error('Method not implemented.');
  }

  delegate(body: DelegateDto): string {
    throw new Error('Method not implemented.');
  }

  queryResults(): string {
    throw new Error('Method not implemented.');
  }

  recentVotes(): string {
    throw new Error('Method not implemented.');
  }

  getContractAddress(): string {
    return 'potatoAddr';
  }

  claimTokens(body: VotingTokenDto) {
    return true;
  }

  getHello(): string {
    return 'Hello World!';
  }

  /**
   * Generic function to read contract contents
   *
   * @param {ContractReaderDto} ContractReaderDto body
   * @returns {Object} results
   */
  async readContract(body: ContractReaderDto) {
    let result = null;
    const cmd = body.cmd;

    if (!body.args) {
      result = await this.myTokenContract[cmd]();
    } else {
      result = await this.myTokenContract[cmd](...body.args);
    }

    if (['totalSupply', 'balanceOf'].includes(cmd))
      result = ethers.utils.formatEther(result);
    return {
      data: result,
    };
  }
}
