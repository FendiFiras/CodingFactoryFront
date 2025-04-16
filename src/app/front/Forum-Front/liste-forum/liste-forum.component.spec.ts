import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeForumComponent } from './liste-forum.component';

describe('ListeForumComponent', () => {
  let component: ListeForumComponent;
  let fixture: ComponentFixture<ListeForumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeForumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
