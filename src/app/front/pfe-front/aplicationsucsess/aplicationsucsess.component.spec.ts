import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AplicationsucsessComponent } from './aplicationsucsess.component';

describe('AplicationsucsessComponent', () => {
  let component: AplicationsucsessComponent;
  let fixture: ComponentFixture<AplicationsucsessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AplicationsucsessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AplicationsucsessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
