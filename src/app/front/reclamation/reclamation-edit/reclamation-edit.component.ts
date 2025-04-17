import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Material } from 'src/app/models/material';
import { Reclamation } from 'src/app/models/reclamation.model';
import { Type } from 'src/app/models/type';
import { MaterialService } from 'src/app/services/material.service';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { NavbarComponent } from "../../elements/navbar/navbar.component";

@Component({
  selector: 'app-reclamation-edit',
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './reclamation-edit.component.html',
  styleUrl: './reclamation-edit.component.scss'
})
export class ReclamationEditComponent implements OnInit {

  reclamationForm: FormGroup;
  materials: Material[] = [];
  types = Object.values(Type);
  urgencyLevels = [
    { value: 1, label: 'Low' },
    { value: 2, label: 'Medium' },
    { value: 3, label: 'High' },
    { value: 4, label: 'Critical' }
  ];

  reclamationId: number = 0;
  isSubmitting = false;
  formError = '';

  constructor(
    private fb: FormBuilder,
    private reclamationService: ReclamationService,
    private materialService: MaterialService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.reclamationForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      type: [Type.MATERIAL, Validators.required],
      urgencyLevel: [2, Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
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

    this.isSubmitting = true;
    this.formError = '';

    const updatedReclamation: Partial<Reclamation> = {
      ...this.reclamationForm.value,
      idReclamation: this.reclamationId,
      idUser: 1 // Static User ID
    };

    this.reclamationService.updateReclamation(updatedReclamation as Reclamation).subscribe(
      () => {
        this.isSubmitting = false;
        this.router.navigate(['/user/reclamations']);
      },
      (error) => {
        this.isSubmitting = false;
        console.error('Error updating reclamation:', error);
        this.formError = 'Failed to update reclamation. Please try again.';
      }
    );
  }
}
