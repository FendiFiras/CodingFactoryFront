import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSessionComponent } from './add-session.component';

describe('AddSessionComponent', () => {
  let component: AddSessionComponent;
  let fixture: ComponentFixture<AddSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
