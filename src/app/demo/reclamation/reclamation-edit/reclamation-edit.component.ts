import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Reclamation } from 'src/app/Models/reclamation.model';
import { TypeStatut } from 'src/app/Models/type-statut';
import { ReclamationService } from 'src/app/services/reclamation.service';

@Component({
  selector: 'app-reclamation-edit',
  templateUrl: './reclamation-edit.component.html',
  styleUrl: './reclamation-edit.component.scss',
  standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
    ]
})
export class ReclamationEditComponent implements OnInit {
  reclamationForm: FormGroup;
  reclamationId!: number;
  isSubmitting = false;
  statusTypes = Object.values(TypeStatut); // Load TypeStatut values for dropdown
  urgencyLevels = [
    { value: 1, label: 'Low' },
    { value: 2, label: 'Medium' },
    { value: 3, label: 'High' },
    { value: 4, label: 'Critical' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reclamationService: ReclamationService
  ) {
    this.reclamationForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      type: ['', Validators.required],
      status: [TypeStatut.IN_WAIT, Validators.required], // Default status
      urgencyLevel: [2, Validators.required]
    });
  }

  ngOnInit(): void {
    this.reclamationId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadReclamation();
  }

  loadReclamation(): void {
    this.reclamationService.getReclamationById(this.reclamationId).subscribe((reclamation) => {
      this.reclamationForm.patchValue(reclamation);
    });
  }

  onSubmit(): void {
    if (this.reclamationForm.invalid) {
      this.reclamationForm.markAllAsTouched();
      return;
    }

    const updatedReclamation: Reclamation = {
      ...this.reclamationForm.value,
      idReclamation: this.reclamationId
    };

    this.isSubmitting = true;
    this.reclamationService.updateReclamation(updatedReclamation).subscribe(
      () => {
        this.isSubmitting = false;
        this.router.navigate(['/reclamations']);
      },
      (error) => {
        console.error('Error updating reclamation:', error);
        this.isSubmitting = false;
      }
    );
  }

  cancelEdit(): void {
    this.router.navigate(['/admin/reclamations']);
  }
}
