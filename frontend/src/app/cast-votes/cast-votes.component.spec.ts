import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CastVotesComponent } from './cast-votes.component';

describe('CastVotesComponent', () => {
  let component: CastVotesComponent;
  let fixture: ComponentFixture<CastVotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CastVotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CastVotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
