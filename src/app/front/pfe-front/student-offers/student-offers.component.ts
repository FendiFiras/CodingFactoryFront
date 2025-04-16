import { Component, OnInit } from '@angular/core';
import { Offer } from 'src/app/models/Offer';
import { OfferService } from 'src/app/services/offer.service';
import { NavbarComponent } from "../../elements/navbar/navbar.component";
import { FooterComponent } from "../../elements/footer/footer.component";
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-student-offers',
  templateUrl: './student-offers.component.html',
  styleUrls: ['./student-offers.component.scss'],
  imports: [NavbarComponent, FooterComponent,CommonModule,FormsModule],
})
export class StudentOffersComponent implements OnInit {
  tunisianGovernorates: string[] = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili',
    'Kef', 'Mahdia', 'Manouba', 'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse',
    'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];
  
  filters = {
    employmentType: '',
    location: '',
    title: ''
  };
  offers: Offer[] = []; // Offers after filtering
  allOffers: Offer[] = []; // Full list of offers for filtering
  selectedOffer: Offer | null = null;


  constructor(private offerService: OfferService,
    private router: Router // Inject Router

  ) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.offerService.getOffers().subscribe({
      next: (data) => {
        this.allOffers = data;
        this.offers = [...this.allOffers];
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
  applyFilters(): void {
    this.offers = this.allOffers.filter(offer => {
      const matchEmployment =
        !this.filters.employmentType || offer.employmentType?.toLowerCase() === this.filters.employmentType.toLowerCase();
      const matchLocation =
        !this.filters.location || offer.duration?.toLowerCase().includes(this.filters.location.toLowerCase()); // Assuming location is in 'duration'
      const matchTitle =
        !this.filters.title || offer.title?.toLowerCase().includes(this.filters.title.toLowerCase());

      return matchEmployment && matchLocation && matchTitle;
    });

    // Optional: Reset selection if current selected offer is filtered out
    if (!this.offers.includes(this.selectedOffer!)) {
      this.selectedOffer = this.offers[0] || null;
    }
  }

  onSelectOffer(offer: Offer): void {
    this.selectedOffer = offer;
  }

  onApply(offerId: number): void {
    this.router.navigate(['/apply', offerId]);
  }
}