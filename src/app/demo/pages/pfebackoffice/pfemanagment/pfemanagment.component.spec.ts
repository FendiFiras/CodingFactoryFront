import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfemanagmentComponent } from './pfemanagment.component';

describe('PfemanagmentComponent', () => {
  let component: PfemanagmentComponent;
  let fixture: ComponentFixture<PfemanagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PfemanagmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PfemanagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
