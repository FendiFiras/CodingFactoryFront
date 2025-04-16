

import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationService } from 'src/app/services/application.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';


  @Component({
    selector: 'app-application-list',
    imports: [CommonModule, SharedModule, RouterModule, MatDialogModule],
    templateUrl: './application-list.component.html',
    styleUrl: './application-list.component.scss'
  })
  export class ApplicationListComponent {
  @ViewChild('detailsDialog') detailsDialog!: TemplateRef<any>;
  @ViewChild('updateDialog') updateDialog!: TemplateRef<any>;
  @ViewChild('deleteDialog') deleteDialog!: TemplateRef<any>;
  applications: any[] = [];

  selectedApplication: any | null = null; // Initialize as null
  updateForm: FormGroup;

  constructor(
    private applicationService: ApplicationService,
    private dialog: MatDialog,
    private fb: FormBuilder // Inject FormBuilder
  ) {
    this.updateForm = this.fb.group({
      fieldofStudy: ['', Validators.required],
      university: ['', Validators.required],
      status: ['', Validators.required],
      score: ['', Validators.required],
      submissionDate: ['', Validators.required],
      availability: ['', Validators.required],
      coverLetter: ['', Validators.required],
      cv: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    console.log('Fetching applications...');
    this.applicationService.getApplications().subscribe({
      next: (datas) => {
        console.log('Fetched data:', datas);
        this.applications = Array.isArray(datas) ? datas : []; // ✅ Ensure it's an array
      },
      error: (err) => {
        console.error('Error fetching applications:', err);
      },
    });
  }

  onDetails(application: any): void {
    this.selectedApplication = application;
    this.dialog.open(this.detailsDialog);
  }

  closeDetailsDialog(): void {
    this.dialog.closeAll();
  }

  onUpdate(application: any): void {
    this.selectedApplication = application; // Store the selected application
    this.updateForm.patchValue(application); // Populate the form with application data
    this.dialog.open(this.updateDialog); // Open the update dialog
  }

  onSave(): void {
    console.log('Form valid:', this.updateForm.valid); // Log form validity
    console.log('Selected application:', this.selectedApplication); // Log selected application
  
    if (this.updateForm.valid && this.selectedApplication) {
      const updatedApplication = { ...this.selectedApplication, ...this.updateForm.value };
      console.log('Updating application with ID:', this.selectedApplication.idApplication);
      console.log('Updated data:', updatedApplication);
  
      this.applicationService.updateApplication(this.selectedApplication.idApplication, updatedApplication).subscribe(
        (response) => {
          console.log('Application updated successfully', response);
          this.loadApplications(); // Reload the list
          this.dialog.closeAll(); // Close the dialog
        },
        (error) => {
          console.error('Failed to update application', error);
          if (error.error) {
            console.error('Error details:', error.error); // Log error details
          }
        }
      );
    } else {
      console.error('Form is invalid or no application selected');
    }
  }

  closeUpdateDialog(): void {
    this.dialog.closeAll();
  }

  onDelete(application: any): void {
    this.selectedApplication = application;
    this.dialog.open(this.deleteDialog);
  }

  onDeleteConfirm(): void {
    if (this.selectedApplication) {
      this.applicationService.deleteApplication(this.selectedApplication.idApplication).subscribe(
        () => {
          console.log('Application deleted successfully');
          this.loadApplications(); // Reload the list
          this.dialog.closeAll(); // Close the dialog
        },
        (error) => {
          console.error('Failed to delete application', error);
        }
      );
    }
  }

  closeDeleteDialog(): void {
    this.dialog.closeAll();
  }
}