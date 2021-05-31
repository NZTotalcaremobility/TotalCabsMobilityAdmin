import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesAndPermissionComponent } from './roles-and-permission.component';

describe('RolesAndPermissionComponent', () => {
  let component: RolesAndPermissionComponent;
  let fixture: ComponentFixture<RolesAndPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolesAndPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesAndPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
