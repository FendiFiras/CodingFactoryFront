import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AplicationforCRComponent } from './aplicationfor-cr.component';

describe('AplicationforCRComponent', () => {
  let component: AplicationforCRComponent;
  let fixture: ComponentFixture<AplicationforCRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AplicationforCRComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AplicationforCRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
