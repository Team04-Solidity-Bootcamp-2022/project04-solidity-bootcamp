import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-cast-votes',
  templateUrl: './cast-votes.component.html',
  styleUrls: ['./cast-votes.component.scss']
})
export class CastVotesComponent implements OnInit {
  castVotesForm: FormGroup;

  constructor() {
    this.castVotesForm = new FormGroup({
      proposal: new FormControl('', Validators.compose([Validators.required])),
      votes: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  ngOnInit(): void {
  }

  castVotes(params: FormGroup) {
    console.log(params.value);
  }
}
