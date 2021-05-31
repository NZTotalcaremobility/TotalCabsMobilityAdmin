import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditcoverComponent } from './editcover.component';

describe('EditcoverComponent', () => {
  let component: EditcoverComponent;
  let fixture: ComponentFixture<EditcoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditcoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditcoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
