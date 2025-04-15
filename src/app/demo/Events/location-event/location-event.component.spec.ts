import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationEventComponent } from './location-event.component';

describe('LocationEventComponent', () => {
  let component: LocationEventComponent;
  let fixture: ComponentFixture<LocationEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
