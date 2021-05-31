import { TestBed } from '@angular/core/testing';

import { DispachService } from './dispach.service';

describe('DispachService', () => {
  let service: DispachService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DispachService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
