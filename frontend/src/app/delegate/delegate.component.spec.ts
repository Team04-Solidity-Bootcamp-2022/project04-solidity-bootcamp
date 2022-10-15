import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegateComponent } from './delegate.component';

describe('DelegateComponent', () => {
  let component: DelegateComponent;
  let fixture: ComponentFixture<DelegateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelegateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
