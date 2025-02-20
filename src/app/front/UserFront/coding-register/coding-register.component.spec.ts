import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodingRegisterComponent } from './coding-register.component';

describe('CodingRegisterComponent', () => {
  let component: CodingRegisterComponent;
  let fixture: ComponentFixture<CodingRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodingRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodingRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
