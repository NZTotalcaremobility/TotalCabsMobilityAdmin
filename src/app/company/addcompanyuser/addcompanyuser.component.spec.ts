import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcompanyuserComponent } from './addcompanyuser.component';

describe('AddcompanyuserComponent', () => {
  let component: AddcompanyuserComponent;
  let fixture: ComponentFixture<AddcompanyuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcompanyuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcompanyuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
