import { TestBed } from '@angular/core/testing';

import { QuizQuestionService } from './quiz-question.service';

describe('QuizQuestionService', () => {
  let service: QuizQuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizQuestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
