import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  wallet : ethers.Wallet | undefined;
  provider : ethers.providers.BaseProvider | undefined;
  walletAddress : string;
  balance : string;

  constructor() {
    this.walletAddress = "Loading..."
    this.balance = "Loading..."
  }

  readBalance () {
    if(this.provider?._isProvider) { // check if the provider is initialised and not undefined
      this.provider.getBalance(this.walletAddress).then(
        bal => { this.balance = ethers.utils.formatEther(bal); } 
      );
    }
  }

  ngOnInit(): void {
    this.provider = ethers.getDefaultProvider("goerli");
    this.wallet = ethers.Wallet.createRandom();
    this.walletAddress = this.wallet.address;
    this.readBalance();
    // and now setting up an automatic update
    setInterval (() => {
      this.readBalance();
    }, 5000);
  }

}