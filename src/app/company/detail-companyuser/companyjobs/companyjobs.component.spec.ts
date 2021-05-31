import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyjobsComponent } from './companyjobs.component';

describe('CompanyjobsComponent', () => {
  let component: CompanyjobsComponent;
  let fixture: ComponentFixture<CompanyjobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyjobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyjobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
