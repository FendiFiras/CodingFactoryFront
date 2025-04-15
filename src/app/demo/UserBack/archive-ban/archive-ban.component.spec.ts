import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveBanComponent } from './archive-ban.component';

describe('ArchiveBanComponent', () => {
  let component: ArchiveBanComponent;
  let fixture: ComponentFixture<ArchiveBanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchiveBanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiveBanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
