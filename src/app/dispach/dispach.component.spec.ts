import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispachComponent } from './dispach.component';

describe('DispachComponent', () => {
  let component: DispachComponent;
  let fixture: ComponentFixture<DispachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
