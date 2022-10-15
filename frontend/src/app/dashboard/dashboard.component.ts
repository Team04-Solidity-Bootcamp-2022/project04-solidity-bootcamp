import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ethers } from 'ethers';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

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

  claimTokensForm: FormGroup;

  constructor(private apiService: ApiService, 
    private fb: FormBuilder) { 
    this.walletAddress = 'Loading...';
    this.balance = 'Loading...';
    this.tokenContractAddress = '';
    this.claimTokensForm = new FormGroup({
      name: new FormControl('', Validators.compose([Validators.required])),
      id: new FormControl('', Validators.compose([Validators.required])),
      address: new FormControl('', Validators.compose([Validators.required])),
      feedback: new FormControl(''),
    });
  }

  get f() { return this.claimTokensForm.controls; }

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

  claimTokens(params: FormGroup) {
    console.log(params);
    params.patchValue({feedback: "Feeback will appear here..."});
    this.apiService.claimTokens(params.value).subscribe((response) => {
      console.log(response);
      if(!response) {
        params.patchValue({feedback: "Please check the data provided and try again"});
      }
      else {
        params.patchValue({feedback: "Great success! Check tx on "+response.etherscan});
      }
    });
  }
}
