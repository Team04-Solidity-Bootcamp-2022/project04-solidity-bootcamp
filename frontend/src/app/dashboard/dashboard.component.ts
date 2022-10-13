import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  walletAddress: string;
  wallet: ethers.Wallet | undefined;
  provider: ethers.providers.BaseProvider | undefined;
  balance: string;

  constructor() { 
    this.walletAddress = 'Loading...'
    this.balance = 'Loading...'
  }

  ngOnInit(): void {
    this.provider = ethers.getDefaultProvider('goerli');
    const newWallet = ethers.Wallet.createRandom();
    this.walletAddress = newWallet.address;
    this.provider.getBalance(this.walletAddress).then((balanceBN) => {
      this.balance = ethers.utils.formatEther(balanceBN);
    },
    (error) => {
      console.log(error);
    });
  }
}
