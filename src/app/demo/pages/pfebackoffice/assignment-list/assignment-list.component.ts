import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssignmentService } from 'src/app/service/assignment.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Assignment } from 'src/app/models/Assignment';

@Component({
  selector: 'app-assignmentslist',
  imports: [CommonModule, SharedModule, RouterModule, MatDialogModule],
  templateUrl: './assignment-list.component.html',
  styleUrl: './assignment-list.component.scss',
  providers: [AssignmentService]
})
export class AssignmentListComponent implements OnInit {
  @ViewChild('detailsDialog') detailsDialog!: TemplateRef<any>;
  @ViewChild('updateDialog') updateDialog!: TemplateRef<any>;
  @ViewChild('deleteDialog') deleteDialog!: TemplateRef<any>;
  assignments: Assignment[] = [];

  selectedAssignment: Assignment | null = null; // Initialize as null
  updateForm: FormGroup;

  constructor(
    private assignmentService: AssignmentService,
    private dialog: MatDialog,
    private fb: FormBuilder // Inject FormBuilder
  ) {
    this.updateForm = this.fb.group({
      status: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAssignments();
  }

  loadAssignments(): void {
    console.log('Fetching assignments...');
    this.assignmentService.getAssignments().subscribe({
      next: (datas) => {
        console.log('Fetched data:', datas);
        this.assignments = Array.isArray(datas) ? datas : []; // ✅ Ensure it's an array
      },
      error: (err) => {
        console.error('Error fetching assignments:', err);
      },
    });
  }

  onDetails(assignment: Assignment): void {
    this.selectedAssignment = assignment;
    this.dialog.open(this.detailsDialog);
  }

  closeDetailsDialog(): void {
    this.dialog.closeAll();
  }

  onUpdate(assignment: Assignment): void {
    this.selectedAssignment = assignment; // Store the selected assignment
    this.updateForm.patchValue(assignment); // Populate the form with assignment data
    this.dialog.open(this.updateDialog); // Open the update dialog
  }

  onSave(): void {
    if (this.updateForm.valid && this.selectedAssignment) {
      const updatedAssignment = { ...this.selectedAssignment, ...this.updateForm.value };
      console.log('Updating assignment with ID:', this.selectedAssignment.idAffectation);
      console.log('Updated data:', updatedAssignment);

      this.assignmentService.updateAssignment(this.selectedAssignment.idAffectation, updatedAssignment).subscribe(
        (response) => {
          console.log('Assignment updated successfully', response);
          this.loadAssignments(); // Reload the list
          this.dialog.closeAll(); // Close the dialog
        },
        (error) => {
          console.error('Failed to update assignment', error);
        }
      );
    }
  }

  closeUpdateDialog(): void {
    this.dialog.closeAll();
  }

  onDelete(assignment: Assignment): void {
    this.selectedAssignment = assignment;
    this.dialog.open(this.deleteDialog);
  }

  onDeleteConfirm(): void {
    if (this.selectedAssignment) {
      this.assignmentService.deleteAssignment(this.selectedAssignment.idAffectation).subscribe(
        () => {
          console.log('Assignment deleted successfully');
          this.loadAssignments(); // Reload the list
          this.dialog.closeAll(); // Close the dialog
        },
        (error) => {
          console.error('Failed to delete assignment', error);
        }
      );
    }
  }

  closeDeleteDialog(): void {
    this.dialog.closeAll();
  }
}