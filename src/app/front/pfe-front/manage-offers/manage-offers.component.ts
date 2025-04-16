import { Component } from '@angular/core';
import { NavbarComponent } from "../../elements/navbar/navbar.component";
import { FooterComponent } from "../../elements/footer/footer.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select'; // If you're using dropdowns for other fields like employmentType
import { MatIconModule } from '@angular/material/icon'; // For icons like 'x' in the chips
import { NotifPfeComponent } from '../notif-pfe/notif-pfe.component';
import { OfferService } from 'src/app/service/offer.service';
import { NotificationPfeService } from 'src/app/service/notification-pfe.service';
import { Offer } from 'src/app/models/Offer';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TagInputModule } from 'ngx-chips';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-manage-offers',
  imports: [NavbarComponent, FooterComponent,CommonModule,ReactiveFormsModule,TagInputModule,MatFormFieldModule,FormsModule ,RouterModule,TagInputModule,HttpClientModule],
  templateUrl: './manage-offers.component.html',
  styleUrl: './manage-offers.component.scss'
})
export class ManageOffersComponent {
  offers: Offer[] = [];
  isUpdating: boolean = false;
  selectedOffer: Offer | null = null;
  updateOfferForm: FormGroup;
  
  tunisianGovernorates = [ // List of Tunisian governorates
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili',
    'Kef', 'Mahdia', 'Manouba', 'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse',
    'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];
  constructor(
        private fb: FormBuilder,
    
    private offerService: OfferService,
    private router: Router
  ) { 
    this.updateOfferForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(100),
          Validators.pattern(/^(?=(.*[A-Za-z]){10,})(?=(.*[^A-Za-z0-9\s]){0,4})[A-Za-z0-9\s!@#$%^&*()_+={}[\]:;"'<>,.?/-]*$/)
        ]
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(500),
          Validators.pattern(/^(?=(.*[A-Za-z]){10,})(?=(.*[^A-Za-z0-9\s]){0,4})[A-Za-z0-9\s!@#$%^&*()_+={}[\]:;"'<>,.?/-]*$/)
        ]
      ],
      requiredSkill: [
        [],
        [Validators.required]
      ],  // Changed to FormArray

      appnmbr: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern('^[0-9]+$') // Only numbers allowed
        ]
      ],
      location: [
        '',
        [Validators.required]
      ],
      duration: [
        '',
        [Validators.required]
      ],
      employmentType: [
        '',
        [Validators.required]
      ],
      jobResponsibilities: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(500),
          Validators.pattern(/^(?=(.*[A-Za-z]){10,})(?=(.*[^A-Za-z0-9\s]){0,4})[A-Za-z0-9\s!@#$%^&*()_+={}[\]:;"'<>,.?/-]*$/)
        ]
      ],
      whatWeOffer: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(500),
          Validators.pattern(/^(?=(.*[A-Za-z]){10,})(?=(.*[^A-Za-z0-9\s]){0,4})[A-Za-z0-9\s!@#$%^&*()_+={}[\]:;"'<>,.?/-]*$/)
        ]
      ]
    });
  }

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.offerService.getOffersByCompanyRepresentative(1).subscribe( // //////////////////////////////////////////////////
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
      this.isUpdating = false;
      this.selectedOffer = null;
    } else {
      this.isUpdating = true;
      this.selectedOffer = { ...offer };
    
      // Patch form with selected offer's values
      this.updateOfferForm.patchValue({
        title: offer.title,
        description: offer.description,
        requiredSkill: offer.requiredSkill || [], // If no skills are available, pass an empty array

        location: offer.location,
        duration: offer.duration,
        employmentType: offer.employmentType,
        jobResponsibilities: offer.jobResponsibilities,
        whatWeOffer: offer.whatWeOffer,
        appnmbr: offer.appnmbr
      });
  
      // Ensure that the requiredSkill FormArray is populated
    const requiredSkillArray = this.updateOfferForm.get('requiredSkill') as FormArray;
    requiredSkillArray.clear(); // Clear the existing array

    // Add the current skills to the FormArray
    if (offer.requiredSkill && Array.isArray(offer.requiredSkill)) {
      offer.requiredSkill.forEach(skill => {
        requiredSkillArray.push(this.fb.control(skill));
      });
    }}
  }
  
  
  navigateToApplications(offerId: number): void {
    this.router.navigate(['/applicationsforCR', offerId]);
  }
  viewAssignments(offerId: number): void {
    this.router.navigate(['/assignments', offerId]); // Navigate to Assignments List Component with offerId
  }

  onUpdate(): void {
    if (this.selectedOffer && this.updateOfferForm.valid) {
      const id = this.selectedOffer.idOffer;
      
      // Updated offer with all fields
      const updatedOffer = {
        title: this.updateOfferForm.value.title,
        description: this.updateOfferForm.value.description,
        requiredSkill: this.updateOfferForm.value.requiredSkill,
        location: this.updateOfferForm.value.location,
        duration: this.updateOfferForm.value.duration,
        employmentType: this.updateOfferForm.value.employmentType,
        jobResponsibilities: this.updateOfferForm.value.jobResponsibilities,
        whatWeOffer: this.updateOfferForm.value.whatWeOffer,
        appnmbr: this.updateOfferForm.value.appnmbr
      };
  
      // Call the service to update the offer
      this.offerService.updateOffer(id, updatedOffer).subscribe(
        () => {
          alert('Offer updated successfully!');
          this.isUpdating = false;
          this.selectedOffer = null;
          this.updateOfferForm.reset(); // Reset form after submission
          this.loadOffers(); // Reload offers to reflect changes
        },
        (error) => {
          console.error('Error updating offer:', error);
          alert('Failed to update the offer. Please try again.');
        }
      );
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
  onTagAdd(event: any): void {
    const requiredSkillArray = this.updateOfferForm.get('requiredSkill') as FormArray;
    requiredSkillArray.push(this.fb.control(event.value));  // Add the new skill as a FormControl
  }
  
  onTagRemove(event: any): void {
    const requiredSkillArray = this.updateOfferForm.get('requiredSkill') as FormArray;
    const index = requiredSkillArray.controls.findIndex(ctrl => ctrl.value === event.value);
    if (index !== -1) {
      requiredSkillArray.removeAt(index);  // Remove the skill from the FormArray
    }
  }
  
}