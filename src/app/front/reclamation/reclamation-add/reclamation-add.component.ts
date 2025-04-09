import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Material } from 'src/app/Models/material';
import { Reclamation } from 'src/app/Models/reclamation.model';
import { Type } from 'src/app/Models/type';
import { MaterialService } from 'src/app/services/material.service';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { NavbarComponent } from '../../elements/navbar/navbar.component';

@Component({
  selector: 'app-reclamation-add',
  templateUrl: './reclamation-add.component.html',
  styleUrls: ['./reclamation-add.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent
  ]
})

export class ReclamationAddComponent implements OnInit {

  reclamationForm: FormGroup;
  materials: Material[] = [];
  types = Object.values(Type);
  isSubmitting = false;
  formError = '';
  selectedFile: File | null = null;

  urgencyLevels = [
    { value: 1, label: 'Low' },
    { value: 2, label: 'Medium' },
    { value: 3, label: 'High' },
    { value: 4, label: 'Critical' }
  ];

  constructor(
    private fb: FormBuilder,
    private reclamationService: ReclamationService,
    private materialService: MaterialService,
    private router: Router
  ) {
    this.reclamationForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      type: [Type.MATERIAL, Validators.required],
      urgencyLevel: [2, Validators.required],
      materials: [[], Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.materialService.getAllMaterials().subscribe(
      (data) => {
        console.log('Loaded Materials:', data);
        this.materials = data;
      },
      (error) => {
        console.error('Error loading materials:', error);
        this.formError = 'Failed to load materials. Please try again later.';
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
  
    const reclamation: Reclamation = {
      ...this.reclamationForm.value,
      creationDate: new Date(),
      idUser: 1
    };
  
    const formData = new FormData();
    formData.append('reclamation', new Blob([JSON.stringify(reclamation)], { type: 'application/json' }));
  
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
  
    this.reclamationService.addReclamation(formData).subscribe(
      () => {
        this.isSubmitting = false;
        this.resetForm();
        this.router.navigate(['/home']);
      },
      (error) => {
        this.isSubmitting = false;
        console.error('Error submitting reclamation:', error);
        this.formError = 'Failed to submit reclamation. Please try again.';
      }
    );
  }
  

  resetForm(): void {
    this.reclamationForm.reset({
      title: '',
      description: '',
      type: Type.MATERIAL,
      urgencyLevel: 2,
      materials: [],
      quantity: 1 // Ensure quantity is reset properly
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
    }
  }
}
