import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumsManagementComponent } from './forums-management.component';

describe('ForumsManagementComponent', () => {
  let component: ForumsManagementComponent;
  let fixture: ComponentFixture<ForumsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForumsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForumsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
