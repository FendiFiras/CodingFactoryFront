import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPasswdComponent } from './forget-passwd.component';

describe('ForgetPasswdComponent', () => {
  let component: ForgetPasswdComponent;
  let fixture: ComponentFixture<ForgetPasswdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgetPasswdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgetPasswdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
