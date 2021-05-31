import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverJobComponent } from './cover-job.component';

describe('CoverJobComponent', () => {
  let component: CoverJobComponent;
  let fixture: ComponentFixture<CoverJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
