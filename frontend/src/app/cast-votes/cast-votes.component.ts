import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Contract, ethers, BigNumber } from 'ethers';
import TokenizedBallot from 'src/assets/TokenizedBallot.json'

//FIXME: CHANGE address or import from env
const TOKENIZED_BALLOT_CONTRACT_ADDRESS = '0x1a6b6140e530a907dab709382078e9a7c1371351';

@Component({
  selector: 'app-cast-votes',
  templateUrl: './cast-votes.component.html',
  styleUrls: ['./cast-votes.component.scss']
})
export class CastVotesComponent implements OnInit {
  wallet: ethers.Wallet | undefined;
  provider: ethers.providers.BaseProvider | undefined;
  tokenizedBallotContract: Contract;

  castVotesForm: FormGroup;

  constructor() {
    this.castVotesForm = new FormGroup({
      proposal: new FormControl('', Validators.compose([Validators.required])),
      votes: new FormControl('', Validators.compose([Validators.required])),
    });
    this.provider = ethers.getDefaultProvider('goerli');
    const pkLS = localStorage.getItem('privateKey');
    this.wallet = ethers.Wallet.createRandom();
    if(pkLS != null) {
      this.wallet = new ethers.Wallet(pkLS, this.provider);
    }
    this.tokenizedBallotContract = new ethers.Contract(
      TOKENIZED_BALLOT_CONTRACT_ADDRESS,
      TokenizedBallot.abi,
      this.wallet,
    );
  }

  ngOnInit(): void {
  }

  async castVotes(params: FormGroup) {
    console.log(params.value);
    const proposalIndex: BigNumber = BigNumber.from(params.value.proposal);
    const votesInEther = params.value.votes;
    const votes = ethers.utils.parseEther(votesInEther);
    
    const castVotesTx = await this.tokenizedBallotContract['vote'](proposalIndex, votes);
    const castVotesReceipt = await castVotesTx.wait();
    console.log(castVotesReceipt);
  }
}
