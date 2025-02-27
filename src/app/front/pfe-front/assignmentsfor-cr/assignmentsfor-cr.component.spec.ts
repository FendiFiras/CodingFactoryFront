import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentsforCRComponent } from './assignmentsfor-cr.component';

describe('AssignmentsforCRComponent', () => {
  let component: AssignmentsforCRComponent;
  let fixture: ComponentFixture<AssignmentsforCRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentsforCRComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentsforCRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
