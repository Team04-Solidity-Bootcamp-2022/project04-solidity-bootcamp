import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ethers } from 'ethers';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) { 
      this.loginForm = new FormGroup({
        private: new FormControl('', Validators.compose([Validators.required])),
      });
  }

  ngOnInit(): void {
  }

  login(params: FormGroup) {
    localStorage.setItem('privateKey', params.value.private);
    this.router.navigate(['dashboard']);
  }

}
