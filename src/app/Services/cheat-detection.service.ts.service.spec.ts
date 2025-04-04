import { TestBed } from '@angular/core/testing';

import { CheatDetectionServiceTsService } from './cheat-detection.service.ts.service';

describe('CheatDetectionServiceTsService', () => {
  let service: CheatDetectionServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheatDetectionServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
