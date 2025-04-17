import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamationAddComponent } from './reclamation-add.component';

describe('ReclamationAddComponent', () => {
  let component: ReclamationAddComponent;
  let fixture: ComponentFixture<ReclamationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReclamationAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReclamationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
