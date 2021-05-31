import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCompanyuserComponent } from './detail-companyuser.component';

describe('DetailCompanyuserComponent', () => {
  let component: DetailCompanyuserComponent;
  let fixture: ComponentFixture<DetailCompanyuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailCompanyuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCompanyuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
