import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomepartnerComponent } from './becomepartner.component';

describe('BecomepartnerComponent', () => {
  let component: BecomepartnerComponent;
  let fixture: ComponentFixture<BecomepartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomepartnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BecomepartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
