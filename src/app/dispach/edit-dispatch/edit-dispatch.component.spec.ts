import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDispatchComponent } from './edit-dispatch.component';

describe('EditDispatchComponent', () => {
  let component: EditDispatchComponent;
  let fixture: ComponentFixture<EditDispatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDispatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
