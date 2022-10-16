import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import MyToken from 'src/assets/MyToken.json'
import { ethers, Contract } from 'ethers';

//FIXME: CHANGE address or import from env
const MYTOKEN_CONTRACT_ADDRESS = '0xeb0170d478b723af8aed0abe4413e49b15428673';

@Component({
  selector: 'app-delegate',
  templateUrl: './delegate.component.html',
  styleUrls: ['./delegate.component.scss']
})
export class DelegateComponent implements OnInit {
  wallet: ethers.Wallet | undefined;
  provider: ethers.providers.BaseProvider | undefined;
  myTokenContract: Contract;
  delegateForm: FormGroup;
  
  constructor() { 
    this.delegateForm = new FormGroup({
      delegatee: new FormControl('', Validators.compose([Validators.required])),
    });

    this.provider = ethers.getDefaultProvider('goerli');
    const pkLS = localStorage.getItem('privateKey');
    this.wallet = ethers.Wallet.createRandom();
    if(pkLS != null) {
      this.wallet = new ethers.Wallet(pkLS, this.provider);
    }
    this.myTokenContract = new ethers.Contract(
      MYTOKEN_CONTRACT_ADDRESS,
      MyToken.abi,
      this.wallet,
    );
  }

  ngOnInit(): void {
  }

  async delegateToAddress(params: FormGroup) {
    console.log(params.value);
    const delegatee = params.value.delegatee;
    
    const delegateTx = await this.myTokenContract['delegate'](delegatee);
    const delegateReceipt = await delegateTx.wait();
    console.log(delegateReceipt);
  }

}
