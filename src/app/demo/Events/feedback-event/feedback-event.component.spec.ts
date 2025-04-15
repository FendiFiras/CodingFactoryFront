import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackEventComponent } from './feedback-event.component';

describe('FeedbackEventComponent', () => {
  let component: FeedbackEventComponent;
  let fixture: ComponentFixture<FeedbackEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
