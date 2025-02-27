import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfferlistComponent } from './offerslist.component';


describe('OfferslistComponent', () => {
  let component: OfferlistComponent;
  let fixture: ComponentFixture<OfferlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
