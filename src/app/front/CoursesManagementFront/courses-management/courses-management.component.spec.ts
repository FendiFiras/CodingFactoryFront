import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesManagementComponent } from './courses-management.component';

describe('CoursesManagementComponent', () => {
  let component: CoursesManagementComponent;
  let fixture: ComponentFixture<CoursesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
