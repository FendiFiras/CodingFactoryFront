import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannedUserComponent } from './banned-user.component';

describe('BannedUserComponent', () => {
  let component: BannedUserComponent;
  let fixture: ComponentFixture<BannedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannedUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
