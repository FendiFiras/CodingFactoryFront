import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Material } from 'src/app/models/material';
import { Reclamation } from 'src/app/models/reclamation.model';
import { Type } from 'src/app/models/type';
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
  fileError: string | null = null;

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
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        this.noSpecialCharactersValidator()
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500),
        this.noSpecialCharactersValidator()
      ]],
      type: [Type.MATERIAL, Validators.required],
      urgencyLevel: [2, Validators.required],
      materials: [[], Validators.required],
      quantity: [[Validators.required, Validators.min(1)]]
    });
  }

  // Custom validator to restrict special characters
  noSpecialCharactersValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = /[^a-zA-Z0-9\s.,!?-]/.test(control.value);
      return forbidden ? { specialCharacters: { value: control.value } } : null;
    };
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
        console.log(formData)
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
      quantity: 1
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input?.files?.length) {
      const file = input.files[0];
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/png',
        'image/jpeg',
        'image/gif',
        'video/mp4',
        'video/webm',
        'video/ogg'
      ];
  
      if (!allowedTypes.includes(file.type)) {
        this.fileError = 'Invalid file type. Please upload a PDF, DOC, image, or video.';
        input.value = '';
        this.selectedFile = null;
        setTimeout(() => {
          this.fileError = null;
        }, 3000);
        return;
      }
  
      this.selectedFile = file;
      this.fileError = null;
    }
  }
}