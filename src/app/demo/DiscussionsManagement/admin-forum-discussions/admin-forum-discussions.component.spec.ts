import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDiscussionComponent } from './admin-forum-discussions.component';

describe('adminForumDiscussionsComponent', () => {
  let component: AdminDiscussionComponent;
  let fixture: ComponentFixture<AdminDiscussionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDiscussionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
