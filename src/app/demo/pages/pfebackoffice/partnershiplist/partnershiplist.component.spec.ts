import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnershiplistComponent } from './partnershiplist.component';

describe('PartnershiplistComponent', () => {
  let component: PartnershiplistComponent;
  let fixture: ComponentFixture<PartnershiplistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnershiplistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnershiplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
