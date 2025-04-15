import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizQuestionsManagementComponent } from './quiz-questions-management.component';

describe('QuizQuestionsManagementComponent', () => {
  let component: QuizQuestionsManagementComponent;
  let fixture: ComponentFixture<QuizQuestionsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizQuestionsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizQuestionsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
