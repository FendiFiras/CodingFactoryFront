import { TestBed } from '@angular/core/testing';

import { userFService } from './userF.service';

describe('UserService', () => {
  let service: userFService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(userFService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
