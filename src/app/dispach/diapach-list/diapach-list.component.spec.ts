import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiapachListComponent } from './diapach-list.component';

describe('DiapachListComponent', () => {
  let component: DiapachListComponent;
  let fixture: ComponentFixture<DiapachListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiapachListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiapachListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
