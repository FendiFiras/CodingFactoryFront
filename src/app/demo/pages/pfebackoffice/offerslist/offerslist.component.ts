import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OfferService } from 'src/app/service/offer.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-offerlist',
  imports: [CommonModule, SharedModule, RouterModule, MatDialogModule],
  templateUrl: './offerslist.component.html',
  styleUrl: './offerslist.component.scss',
  providers: [OfferService]
})
export class OfferlistComponent implements OnInit {
  @ViewChild('detailsDialog') detailsDialog!: TemplateRef<any>;
  @ViewChild('updateDialog') updateDialog!: TemplateRef<any>;
  @ViewChild('deleteDialog') deleteDialog!: TemplateRef<any>;
  offers: any[] = [];

  selectedOffer: any | null = null; // Initialize as null
  updateForm: FormGroup;

  constructor(
    private offerService: OfferService,
    private dialog: MatDialog,
    private fb: FormBuilder // Inject FormBuilder
  ) {
    this.updateForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      requiredSkill: ['', Validators.required],
      duration: ['', Validators.required],
      employmentType: ['', Validators.required],
      jobResponsibilities: ['', Validators.required],
      whatWeOffer: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    console.log('Fetching offers...');
    this.offerService.getOffers().subscribe({
      next: (datas) => {
        console.log('Fetched data:', datas);
        this.offers = Array.isArray(datas) ? datas : []; // ✅ Ensure it's an array
      },
      error: (err) => {
        console.error('Error fetching offers:', err);
      },
    });
  }

  onDetails(offer: any): void {
    this.selectedOffer = offer;
    this.dialog.open(this.detailsDialog);
  }

  closeDetailsDialog(): void {
    this.dialog.closeAll();
  }

  onUpdate(offer: any): void {
    this.selectedOffer = offer; // Store the selected offer
    this.updateForm.patchValue(offer); // Populate the form with offer data
    this.dialog.open(this.updateDialog); // Open the update dialog
  }

  onSave(): void {
    if (this.updateForm.valid && this.selectedOffer) {
      const updatedOffer = { ...this.selectedOffer, ...this.updateForm.value };
      this.offerService.updateOffer(this.selectedOffer.idOffer, updatedOffer).subscribe(
        (response) => {
          console.log('Offer updated successfully', response);
          this.loadOffers(); // Reload the list
          this.dialog.closeAll(); // Close the dialog
        },
        (error) => {
          console.error('Failed to update offer', error);
        }
      );
    }
  }

  closeUpdateDialog(): void {
    this.dialog.closeAll();
  }

  onDelete(offer: any): void {
    this.selectedOffer = offer;
    this.dialog.open(this.deleteDialog);
  }

  onDeleteConfirm(): void {
    if (this.selectedOffer) {
      this.offerService.deleteOffer(this.selectedOffer.idOffer).subscribe(
        () => {
          console.log('Offer deleted successfully');
          this.loadOffers(); // Reload the list
          this.dialog.closeAll(); // Close the dialog
        },
        (error) => {
          console.error('Failed to delete offer', error);
        }
      );
    }
  }

  closeDeleteDialog(): void {
    this.dialog.closeAll();
  }
}