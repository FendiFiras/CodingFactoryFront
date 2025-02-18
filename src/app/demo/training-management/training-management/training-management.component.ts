import { Component, OnInit } from '@angular/core';
import { TrainingService } from 'src/app/Services/training.service';
import { Training } from '../../../Models/training.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavigationComponent } from 'src/app/theme/layout/admin/navigation/navigation.component';
import { ConfigurationComponent } from 'src/app/theme/layout/admin/configuration/configuration.component';
import { BreadcrumbsComponent } from 'src/app/theme/shared/components/breadcrumbs/breadcrumbs.component';
import { NavLogoComponent } from 'src/app/theme/layout/admin/navigation/nav-logo/nav-logo.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import {AddTrainingComponent} from '../add-training/add-training.component'
@Component({
  selector: 'app-training-management',
  templateUrl: './training-management.component.html',
  styleUrls: ['./training-management.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    NavigationComponent,
    ConfigurationComponent,
    NavContentComponent,
    NavLogoComponent,
    NavBarComponent,
    BreadcrumbsComponent,
    AddTrainingComponent
  ]
})
export class TrainingManagementComponent implements OnInit {
  trainings: Training[] = [];  // Déclare un tableau pour stocker les formations
  showAddTraining: boolean = false; // Variable de contrôle pour afficher ou non AddTraining

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    // Appelle la méthode du service pour récupérer les données
    this.trainingService.getTrainings().subscribe(
      (data) => {
        this.trainings = data;  // Affecte les données reçues à la variable `trainings`
      },
      (error) => {
        console.error('Erreur lors de la récupération des formations', error);
      }
    );
  }

  // Méthode pour basculer l'affichage du formulaire d'ajout
  toggleAddTraining() {
    this.showAddTraining = !this.showAddTraining;
  }
}
