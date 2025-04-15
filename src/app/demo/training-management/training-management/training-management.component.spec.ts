import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingManagementComponent } from './training-management.component';

describe('TrainingManagementComponent', () => {
  let component: TrainingManagementComponent;
  let fixture: ComponentFixture<TrainingManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
