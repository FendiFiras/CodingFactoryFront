import { Component, OnInit } from '@angular/core';
import { Offer } from 'src/app/models/Offer';
import { OfferService } from 'src/app/service/offer.service';
import { NavbarComponent } from "../../elements/navbar/navbar.component";
import { FooterComponent } from "../../elements/footer/footer.component";
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router } from '@angular/router';


@Component({
  selector: 'app-student-offers',
  templateUrl: './student-offers.component.html',
  styleUrls: ['./student-offers.component.scss'],
  imports: [NavbarComponent, FooterComponent,SharedModule],
})
export class StudentOffersComponent implements OnInit {
  offers: Offer[] = [];
  selectedOffer: Offer | null = null; // Store the selected offer

  constructor(private offerService: OfferService,
    private router: Router // Inject Router

  ) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.offerService.getOffers().subscribe({
      next: (data) => {
        this.offers = data;
        // Set the first offer as selected by default
        if (this.offers.length > 0) {
          this.selectedOffer = this.offers[0];
        }
      },
      error: (err) => {
        console.error('Error fetching offers:', err);
      },
    });
  }

  // Method to handle offer selection
  onSelectOffer(offer: Offer): void {
    this.selectedOffer = offer;
  }
  onApply(offerId: number): void {
    this.router.navigate(['/apply', offerId]);
  }
}