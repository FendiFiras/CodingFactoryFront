import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrainingService } from '../../../Services/training.service';
import { TrainingType } from '../../../Models/training.model';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from 'src/app/theme/layout/admin/navigation/navigation.component';
import { ConfigurationComponent } from 'src/app/theme/layout/admin/configuration/configuration.component';
import { BreadcrumbsComponent } from 'src/app/theme/shared/components/breadcrumbs/breadcrumbs.component';
import { NavLogoComponent } from 'src/app/theme/layout/admin/navigation/nav-logo/nav-logo.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Training } from '../../../Models/training.model';
import { ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
@Component({




  selector: 'app-add-training', // Ajoutez un selector ici

  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    NavigationComponent,
    ConfigurationComponent,
    NavContentComponent,
    NavLogoComponent,
    NavBarComponent,
    BreadcrumbsComponent,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule
  ],
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.scss'],
})
export class AddTrainingComponent {
  trainingForm: FormGroup;
  trainingTypes: string[] = ['ONLINE', 'ON_SITE'];  // ✅ Liste des types
  showAddTraining: boolean = false; // ✅ Variable pour afficher ou masquer le formulaire
  minStartDate: string; // ✅ Stocke la date minimale autorisée pour Start Date
  successMessage: string = ''; // ✅ Variable pour stocker le message de succès

  instructors = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' },
  ];

  userId: number = 1;  // Fixer le userId à 1

  constructor(
    private fb: FormBuilder,
    private trainingService: TrainingService,
    private location: Location
  ) {
    this.minStartDate = this.getMinStartDate(); // ✅ Définir la date minimale

    this.trainingForm = this.fb.group({
      trainingName: ['', [Validators.required, Validators.minLength(5)]], // ✅ Min 5 caractères
      startDate: [null, [Validators.required, this.startDateValidator.bind(this)]], // ✅ Doit être supérieure à aujourd'hui + 5 jours
      endDate: [null, [Validators.required, this.endDateValidator.bind(this)]], // ✅ Doit être après startDate
      type: [null, Validators.required],  // ✅ CHANGEMENT: "type" au lieu de "trainingType"
      instructorId: [null, Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  // ✅ Récupère la date minimale autorisée (aujourd'hui + 5 jours)
  getMinStartDate(): string {
    let date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toISOString().split('T')[0];
  }

  // ✅ Validation : startDate doit être supérieure à aujourd'hui + 5 jours
  startDateValidator(control: any) {
    if (!control.value) return null;
    const startDate = new Date(control.value);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 5);
    
    return startDate >= minDate ? null : { invalidStartDate: true };
  }

  // ✅ Validation : endDate doit être après startDate
  endDateValidator(control: any) {
    if (!control.value || !this.trainingForm) return null;
    const endDate = new Date(control.value);
    const startDate = new Date(this.trainingForm.get('startDate')?.value);
    
    return endDate > startDate ? null : { invalidEndDate: true };
  }

 // ✅ Soumettre le formulaire et afficher le message de succès
 onSubmit() {
  if (this.trainingForm.valid) {
    const newTraining: Training = this.trainingForm.value;
    this.trainingService.addTraining(newTraining, this.userId).subscribe(
      (response) => {
        console.log('✅ Formation ajoutée avec succès:', response);
        
        // ✅ Afficher le message de succès
        this.successMessage = '✅ Training added successfully!';

        // ✅ Réinitialiser le formulaire après ajout
        this.trainingForm.reset();

        // ✅ Masquer le message après 3 secondes
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      (error) => {
        console.error('❌ Erreur lors de l\'ajout de la formation:', error);
      }
    );
  } else {
    console.error('⚠️ Le formulaire est invalide');
  }
}


  // ✅ Fonction pour revenir en arrière
  goBack(): void {
    this.location.back();
  }
}

