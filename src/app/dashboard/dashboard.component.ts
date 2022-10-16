import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  walletAddress : string;

  constructor() {
    this.walletAddress = "Loading..."
  }

  ngOnInit(): void {
    const newWallet = ethers.Wallet.createRandom();
    this.walletAddress = newWallet.address;
  }

}