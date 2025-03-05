import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSuccessComponentComponent } from './payment-success-component.component';

describe('PaymentSuccessComponentComponent', () => {
  let component: PaymentSuccessComponentComponent;
  let fixture: ComponentFixture<PaymentSuccessComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentSuccessComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentSuccessComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
