import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-delegate',
  templateUrl: './delegate.component.html',
  styleUrls: ['./delegate.component.scss']
})
export class DelegateComponent implements OnInit {
  delegateForm: FormGroup;
  
  constructor() { 
    this.delegateForm = new FormGroup({
      delegatee: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  ngOnInit(): void {
  }

  delegateToAddress(params: FormGroup) {

  }

}
