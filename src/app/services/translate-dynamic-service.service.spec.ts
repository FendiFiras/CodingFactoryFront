import { TestBed } from '@angular/core/testing';

import { TranslateDynamicServiceService } from './translate-dynamic-service.service';

describe('TranslateDynamicServiceService', () => {
  let service: TranslateDynamicServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslateDynamicServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
