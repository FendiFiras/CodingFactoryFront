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
    BreadcrumbsComponent
  ],
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.scss'],
})
export class AddTrainingComponent {
  trainingForm: FormGroup;
  trainingTypes = Object.values(TrainingType);
  instructors = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' },
  ];

  // Fixer le userId à 1
  userId: number = 1;

  constructor(
    private fb: FormBuilder,
    private trainingService: TrainingService
  ) {
    this.trainingForm = this.fb.group({
      trainingName: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null],
      trainingType: [null, Validators.required],
      instructorId: [null, Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  // Méthode pour ajouter une formation
  onSubmit() {
    if (this.trainingForm.valid) {
      const newTraining: Training = this.trainingForm.value;
      // Ajouter la formation avec userId fixé
      this.trainingService.addTraining(newTraining, this.userId).subscribe(
        (response) => {
          console.log('Formation ajoutée avec succès:', response);
          // Effectuer des actions après l'ajout, comme la réinitialisation du formulaire
          this.trainingForm.reset();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la formation:', error);
        }
      );
    } else {
      console.error('Le formulaire est invalide');
    }
  }
}
