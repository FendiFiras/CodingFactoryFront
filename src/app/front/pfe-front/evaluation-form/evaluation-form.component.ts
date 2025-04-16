import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { FooterComponent } from '../../elements/footer/footer.component';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  
  selector: 'app-evaluation-form',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './evaluation-form.component.html',
  styleUrls: ['./evaluation-form.component.scss']
})
export class EvaluationFormComponent {
  questions = [
    { text: 'Communication Skills', score: 0 },
    { text: 'Problem-Solving Skills', score: 0 },
    { text: 'Teamwork', score: 0 },
    { text: 'Technical Knowledge', score: 0 },
  ];
  comment: string = '';
  assignmentId:number;
 

  constructor(
    private evaluationService: EvaluationService,
    private dialogRef: MatDialogRef<EvaluationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { assignmentId: number }
  ) {}
  
  // Update ngOnInit
  ngOnInit() {
    if (this.data?.assignmentId) {
      this.assignmentId = this.data.assignmentId;
    } else {
      console.error('No assignment ID provided');
      this.dialogRef.close();
    }
  }

  submitEvaluation() {
    if (!this.assignmentId || this.assignmentId <= 0) {
      console.error('Invalid Assignment ID:', this.assignmentId);
      return;
    }
  
  
    // Generate the PDF document
    const doc = this.generatePDF();
    
    // Convert the PDF document to a Blob
    const pdfBlob = doc.output('blob');
    
    // Create a File object from the Blob
    const pdfFile = new File([pdfBlob], 'evaluation.pdf', { type: 'application/pdf' });
  
    const evaluationData = {
      score: this.calculateTotalScore(),
      comment: this.comment,
    };
  
    this.evaluationService.createEvaluation(this.assignmentId, evaluationData, pdfFile).subscribe({
      next: (res) => {
        console.log('Evaluation submitted successfully:', res);
        this.dialogRef.close();
      },
      error: (err) => {
        console.error('Submission error:', err);
      }
    });
  }
  
  

  close() {
    this.dialogRef.close();
  }

  calculateTotalScore(): number {
    return this.questions.length ?
           this.questions.reduce((total, q) => total + q.score, 0) / this.questions.length
           : 0;
  }

  generatePDF(): jsPDF {
    const doc = new jsPDF();
    doc.setFont('helvetica');
    doc.setFontSize(18);
    doc.text('Student Evaluation Report', 105, 20, { align: 'center' });
    doc.line(15, 25, 195, 25);

    let yPosition = 40;
    doc.setFontSize(14).setFont(undefined, 'bold').text('Evaluation Results', 15, yPosition);
    yPosition += 10;

    this.questions.forEach((q, index) => {
      doc.setFontSize(12).setFont(undefined, 'normal').text(`${index + 1}. ${q.text}`, 20, yPosition);
      doc.setFont(undefined, 'bold').text(`${q.score}/5`, 180, yPosition, { align: 'right' });
      yPosition += 10;
      if ((index + 1) % 3 === 0) doc.line(15, yPosition, 195, yPosition), yPosition += 5;
    });

    yPosition += 10;
    doc.setFont(undefined, 'bold').text('Additional Comments:', 15, yPosition);
    yPosition += 7;
    doc.setFont(undefined, 'normal').setDrawColor(200).setFillColor(245, 245, 245);
    doc.roundedRect(15, yPosition, 180, 40, 3, 3, 'FD');
    doc.text(doc.splitTextToSize(this.comment || 'No comments', 170), 20, yPosition + 8);

    doc.setFontSize(10).setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 15, 280);
    doc.text('Page 1 of 1', 180, 280, { align: 'right' });

    return doc;
  }

  // Create blob from PDF document
  createBlob(doc: jsPDF, mimeType: string): Blob {
    return new Blob([doc.output('arraybuffer')], { type: mimeType });
  }
}
