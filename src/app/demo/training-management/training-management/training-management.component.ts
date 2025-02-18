import { Component, Output, EventEmitter, OnInit} from '@angular/core';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from 'src/app/theme/layout/admin/navigation/navigation.component';
import { ConfigurationComponent } from 'src/app/theme/layout/admin/configuration/configuration.component';
import { BreadcrumbsComponent } from 'src/app/theme/shared/components/breadcrumbs/breadcrumbs.component';
import { NavLogoComponent } from 'src/app/theme/layout/admin/navigation/nav-logo/nav-logo.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Training } from '../../../Models/training.model'
import { TrainingService } from 'src/app/Services/training.service';
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule
import {AddTrainingComponent} from '../add-training/add-training.component'

@Component({
  selector: 'app-training-management',
  templateUrl: './training-management.component.html',
  standalone: true,  // Déclare le composant comme standalone

  styleUrls: ['./training-management.component.scss'],
  imports: [
    // Modules Angular
    CommonModule,
    RouterModule,
    
    // Components partagés
    SharedModule,
    NavigationComponent,
    ConfigurationComponent,
    NavContentComponent,
    NavLogoComponent,
    NavBarComponent,
    BreadcrumbsComponent,
    
    // Composant d'ajout
    AddTrainingComponent
  ]

})
export class TrainingManagementComponent implements OnInit  {
  trainings: Training[] = [];  // Déclare un tableau pour stocker les formations

  constructor(
    private trainingService: TrainingService,
  ) {}
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
showAddTraining: boolean = false; // Variable de contrôle pour afficher ou non AddTraining

  toggleAddTraining() {
    this.showAddTraining = !this.showAddTraining;
  }

} 