import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Material } from 'src/app/models/material';
import { Reclamation } from 'src/app/models/reclamation.model';
import { TypeStatut } from 'src/app/models/type-statut';
import { MaterialService } from 'src/app/services/material.service';
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
  formError = '';
  statusTypes = Object.values(TypeStatut); // Load TypeStatut values for dropdown
  materials: Material[] = [];
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
    private reclamationService: ReclamationService,
    private materialService: MaterialService
  ) {
    this.reclamationForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      type: ['', Validators.required],
      status: [TypeStatut.IN_WAIT, Validators.required], // Default status
      quantity: ['', [Validators.required, Validators.min(1)]],
      urgencyLevel: [2, Validators.required],
      materials: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.reclamationId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.reclamationId) {
      this.loadReclamation(this.reclamationId);
    }
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.materialService.getAllMaterials().subscribe(
      (data) => this.materials = data,
      (error) => console.error('Error loading materials:', error)
    );
  }

  loadReclamation(id: number): void {
    this.reclamationService.getReclamationById(id).subscribe(
      (reclamation) => {
        this.reclamationForm.patchValue({
          title: reclamation.title,
          description: reclamation.description,
          type: reclamation.type,
          urgencyLevel: reclamation.urgencyLevel,
          quantity: reclamation.quantity, // ✅ Load the quantity value
          materials: reclamation.materials
        });
      },
      (error) => {
        console.error('Error loading reclamation:', error);
        this.formError = 'Failed to load reclamation. Please try again later.';
      }
    );
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
