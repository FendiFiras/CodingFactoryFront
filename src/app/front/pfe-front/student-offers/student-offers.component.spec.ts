import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentOffersComponent } from './student-offers.component';

describe('StudentOffersComponent', () => {
  let component: StudentOffersComponent;
  let fixture: ComponentFixture<StudentOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentOffersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
