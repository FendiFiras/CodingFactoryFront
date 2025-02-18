import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrainingService } from '../../../Services/training.service';
import { TrainingType } from '../../../Models/training.model';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.scss']
})
export class AddTrainingComponent {
  trainingForm: FormGroup;
  trainingTypes = Object.values(TrainingType);
  instructors = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTrainingComponent>,
    private trainingService: TrainingService
  ) {
    this.trainingForm = this.fb.group({
      trainingName: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null],
      trainingType: [null, Validators.required],
      instructorId: [null, Validators.required],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.trainingForm.valid) {
      const formData = this.trainingForm.value;
      
      // Appel direct avec les données du formulaire
      this.trainingService.addTraining(formData, formData.instructorId)
        .subscribe({
          next: (res) => {
            this.dialogRef.close(res);
          },
          error: (err) => {
            console.error('Error adding training:', err);
            // Gestion d'erreur améliorée
            alert('Error adding training: ' + err.message);
          }
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}