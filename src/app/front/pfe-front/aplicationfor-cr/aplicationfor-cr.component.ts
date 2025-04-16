import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Application } from 'src/app/models/Application';
import { ApplicationService } from 'src/app/services/application.service';
import { NavbarComponent } from "../../elements/navbar/navbar.component";
import { FooterComponent } from "../../elements/footer/footer.component";
import { AssignmentService } from 'src/app/services/assignment.service';
import { BrowserModule, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Assignment } from 'src/app/models/Assignment';
import { FilterPipe } from 'src/app/filter.pipe';
import { EvaluationFormComponent } from '../evaluation-form/evaluation-form.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OfferService } from 'src/app/services/offer.service';
import { Offer } from 'src/app/models/Offer';
import { InterviewDialogComponent } from '../interview-dialog/interview-dialog.component';
import { NotificationPfeService } from 'src/app/services/notification-pfe.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NotifPfeComponent } from "../notif-pfe/notif-pfe.component";

@Component({
  selector: 'app-aplicationfor-cr',
  imports: [RouterModule, FilterPipe, CommonModule, NavbarComponent, FooterComponent, BrowserModule, ReactiveFormsModule,
    MatDialogModule, // Include MatDialogModule
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule, MatInputModule, FormsModule, NotifPfeComponent],
  templateUrl: './aplicationfor-cr.component.html',
  styleUrl: './aplicationfor-cr.component.scss'
})
export class AplicationforCRComponent {
  assignments: AssignmentWithPdf[] = [];
  offerName: string = '';


  currentView: string = 'overview';
  searchText: string = '';



  showOverview() {
    this.currentView = 'overview';
  }

  showAffectations() {
    this.currentView = 'affectations';
  }


  applications: Application[] = [];
  offerId: number | null = null;
  showDetailsPopup = false;
  showAffectPopup = false;
  selectedApplication: Application | null = null;
  startDate: string | null = null;
  requiredSkills: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private assignmentService: AssignmentService,
    private offerService: OfferService,
    private sanitizer: DomSanitizer,
        private notificationService: NotificationPfeService,
    private dialog: MatDialog // Inject AssignmentService
  ) { }
  affectedApplicants = this.applications.filter(app => app.status === 'Accepted');

  ngOnInit(): void {
    this.offerId = +this.route.snapshot.paramMap.get('offerId')!;
    if (this.offerId) {
      this.loadApplicationsWithoutScore(this.offerId);
    }
    this.route.params.subscribe(params => {
      this.offerId = +params['offerId'];
      if (this.offerId) {
        this.loadAssignments(this.offerId);
        this.loadOffer(this.offerId);
      }
    });
  }
  loadOffer(offerId: number): void {
    this.offerService.getOfferById(offerId).subscribe(
      (offer: Offer) => {
        this.offerName = offer.title;
      },
      (error) => {
        console.error('Error fetching offer:', error);
      }
    );
  }
  loadApplicationsWithoutScore(offerId: number): void {
    this.applicationService.getApplicationsByOfferId(offerId).subscribe(
      (data: Application[]) => {
        this.applications = data;
  
        this.applications.forEach(app => {
          this.applicationService.getApplicantNameByApplicationId(app.idApplication).subscribe(
            (name: string) => {
              app.applicantName = name;
            },
            error => {
              console.error(`Error fetching name for application ${app.idApplication}:`, error);
            }
          );
  
          this.applicationService.getUserIdByApplicationId(app.idApplication).subscribe(
            (userId: number) => {
              app.userId = userId;
            },
            error => {
              console.error(`Error fetching user ID for application ${app.idApplication}:`, error);
            }
          );
        });
      },
      error => {
        console.error('Error fetching applications:', error);
      }
    );
  }
  calculateAndSortApplications(offerId: number): void {
    this.applicationService.getRequiredSkillsForOffer(offerId).subscribe(
      (response: any) => {
        const requiredSkills = response.requiredSkills;
  
        if (typeof requiredSkills === 'string') {
          this.requiredSkills = requiredSkills.split(',').map(skill => skill.trim());
        } else {
          console.error("Error: requiredSkills is not a string", requiredSkills);
          return;
        }
  
        const requiredSkillsString = this.requiredSkills.join(', ');
  
        this.applicationService.getApplicationsWithScores(offerId, requiredSkillsString).subscribe(
          (data: Application[]) => {
            this.applications = data;
  
            this.applications.forEach(app => {
              this.applicationService.getApplicantNameByApplicationId(app.idApplication).subscribe(
                (name: string) => {
                  app.applicantName = name;
                },
                error => {
                  console.error(`Error fetching name for application ${app.idApplication}:`, error);
                }
              );
  
              this.applicationService.getUserIdByApplicationId(app.idApplication).subscribe(
                (userId: number) => {
                  app.userId = userId;
                },
                error => {
                  console.error(`Error fetching user ID for application ${app.idApplication}:`, error);
                }
              );
            });
  
            this.sortApplicationsByScore();
          },
          error => {
            console.error('Error fetching applications with scores:', error);
          }
        );
      },
      error => {
        console.error("Error fetching required skills:", error);
      }
    );
  }
   
  
  loadRequiredSkillsForOffer(offerId: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.applicationService.getRequiredSkillsForOffer(offerId).subscribe(
        (requiredSkills: string) => {
          // Assuming the backend returns a comma-separated string of skills
          this.requiredSkills = requiredSkills.split(',').map(skill => skill.trim());
          console.log("Required Skills:", this.requiredSkills);
          resolve(requiredSkills);  // Resolve the promise with the requiredSkills string
        },
        (error) => {
          console.error("Error fetching required skills:", error);
          reject(error);  // Reject the promise in case of an error
        }
      );
    });
  }
  
  

  // Fetch applicant name and user ID for a specific application
  getApplicantDetails(app: Application): Promise<void> {
    return new Promise((resolve, reject) => {
      // Fetch name
      this.applicationService.getApplicantNameByApplicationId(app.idApplication).subscribe(
        (name: string) => {
          app.applicantName = name;
        },
        (error) => {
          console.error(`Error fetching name for application ${app.idApplication}:`, error);
          reject(error); // Reject promise if name fetch fails
        }
      );

      // Fetch user ID
      this.applicationService.getUserIdByApplicationId(app.idApplication).subscribe(
        (userId: number) => {
          app.userId = userId;
          resolve(); // Resolve promise once both name and user ID are fetched
        },
        (error) => {
          console.error(`Error fetching user ID for application ${app.idApplication}:`, error);
          reject(error); // Reject promise if user ID fetch fails
        }
      );
    });
  }

  // Sort the applications by score (in descending order)
  sortApplicationsByScore(): void {
    this.applications.sort((a, b) => b.score - a.score);
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
  openEvaluationForm(assignmentId: number, username: string, offername: string): void {
    const dialogRef = this.dialog.open(EvaluationFormComponent, {
      width: '1000px',
      data: { assignmentId, username, offername }
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Evaluation form closed');
      // Refresh assignments after evaluation
      if (this.offerId) {
        this.loadAssignments(this.offerId);
      }
    });
  }

  loadAssignments(offerId: number): void {
    this.assignmentService.getAssignmentsByOfferId(offerId).subscribe(
      (data: Assignment[]) => {
        this.assignments = data.map(assignment => ({
          ...assignment,
          safePdfUrl: assignment.evaluation?.evaluationPdf
            ? this.createPdfUrl(assignment.evaluation.evaluationPdf)
            : undefined
        })) as AssignmentWithPdf[];
      },
      (error) => console.error('Error fetching assignments:', error)
    );

    this.assignmentService.getAssignments().subscribe(assignments => {
      this.assignments = assignments;

      // Now for each assignment, fetch names
      this.assignments.forEach(assignment => {
        this.assignmentService.getUserNameByAssignmentId(assignment.idAffectation).subscribe(name => {
          assignment.userName = name;
        });

        this.assignmentService.getOfferTitleByAssignmentId(assignment.idAffectation).subscribe(title => {
          assignment.offerTitle = title;
        });
      });
    });
  }
  private createPdfUrl(base64Data: string): SafeResourceUrl {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  downloadPdf(base64Data: string, fileName: string): void {
    try {
      // Handle potential data URL prefix
      const base64Prefix = 'base64,';
      const base64Index = base64Data.indexOf(base64Prefix);
      const rawBase64 = base64Index > -1
        ? base64Data.substring(base64Index + base64Prefix.length)
        : base64Data;

      // Convert base64 to byte array
      const byteCharacters = atob(rawBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Create and trigger download
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Optionally show error to user

    }
  }
  ////////////////////////////////////////////////////////////// INTERVIEWWWWWWWWW




  openInterviewDialog(applicationId: number) {
    const dialogRef = this.dialog.open(InterviewDialogComponent, {
      data: { applicationId }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // If result is truthy, you can assume the interview was successfully scheduled.
        // For example, you could reload the list of applications or show a success message.
        this.notificationService.showNotification('Interview scheduled successfully!', 'success');
      } else {
        // If result is falsy, handle the case where the dialog was closed without scheduling.
        this.notificationService.showNotification('Interview scheduling was canceled.', 'error');
      }
    });
  }
}
interface AssignmentWithPdf extends Assignment {
  safePdfUrl?: SafeResourceUrl;
}
