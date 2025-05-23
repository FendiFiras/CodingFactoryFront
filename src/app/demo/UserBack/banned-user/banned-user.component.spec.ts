import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannedUsersComponent } from './banned-user.component';

describe('BannedUserComponent', () => {
  let component: BannedUsersComponent;
  let fixture: ComponentFixture<BannedUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannedUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
