import { TestBed } from '@angular/core/testing';

import { AiGeneratorService } from './ai-generator.service';

describe('AiGeneratorService', () => {
  let service: AiGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
