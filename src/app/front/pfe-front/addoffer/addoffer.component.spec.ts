import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddofferComponent } from './addoffer.component';

describe('AddofferComponent', () => {
  let component: AddofferComponent;
  let fixture: ComponentFixture<AddofferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddofferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddofferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
