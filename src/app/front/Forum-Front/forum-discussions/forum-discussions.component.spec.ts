import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumDiscussionsComponent } from './forum-discussions.component';

describe('ForumDiscussionsComponent', () => {
  let component: ForumDiscussionsComponent;
  let fixture: ComponentFixture<ForumDiscussionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForumDiscussionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForumDiscussionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
