import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvaluationService } from 'src/app/service/evaluation.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Evaluation } from 'src/app/models/Evaluation';

@Component({
  selector: 'app-evaluationlist',
  imports: [CommonModule, SharedModule, RouterModule, MatDialogModule],
  templateUrl: './evaluation-list.component.html',
  styleUrl: './evaluation-list.component.scss',
  providers: [EvaluationService]
})
export class EvaluationListComponent implements OnInit {
  @ViewChild('detailsDialog') detailsDialog!: TemplateRef<any>;
  @ViewChild('updateDialog') updateDialog!: TemplateRef<any>;
  @ViewChild('deleteDialog') deleteDialog!: TemplateRef<any>;
  evaluations: Evaluation[] = [];

  selectedEvaluation: Evaluation | null = null; // Initialize as null
  updateForm: FormGroup;

  constructor(
    private evaluationService: EvaluationService,
    private dialog: MatDialog,
    private fb: FormBuilder // Inject FormBuilder
  ) {
    this.updateForm = this.fb.group({
      score: ['', Validators.required],
      comment: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadEvaluations();
  }

  loadEvaluations(): void {
    console.log('Fetching evaluations...');
    this.evaluationService.getEvaluations().subscribe({
      next: (datas) => {
        console.log('Fetched data:', datas);
        this.evaluations = Array.isArray(datas) ? datas : []; // Ensure it's an array
      },
      error: (err) => {
        console.error('Error fetching evaluations:', err);
      },
    });
  }

  onDetails(evaluation: Evaluation): void {
    this.selectedEvaluation = evaluation;
    this.dialog.open(this.detailsDialog);
  }

  closeDetailsDialog(): void {
    this.dialog.closeAll();
  }

  onUpdate(evaluation: Evaluation): void {
    this.selectedEvaluation = evaluation; // Store the selected evaluation
    this.updateForm.patchValue(evaluation); // Populate the form with evaluation data
    this.dialog.open(this.updateDialog); // Open the update dialog
  }

  onSave(): void {
    if (this.updateForm.valid && this.selectedEvaluation) {
      const updatedEvaluation = { ...this.selectedEvaluation, ...this.updateForm.value };
      console.log('Updating evaluation with ID:', this.selectedEvaluation.idEvaluation);
      console.log('Updated data:', updatedEvaluation);

      this.evaluationService.updateEvaluation(this.selectedEvaluation.idEvaluation, updatedEvaluation).subscribe(
        (response) => {
          console.log('Evaluation updated successfully', response);
          this.loadEvaluations(); // Reload the list
          this.dialog.closeAll(); // Close the dialog
        },
        (error) => {
          console.error('Failed to update evaluation', error);
        }
      );
    }
  }

  closeUpdateDialog(): void {
    this.dialog.closeAll();
  }

  onDelete(evaluation: Evaluation): void {
    this.selectedEvaluation = evaluation;
    this.dialog.open(this.deleteDialog);
  }

  onDeleteConfirm(): void {
    if (this.selectedEvaluation) {
      this.evaluationService.deleteEvaluation(this.selectedEvaluation.idEvaluation).subscribe(
        () => {
          console.log('Evaluation deleted successfully');
          this.loadEvaluations(); // Reload the list
          this.dialog.closeAll(); // Close the dialog
        },
        (error) => {
          console.error('Failed to delete evaluation', error);
        }
      );
    }
  }

  closeDeleteDialog(): void {
    this.dialog.closeAll();
  }
}