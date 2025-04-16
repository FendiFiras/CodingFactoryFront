import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InterviewService } from 'src/app/services/interview.service';

@Component({
  selector: 'app-interview-dialog',
  standalone: true,

  imports: [CommonModule,ReactiveFormsModule, HttpClientModule, FormsModule , 
    MatDialogModule,  // Include MatDialogModule
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './interview-dialog.component.html',
  styleUrl: './interview-dialog.component.scss'
})
export class InterviewDialogComponent {
  interviewDate: string = ""; // Initialize with empty string
  interviewTime: string = ""; // Initialize with empty string
  applicationId: number;

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<InterviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { applicationId: number }
  ) {
    this.applicationId = data.applicationId;
  }

  submit(date: string, time: string) {
    console.log("Date:", date); // Debug
    console.log("Time:", time);
  
    if (!date || !time) {
      alert("Please fill in date and time.");
      return;
    }
  
    const params = new HttpParams()
      .set('applicationId', this.applicationId.toString())
      .set('interviewDate', date)
      .set('interviewTime', time);
  
      this.http.post('http://localhost:8089/pidev/interview', null, {
        params,
        responseType: 'text'
      }).subscribe(
        () => {
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error scheduling interview:', error);
        }
      );
  }

  
}
  
  

