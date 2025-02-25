import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningEventComponent } from './planning-event.component';

describe('PlanningEventComponent', () => {
  let component: PlanningEventComponent;
  let fixture: ComponentFixture<PlanningEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
