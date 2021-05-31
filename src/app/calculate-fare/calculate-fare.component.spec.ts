import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateFareComponent } from './calculate-fare.component';

describe('CalculateFareComponent', () => {
  let component: CalculateFareComponent;
  let fixture: ComponentFixture<CalculateFareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculateFareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculateFareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
