import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../elements/footer/footer.component";
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PartnershipService } from 'src/app/services/partnership.service';
import { Partnership } from 'src/app/models/Partnership';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationPfeService } from 'src/app/services/notification-pfe.service';
import { NotifPfeComponent } from '../notif-pfe/notif-pfe.component';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-becomepartner',
  imports: [NavbarComponent, FooterComponent, CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule,NotifPfeComponent], // Correct imports
  templateUrl: './becomepartner.component.html',
  styleUrls: ['./becomepartner.component.scss'] // Fixed typo
})
export class BecomepartnerComponent implements OnInit {
  partnershipForm: FormGroup;
  fileSelected: boolean = false;
  userId!: number;
  userRole!: string;
  
  hasPartnership: boolean = false; // Flag to track if the user already has a partnership
  industries: string[] = ['Artificial Intelligence', 'IT', 'Marketing', 'Finance', 'Healthcare', 'Other'];

  constructor(
    private fb: FormBuilder,
    private partnershipService: PartnershipService,
    private router: Router,
    private notificationService: NotificationPfeService,
    private authService: AuthService // ✅ AJOUT

  ) {
    this.partnershipForm = this.fb.group({
      industry: ['', Validators.required],
      companyWebsite: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]], 
      companyLogo: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.authService.getUserInfo().subscribe({
      next: (user) => {
        this.userId = user.idUser;
        this.userRole = user.role;
        console.log("✅ Utilisateur connecté :", this.userId, " | Rôle :", this.userRole);
      },
      error: (err) => {
        console.error("❌ Erreur récupération utilisateur :", err);
        this.router.navigate(['/login']); // Redirection si non connecté
      }
    });
  }
  



  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileSelected = true;
      const filePath = `uploads/${file.name}`; // Adjust to actual upload logic
      this.partnershipForm.patchValue({ companyLogo: filePath });
    }
  }

  onSubmit(): void {
    if (this.hasPartnership) {
      this.notificationService.showNotification('You already have an active partnership.', 'warning');
      return;
    }
  
    if (this.userRole !== 'COMPANYREPRESENTIVE') {
      this.notificationService.showNotification('You must be a Company Representative to apply for a partnership.', 'error');
      return;
    }
  
    if (this.partnershipForm.valid) {
      const partnershipData = this.partnershipForm.value;
      console.log('Sending partnership data:', partnershipData);
  
      this.partnershipService.applyForPartnership(partnershipData, this.userId).subscribe(
        (response) => {
          console.log('Application successful', response);
          this.router.navigate(['/welcompartner']);
          this.notificationService.showNotification('Partnership accepted successfully!', 'success');
        },
        (error) => {
          console.error('Application failed', error);
  
          // Ensure the error message is correctly extracted
          let errorMessage = 'Failed to submit partnership.';
  
          if (error.error) {
            if (error.error.message) {
              errorMessage = error.error.message; // Extract message if available
            } else if (typeof error.error === 'string') {
              errorMessage = error.error; // If the error itself is a string
            }
          }
  
          console.log('Extracted Error Message:', errorMessage); // Log extracted error message
          this.notificationService.showNotification(errorMessage, 'error'); // Show error notification
        }
      );
    }
  }
  
  
  }
  
  
  

