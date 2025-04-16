import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Application } from 'src/app/models/Application';
import { Offer } from 'src/app/models/Offer';
import { ApplicationService } from 'src/app/services/application.service';
import { AssignmentService } from 'src/app/services/assignment.service';
import { OfferService } from 'src/app/services/offer.service';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CalendarComponent } from '../calendar/calendar.component';

@Component({
  selector: 'app-aplicationfor-students',
  imports: [CommonModule,RouterModule,CalendarComponent
  , NavbarComponent, FooterComponent,ReactiveFormsModule,RouterModule],
  templateUrl: './aplicationfor-students.component.html',
  styleUrl: './aplicationfor-students.component.scss'
})
export class AplicationforStudentsComponent {
  userId: number=2; // ///////////////////////////////////////////////////////////////
  applications: Application[] = [];
    offerName?: string; // Optional property if you don't always have it

  constructor(
    private applicationservice: ApplicationService,
    private route: ActivatedRoute ,
    private offerService : OfferService,// If userId is part of the route,
  ) {}

  ngOnInit(): void {

    
    this.applicationservice.getApplicationsByUserId(this.userId).subscribe(
      (data: Application[]) => {
        console.log("Received Applications:", data);
        this.applications = data;
      },
      (error) => {
        console.error('Error fetching applications:', error);
      }
    );
  }
  
  loadApplications(userId: number): void {
    this.applicationservice.getApplicationsByUserId(userId).subscribe(
      (applications: Application[]) => {
        this.applications = applications;
  
        // Fetch offer name for each application
        this.applications.forEach(application => {
          if (application.offer.idOffer) {  // Ensure offerId exists
            this.offerService.getOfferById(application.offer.idOffer).subscribe(
              (offer: Offer) => {
                application.offer.title = offer.title;
                this.offerName= application.offer.title; // Attach offer title
              },
              error => console.error('Error fetching offer title:', error)
            );
          }
        });
      },
      error => console.error('Error fetching applications:', error)
    );
  }

  
  // Component method
getStatusClass(status: string) {
  switch(status.toLowerCase()) {
    case 'accepted': return 'status-accepted';
    case 'pending': return 'status-pending';
    case 'rejected': return 'status-rejected';
    default: return 'status-pending';
  }
}
  

}
