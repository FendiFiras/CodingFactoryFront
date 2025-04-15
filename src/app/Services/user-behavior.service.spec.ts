import { TestBed } from '@angular/core/testing';

import { UserBehaviorService } from './user-behavior.service';

describe('UserBehaviorService', () => {
  let service: UserBehaviorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserBehaviorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
