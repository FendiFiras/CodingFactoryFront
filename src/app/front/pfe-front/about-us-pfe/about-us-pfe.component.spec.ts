import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsPfeComponent } from './about-us-pfe.component';

describe('AboutUsPfeComponent', () => {
  let component: AboutUsPfeComponent;
  let fixture: ComponentFixture<AboutUsPfeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutUsPfeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutUsPfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
