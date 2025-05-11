import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClustringComponent } from './clustring.component';

describe('ClustringComponent', () => {
  let component: ClustringComponent;
  let fixture: ComponentFixture<ClustringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClustringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClustringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
