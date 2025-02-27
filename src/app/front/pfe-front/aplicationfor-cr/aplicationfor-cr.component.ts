import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Application } from 'src/app/models/Application';
import { ApplicationService } from 'src/app/service/application.service';
import { NavbarComponent } from "../../elements/navbar/navbar.component";
import { FooterComponent } from "../../elements/footer/footer.component";
import { AssignmentService } from 'src/app/service/assignment.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Assignment } from 'src/app/models/Assignment';

@Component({
  selector: 'app-aplicationfor-cr',
  imports: [RouterModule, CommonModule, NavbarComponent, FooterComponent,BrowserModule,ReactiveFormsModule,RouterModule,MatInputModule,FormsModule,CommonModule],
  templateUrl: './aplicationfor-cr.component.html',
  styleUrl: './aplicationfor-cr.component.scss'
})
export class AplicationforCRComponent {
  applications: Application[] = [];
  offerId: number | null = null;
  showDetailsPopup = false;
  showAffectPopup = false;
  selectedApplication: Application | null = null;
  startDate: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private assignmentService: AssignmentService // Inject AssignmentService
  ) { }

  ngOnInit(): void {
    this.offerId = +this.route.snapshot.paramMap.get('offerId')!;
    if (this.offerId) {
      this.loadApplications(this.offerId);
    }
  }

  loadApplications(offerId: number): void {
    this.applicationService.getApplicationsByOfferId(offerId).subscribe(
      (data: Application[]) => {
        this.applications = data;
        this.applications.forEach((application) => {
          this.getUserIdForApplication(application.idApplication).subscribe(userId => {
            application.userId = userId;
          });
        });
      },
      (error) => {
        console.error('Error fetching applications:', error);
      }
    );
  }

  getUserIdForApplication(applicationId: number) {
    return this.applicationService.getUserIdByApplicationId(applicationId);
  }

  // Open Details Popup
  openDetailsPopup(application: Application): void {
    this.selectedApplication = application;
    this.showDetailsPopup = true;
  }

  // Close Details Popup
  closeDetailsPopup(): void {
    this.showDetailsPopup = false;
    this.selectedApplication = null;
  }

  // Open Affectation Popup
  openAffectPopup(application: Application): void {
    this.selectedApplication = application;
    this.showAffectPopup = true;
  }

  // Close Affectation Popup
  closeAffectPopup(): void {
    this.showAffectPopup = false;
    this.selectedApplication = null;
    this.startDate = null;
  }

  // Confirm Affectation
  confirmAffectation(): void {
    if (this.selectedApplication && this.startDate && this.offerId) {
      const assignment: Assignment = {
        status: 'Pending',
        startDate: new Date(this.startDate),
        endDate: null, // End date is null initially
        evaluation: null // Set evaluation to null
      };
  
      // Make the API call to create the assignment
      this.assignmentService.createAssignment(
        this.selectedApplication.userId,
        this.offerId,
        assignment
      ).subscribe(
        (response) => {
          console.log('Assignment created successfully:', response);
          this.closeAffectPopup(); // Close the popup only after the assignment is successfully created
        },
        (error) => {
          console.error('Error creating assignment:', error);
          // Optionally, display an error message to the user
        }
      );
    }
  }
  
}
