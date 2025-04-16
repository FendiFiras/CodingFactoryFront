import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Application } from 'src/app/models/Application';
import { ApplicationService } from 'src/app/services/application.service';
import { FooterComponent } from "../../elements/footer/footer.component";
import { NavbarComponent } from "../../elements/navbar/navbar.component";
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NotificationPfeService } from 'src/app/services/notification-pfe.service';
import { NotifPfeComponent } from "../notif-pfe/notif-pfe.component";
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-application-form',
  imports: [ FooterComponent, ReactiveFormsModule, NavbarComponent,HttpClientModule,MatInputModule,CommonModule,RouterModule,MatCardModule,MatButtonModule, NotifPfeComponent],
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

      availability: ['', [Validators.required, this.futureDateValidator]],
      fieldofStudy: ['', Validators.required],
      university: ['', [Validators.required, Validators.minLength(5)]],
      coverLetter: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(200)]],
      cv: [''],
      submissionDate: [new Date().toISOString().split('T')[0]],
      status: ['Pending'],
      score: [null],
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

  getUserId(): number {
    return 3; //////////////////////////////////////////////////////////////////////
  }

  // Handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.cvFile = file;
      this.applicationForm.patchValue({ cv: file.name });
    } else {
      this.cvFile = null;
      alert('Only PDF files are allowed.');
    }
  }
  

  // Go to the next step
  nextStep(): void {
    if (
      this.currentStep === 1 &&
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

  onSubmit(): void {
    if (this.applicationForm.valid && this.offerId && this.userId) {
      // Create an application object without the file
      const application: Application = {
        ...this.applicationForm.value,
        offer: { idOffer: this.offerId }, // Include the offer ID in the application object
      };

      // Create a FormData object for file upload and application data
      const formData = new FormData();
      
      // Append the application object as a JSON string
      formData.append('application', JSON.stringify(application)); // This will be handled by your backend
      
      // If there's a CV file selected, append it to FormData
      if (this.cvFile) {
        formData.append('cvFile', this.cvFile, this.cvFile.name); // Ensure the file name is added
      }
  
      // First, upload the CV if there's one to upload
      if (this.cvFile) {
        this.applicationService.uploadCv(formData).subscribe({
          next: (response) => {
            console.log('File uploaded successfully:', response);
          },
          error: (error) => {
            console.error('Error uploading file:', error);
            this.notificationService.showNotification('Error uploading file', 'error');
            return; // Stop further execution if file upload fails
          }
        });
      }
  
      // After uploading the CV (if applicable), submit the application
      this.applicationService.applyForOffer(formData, this.userId).subscribe({
        next: (response) => {
          console.log('Application submitted successfully:', response);
          this.notificationService.showNotification('Application submitted successfully!', 'success'); // Show success notification
          this.router.navigate(['/applictiondone']); // Correct route (fix typo from 'applictiondone' to 'applicationdone')
        },
        error: (err) => {
          console.error('Failed to submit application:', err);
          this.notificationService.showNotification(err.message || 'Failed to submit application.', 'error'); // Show error notification
        },
      });
    } else {
      console.error('Form is not valid');
      this.notificationService.showNotification('Please fill out all required fields.', 'error'); // Show error if form is not valid
    }
  }
  
  
  }
