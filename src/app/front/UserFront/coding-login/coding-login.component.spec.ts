import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodingLoginComponent } from './coding-login.component';

describe('CodingLoginComponent', () => {
  let component: CodingLoginComponent;
  let fixture: ComponentFixture<CodingLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodingLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodingLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
