import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCompanyuserComponent } from './list-companyuser.component';

describe('ListCompanyuserComponent', () => {
  let component: ListCompanyuserComponent;
  let fixture: ComponentFixture<ListCompanyuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCompanyuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCompanyuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
