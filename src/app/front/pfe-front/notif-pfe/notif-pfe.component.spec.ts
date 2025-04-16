import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifPfeComponent } from './notif-pfe.component';

describe('NotifPfeComponent', () => {
  let component: NotifPfeComponent;
  let fixture: ComponentFixture<NotifPfeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotifPfeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotifPfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
