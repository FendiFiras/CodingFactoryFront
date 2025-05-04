import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredectionComponent } from './predection.component';

describe('PredectionComponent', () => {
  let component: PredectionComponent;
  let fixture: ComponentFixture<PredectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PredectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
