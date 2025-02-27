import { Component } from '@angular/core';
import { NavbarComponent } from "../../elements/navbar/navbar.component";
import { FooterComponent } from "../../elements/footer/footer.component";
import { NotifPfeComponent } from '../notif-pfe/notif-pfe.component';
import { OfferService } from 'src/app/service/offer.service';
import { NotificationPfeService } from 'src/app/service/notification-pfe.service';
import { Offer } from 'src/app/models/Offer';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-manage-offers',
  imports: [NavbarComponent, FooterComponent,CommonModule,ReactiveFormsModule,FormsModule ,RouterModule],
  templateUrl: './manage-offers.component.html',
  styleUrl: './manage-offers.component.scss'
})
export class ManageOffersComponent {
  offers: Offer[] = [];
  isUpdating: boolean = false;
  selectedOffer: Offer | null = null;
  tunisianGovernorates = [ // List of Tunisian governorates
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili',
    'Kef', 'Mahdia', 'Manouba', 'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse',
    'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];
  constructor(
    private offerService: OfferService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.offerService.getOffersByCompanyRepresentative(4).subscribe( // Replace 1 with the actual user ID
      (data: Offer[]) => {
        this.offers = data;
      },
      (error) => {
        console.error('Error fetching offers:', error);
      }
    );
  }

  deleteOffer(offerId: number): void {
    if (confirm('Are you sure you want to delete this offer?')) {
      this.offerService.deleteOffer(offerId).subscribe(
        () => {
          this.offers = this.offers.filter(offer => offer.idOffer !== offerId);
          alert('Offer deleted successfully!');
        },
        (error) => {
          console.error('Error deleting offer:', error);
        }
      );
    }
  }

  toggleUpdateForm(offer: Offer): void {
    if (this.isUpdating && this.selectedOffer?.idOffer === offer.idOffer) {
      // If the same offer is clicked again, cancel the update
      this.isUpdating = false;
      this.selectedOffer = null;
    } else {
      // Open the update form for the selected offer
      this.isUpdating = true;
      this.selectedOffer = { ...offer }; // Create a copy of the offer to avoid mutating the original
    }
  }
  navigateToApplications(offerId: number): void {
    this.router.navigate(['/applicationsforCR', offerId]);
  }
  viewAssignments(offerId: number): void {
    this.router.navigate(['/assignments', offerId]); // Navigate to Assignments List Component with offerId
  }

  onUpdate(): void {
    if (this.selectedOffer) {
      const id = this.selectedOffer.idOffer;
      const updatedOffer = {
        title: this.selectedOffer.title,
        duration: this.selectedOffer.duration,
        // Add other fields as needed
      };

      this.offerService.updateOffer(id, updatedOffer).subscribe(
        () => {
          alert('Offer updated successfully!');
          this.isUpdating = false;
          this.selectedOffer = null;
          this.loadOffers(); // Reload offers to reflect changes
        },
        (error) => {
          console.error('Error updating offer:', error);
        }
      );
    }
  }
}