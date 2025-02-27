import { TestBed } from '@angular/core/testing';

import { NotificationPfeService } from './notification-pfe.service';

describe('NotificationPfeService', () => {
  let service: NotificationPfeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationPfeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
