import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AplicationforStudentsComponent } from './aplicationfor-students.component';

describe('AplicationforStudentsComponent', () => {
  let component: AplicationforStudentsComponent;
  let fixture: ComponentFixture<AplicationforStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AplicationforStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AplicationforStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
