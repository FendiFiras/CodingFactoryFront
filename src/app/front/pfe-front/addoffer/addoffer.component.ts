import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OfferService } from 'src/app/services/offer.service';
import { Router } from '@angular/router';
import { NotificationPfeService } from 'src/app/services/notification-pfe.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../elements/footer/footer.component";
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import {  ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PartnershipService } from 'src/app/services/partnership.service';
import { Partnership } from 'src/app/models/Partnership';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NotifPfeComponent } from '../notif-pfe/notif-pfe.component';
import { TagInputModule } from 'ngx-chips';
import { AuthService } from 'src/app/services/auth-service.service'; // ✅ Import

@Component({
  selector: 'app-addoffer',
    imports: [NavbarComponent, FooterComponent, CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule,NotifPfeComponent,TagInputModule], // Correct imports
  
  templateUrl: './addoffer.component.html',
  styleUrls: ['./addoffer.component.scss'],
})
export class AddofferComponent implements OnInit {

  addOfferForm: FormGroup;
  userId!: number;
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
    private cdRef: ChangeDetectorRef,
    private authService: AuthService, // ✅ Ajout

    private router: Router,
    private notificationService: NotificationPfeService
  ) {
    const textPattern = /^(?=(?:[^!@#$%^&*()_+=\-[\]{}:;"'<>,.?/|]*[!@#$%^&*()_+=\-[\]{}:;"'<>,.?/|]){0,4}[^!@#$%^&*()_+=\-[\]{}:;"'<>,.?/|]*$)(?=.*[a-zA-Z].{9,})/;

    this.addOfferForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(100),
          Validators.pattern(textPattern)
        ]
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(500),
          Validators.pattern(textPattern)
        ]
      ],
      requiredSkill: [
        [],
        [Validators.required]
      ],
      appnmbr: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern(/^[1-9][0-9]*$/) // Ensures only positive numbers (no leading zeros)
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
          Validators.pattern(textPattern)
        ]
      ],
      whatWeOffer: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(500),
          Validators.pattern(textPattern)
        ]
      ]
    });
  }
  ngOnInit(): void {
    this.authService.getUserInfo().subscribe({
      next: (user) => {
        this.userId = user.idUser;
        console.log("👤 Utilisateur connecté :", this.userId);
      },
      error: (err) => {
        console.error("❌ Erreur récupération utilisateur :", err);
        this.router.navigate(['/login']);
      }
    });
  }
  


  onSubmit(): void {
    if (this.addOfferForm.valid) {
      let offerData = this.addOfferForm.value;
  
      // Join the array of skills into a comma-separated string
      if (Array.isArray(offerData.requiredSkill)) {
        offerData.requiredSkill = offerData.requiredSkill.join(',');
      }
  
      console.log('Sending offer data:', offerData);
  
      this.offerService.createOffer(offerData, this.userId).subscribe(
        (response) => {
          console.log('Offer creation successful', response);
          this.router.navigate(['/manageoffers']);
          this.notificationService.showNotification('Offer created successfully!', 'success');
        },
        (error) => {
          console.error('Offer creation failed', error);
          let errorMessage = 'You need to be a Company Representative AND a Partner to create an offer.';
          if (error.error?.message) {
            errorMessage = error.error.message;
          }
          this.notificationService.showNotification(errorMessage, 'error');
        }
      );
    } else {
      this.notificationService.showNotification('Please fill out the form correctly.', 'error');
    }
  }
  
  

 

  generateDescription() {
    if (this.addOfferForm.invalid) {
      console.log('Form invalid:', this.addOfferForm.errors);
      return;
    }
  
    const formValues = this.addOfferForm.value;
    const promptData = {
      title: formValues.title || '',
      requiredSkill: formValues.requiredSkill || [], // Match DTO field name
      duration: formValues.duration || '',
      location: formValues.location || '',
      employmentType: formValues.employmentType || '',
      jobResponsibilities: formValues.jobResponsibilities || ''
    };
  
    // Add debug output
    console.log('Sending payload:', JSON.stringify(promptData, null, 2));
    
    this.offerService.generateDescription(promptData)
      .subscribe({
        next: (response) => { /* ... */ },
        error: (err) => {
          console.error('Full error:', err);
          console.log('Request payload:', promptData);
        }
      });
  }

  
  
  

  onTagAdd(event: any): void {
    // Handle tag add event if necessary
  }

  onTagRemove(event: any): void {
    // Handle tag remove event if necessary
  }
}
