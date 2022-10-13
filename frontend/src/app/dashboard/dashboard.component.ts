import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';

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
  tokenContractAddress: string;

  constructor(private apiService: ApiService) { 
    this.walletAddress = 'Loading...';
    this.balance = 'Loading...';
    this.tokenContractAddress = '';
  }

  ngOnInit(): void {
    this.apiService.getContractAddress().subscribe((response) => {
      this.tokenContractAddress = response.result;
    });
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

  claimTokens() {

  }
}
