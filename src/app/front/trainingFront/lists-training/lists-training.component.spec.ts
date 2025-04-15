import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListsTrainingComponent } from './lists-training.component';

describe('ListsTrainingComponent', () => {
  let component: ListsTrainingComponent;
  let fixture: ComponentFixture<ListsTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListsTrainingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListsTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
