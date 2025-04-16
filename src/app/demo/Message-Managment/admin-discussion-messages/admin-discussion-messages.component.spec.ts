import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDiscussionMessagesComponent } from './admin-discussion-messages.component';

describe('AdminDiscussionMessagesComponent', () => {
  let component: AdminDiscussionMessagesComponent;
  let fixture: ComponentFixture<AdminDiscussionMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDiscussionMessagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDiscussionMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
