import { TestBed } from '@angular/core/testing';

import { BanLogService } from './banlog.service';

describe('BanlogService', () => {
  let service: BanLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BanLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
