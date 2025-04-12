import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexDarkComponent } from './index-dark.component';

describe('IndexDarkComponent', () => {
  let component: IndexDarkComponent;
  let fixture: ComponentFixture<IndexDarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexDarkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexDarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
