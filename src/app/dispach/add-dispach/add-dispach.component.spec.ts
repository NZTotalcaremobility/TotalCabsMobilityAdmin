import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDispachComponent } from './add-dispach.component';

describe('AddDispachComponent', () => {
  let component: AddDispachComponent;
  let fixture: ComponentFixture<AddDispachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDispachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDispachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
