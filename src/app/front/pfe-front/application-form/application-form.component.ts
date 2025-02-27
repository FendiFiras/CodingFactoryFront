import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Application } from 'src/app/models/Application';
import { ApplicationService } from 'src/app/service/application.service';
import { NavBarComponent } from "../../../theme/layout/admin/nav-bar/nav-bar.component";
import { FooterComponent } from "../../elements/footer/footer.component";
import { NavbarComponent } from "../../elements/navbar/navbar.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NotificationPfeService } from 'src/app/service/notification-pfe.service';
import { NotifPfeComponent } from "../notif-pfe/notif-pfe.component";
@Component({
  selector: 'app-application-form',
  imports: [NavBarComponent, FooterComponent, ReactiveFormsModule, NavbarComponent,
    HttpClientModule,
    MatInputModule,
    RouterModule,
    MatCardModule,
    MatButtonModule, NotifPfeComponent],
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.scss'
})
export class ApplicationFormComponent  {

  applicationForm: FormGroup;
  offerId: number | null = null;
  userId: number | null = null;
  currentStep: number = 1;
  cvFile: File | null = null; // Add this property to store the selected file

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private notificationService: NotificationPfeService
  ) {
    this.applicationForm = this.fb.group({
      score: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      availability: ['', [Validators.required, this.futureDateValidator]],
      fieldofStudy: ['', Validators.required],
      university: ['', [Validators.required, Validators.minLength(5)]],
      coverLetter: ['', [Validators.required, Validators.minLength(15)]],
      cv: [''], // Will store the CV file name (string path)
      submissionDate: [new Date().toISOString().split('T')[0]], // Set today’s date
      status: ['Pending'], // Initialize status as "Pending"
    });
  }
  futureDateValidator(control: any) {
    const today = new Date();
    const selectedDate = new Date(control.value);
    if (selectedDate < today) {
      return { futureDate: true };
    }
    return null;
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.offerId = +params['offerId'];
      console.log('Offer ID:', this.offerId);
    });

    // Fetch the userId from your authentication service or local storage
    this.userId = this.getUserId(); // Implement this method to get the logged-in user's ID
  }

  // Get the logged-in user's ID (replace with your actual logic)
  getUserId(): number {
    // Example: Fetch from local storage or authentication service
    return 2; // Replace with the actual user ID
  }

  // Handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.cvFile = file;
      this.applicationForm.patchValue({ cv: file.name }); // Store only the file name as a path string
    }
  }

  // Go to the next step
  nextStep(): void {
    if (
      this.currentStep === 1 &&
      this.applicationForm.get('score')?.valid &&
      this.applicationForm.get('availability')?.valid &&
      this.applicationForm.get('fieldofStudy')?.valid &&
      this.applicationForm.get('university')?.valid
    ) {
      this.currentStep = 2;
    }
  }

  // Go to the previous step
  previousStep(): void {
    if (this.currentStep === 2) {
      this.currentStep = 1;
    }
  }

  // Submit the application
  onSubmit(): void {
    if (this.applicationForm.valid && this.offerId && this.userId) {
      const application: Application = {
        ...this.applicationForm.value,
        offer: { idOffer: this.offerId }, // Include the offer ID in the application object
      };
  
      // Create a FormData object for file upload
      const formData = new FormData();
      formData.append('application', JSON.stringify(application)); // Append the application as JSON
      if (this.cvFile) {
        formData.append('cvFile', this.cvFile); // Append the CV file
      }
  
      this.applicationService.applyForOffer(formData, this.userId).subscribe({
        next: (response) => {
          console.log('Application submitted successfully:', response);
          this.notificationService.showNotification('Application submitted successfully!', 'success'); // Show success notification
          this.router.navigate(['/applictiondone']);// change route
        },
        error: (err) => {
          console.error('Failed to submit application:', err);
          this.notificationService.showNotification(err.message || 'Failed to submit application.', 'error'); // Show error notification
        },
      });
    }
  }
  }
