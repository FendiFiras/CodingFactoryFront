import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesStudentComponent } from './courses-student.component';

describe('CoursesStudentComponent', () => {
  let component: CoursesStudentComponent;
  let fixture: ComponentFixture<CoursesStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
