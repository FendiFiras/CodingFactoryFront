import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Assignment } from 'src/app/models/Assignment';
import { Offer } from 'src/app/models/Offer';
import { AssignmentService } from 'src/app/service/assignment.service';
import { OfferService } from 'src/app/service/offer.service';
import { FooterComponent } from '../../elements/footer/footer.component';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { EvaluationFormComponent } from '../evaluation-form/evaluation-form.component';
import { MatDialog } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import { EvaluationService } from 'src/app/service/evaluation.service';

@Component({
  selector: 'app-assignmentsfor-cr',
  imports: [RouterModule, CommonModule, NavbarComponent, FooterComponent ,ReactiveFormsModule,RouterModule,MatInputModule,FormsModule,CommonModule],
  templateUrl: './assignmentsfor-cr.component.html',
  styleUrls: ['./assignmentsfor-cr.component.scss']  // Corrected 'styleUrl' to 'styleUrls'
})
export class AssignmentsforCRComponent {
  assignments: AssignmentWithPdf[] = [];
  offerId: number | null = null;
  offerName: string = '';
  comment: string = '';
  questions = [
    { text: 'Communication Skills', score: 0 },
    { text: 'Problem-Solving Skills', score: 0 },
    { text: 'Teamwork', score: 0 },
    { text: 'Technical Knowledge', score: 0 },
  ];

  constructor(
    private route: ActivatedRoute,
    private assignmentService: AssignmentService,
    private offerService: OfferService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.offerId = +params['offerId'];
      if (this.offerId) {
        this.loadAssignments(this.offerId);
        this.loadOffer(this.offerId);
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



  openEvaluationForm(assignmentId: number): void {
    const dialogRef = this.dialog.open(EvaluationFormComponent, {
      width: '500px',
      data: { assignmentId }
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Evaluation form closed');
      // Refresh assignments after evaluation
      if (this.offerId) {
        this.loadAssignments(this.offerId);
      }
    });
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
}
interface AssignmentWithPdf extends Assignment {
  safePdfUrl?: SafeResourceUrl;
}