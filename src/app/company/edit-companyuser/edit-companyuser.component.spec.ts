import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompanyuserComponent } from './edit-companyuser.component';

describe('EditCompanyuserComponent', () => {
  let component: EditCompanyuserComponent;
  let fixture: ComponentFixture<EditCompanyuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCompanyuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCompanyuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
