import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OfferService } from 'src/app/service/offer.service';
import { Router } from '@angular/router';
import { NotificationPfeService } from 'src/app/service/notification-pfe.service';
import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../elements/footer/footer.component";
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import {  ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PartnershipService } from 'src/app/service/partnership.service';
import { Partnership } from 'src/app/models/Partnership';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NotifPfeComponent } from '../notif-pfe/notif-pfe.component';

@Component({
  selector: 'app-addoffer',
    imports: [NavbarComponent, FooterComponent, CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule,NotifPfeComponent], // Correct imports
  
  templateUrl: './addoffer.component.html',
  styleUrls: ['./addoffer.component.scss'],
})
export class AddofferComponent {
  addOfferForm: FormGroup;
  userId: number =3; // Set manually, replace with actual logic if needed
  userRole: string = 'COMPANYREPRESENTATIVE'; // Manually set, change as required
  hasOffer: boolean = false; // Set this dynamically if needed
  tunisianGovernorates = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili',
    'Kef', 'Mahdia', 'Manouba', 'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse',
    'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];
  constructor(
    private fb: FormBuilder,
    private offerService: OfferService,
    private router: Router,
    private notificationService: NotificationPfeService
  ) {
    this.addOfferForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      requiredSkill: ['', [Validators.required, Validators.minLength(20)]],
      location: ['', Validators.required],
      duration: ['', Validators.required],
      employmentType: ['', Validators.required],
      jobResponsibilities: ['', [Validators.required, Validators.minLength(20)]],
      whatWeOffer: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  onSubmit(): void {
    // Check if the form is valid
    if (this.addOfferForm.valid) {
      const offerData = this.addOfferForm.value;
      console.log('Sending offer data:', offerData);
  
      // Call the offer service to create the offer
      this.offerService.createOffer(offerData, this.userId).subscribe(
        (response) => {
          console.log('Offer creation successful', response);
          this.router.navigate(['/manageoffers']); // Adjust the route
          this.notificationService.showNotification('Offer created successfully!', 'success');
        },
        (error) => {
          console.error('Offer creation failed', error);
  
          // Extract the error message from the backend response
          let errorMessage = 'You Need to be a Company Reprsentive AND a Partner to create offer';
  
          if (error.error) {
            if (error.error.message) {
              errorMessage = error.error.message; // Use the backend error message
            } else if (typeof error.error === 'string') {
              errorMessage = error.error; // Use the raw error string
            }
          }
  
          console.log('Extracted Error Message:', errorMessage);
          this.notificationService.showNotification(errorMessage, 'error');
        }
      );
    } else {
      // Handle the case where the form is not valid
      this.notificationService.showNotification('Please fill out the form correctly.', 'error');
    }
  }
}
