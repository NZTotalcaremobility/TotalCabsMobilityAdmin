import { TestBed } from '@angular/core/testing';

import { DeeplinkserviceService } from './deeplinkservice.service';

describe('DeeplinkserviceService', () => {
  let service: DeeplinkserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeeplinkserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
