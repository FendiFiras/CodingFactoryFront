import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebcamHeadtrackerComponent } from './webcam-headtracker.component';

describe('WebcamHeadtrackerComponent', () => {
  let component: WebcamHeadtrackerComponent;
  let fixture: ComponentFixture<WebcamHeadtrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebcamHeadtrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebcamHeadtrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
