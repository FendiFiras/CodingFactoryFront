import { TestBed } from '@angular/core/testing';

import { AiScoreService } from './ai-score.service';

describe('AiScoreService', () => {
  let service: AiScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
