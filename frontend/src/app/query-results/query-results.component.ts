import { Component, OnInit } from '@angular/core';
import { ethers, Contract } from 'ethers';
import TokenizedBallot from 'src/assets/TokenizedBallot.json'

//FIXME: CHANGE address or import from env
const TOKENIZED_BALLOT_CONTRACT_ADDRESS = '0x1a6b6140e530a907dab709382078e9a7c1371351';

@Component({
  selector: 'app-query-results',
  templateUrl: './query-results.component.html',
  styleUrls: ['./query-results.component.scss'],
})
export class QueryResultsComponent implements OnInit {
  provider: ethers.providers.Provider;
  tokenizedBallotContract: Contract;
  proposalsResult: any[];

  constructor() {
    this.provider = ethers.getDefaultProvider('goerli');
    this.tokenizedBallotContract = new ethers.Contract(
      TOKENIZED_BALLOT_CONTRACT_ADDRESS,
      TokenizedBallot.abi,
      this.provider,
    );
    this.proposalsResult = [{i: '-', name:'Loading...', voteCount:'0'}];
  }

  async ngOnInit(): Promise<void> {
    await this.queryResults();
  }

  async queryResults() {
    console.log(this.provider);
    console.log(this.tokenizedBallotContract);
    const defaultProposals = ["Proposal 1", "Proposal 2", "Proposal 3"];
    var results = [];
    for (let i = 0; i < defaultProposals.length; i++) {
      const proposal = await this.tokenizedBallotContract['proposals'](i);
      const name = ethers.utils.parseBytes32String(proposal.name);
      const voteCountBN = proposal.voteCount;
      const voteCount = ethers.utils.formatEther(voteCountBN);
      results.push({i, name, voteCount});
    }
    this.proposalsResult = results;
    console.log(this.proposalsResult);
  }
}
