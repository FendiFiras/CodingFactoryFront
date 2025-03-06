import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatTrainingComponent } from './stat-training.component';

describe('StatTrainingComponent', () => {
  let component: StatTrainingComponent;
  let fixture: ComponentFixture<StatTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatTrainingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
