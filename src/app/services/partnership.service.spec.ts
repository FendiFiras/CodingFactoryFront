import { TestBed } from '@angular/core/testing';

import { PartnershipService } from './partnership.service';

describe('PartnershipService', () => {
  let service: PartnershipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartnershipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
