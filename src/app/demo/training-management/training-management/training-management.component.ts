import { Component, OnInit } from '@angular/core';
import { TrainingService } from 'src/app/Services/training.service';
import { Training,TrainingType  } from '../../../Models/training.model';
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
import { Courses,CourseDifficulty } from 'src/app/Models/courses.model';
import { CourseService } from 'src/app/Services/courses.service';
import { Session } from '../../../Models/session.model';
import {SessionService} from '../../../Services/session.service';
import { AddSessionComponent } from '../add-session/add-session.component';
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
    AddTrainingComponent,
    AddSessionComponent
  ]
})
export class TrainingManagementComponent implements OnInit {
  trainings: Training[] = [];  // Déclare un tableau pour stocker les formations
  showAddTraining: boolean = false; // Variable de contrôle pour afficher ou non AddTraining
  showAddSession: boolean = false;  // Contrôle l'affichage du formulaire d'ajout
  showCoursesTable = true; // Contrôle l'affichage des cours

  trainingTypes = Object.values(TrainingType);  // Récupérer les valeurs de l'enum TrainingType
  editing: { [key: number]: string[] } = {};  // Stocker les champs en édition pour chaque formation
  courses: Courses[] = [];
  sessions: Session[] = [];
  constructor(
    private trainingService: TrainingService,
    private courseService: CourseService,
    private sessionService :SessionService
  
  ) {}
  ngOnInit(): void {
    // Appelle la méthode du service pour récupérer les données
    this.trainingService.getTrainings().subscribe(
      (data) => {

        console.log(data); // Affiche la réponse de l'API dans la console

        this.trainings = data;  // Affecte les données reçues à la variable `trainings`
      },
      (error) => {
        console.error('Erreur lors de la récupération des formations', error);
      }
    );
    // Appelle la méthode du service pour récupérer les données des cours
  this.courseService.getCourses().subscribe(
    (data) => {
      console.log(data); // Affiche la réponse de l'API dans la console

      this.courses = data;  // Affecte les données reçues à la variable `courses`
    },
    (error) => {
      console.error('Erreur lors de la récupération des cours', error);
    }
  );
  this.sessionService.getSessions().subscribe(
    (data) => {
      console.log(data); // Affiche la réponse de l'API dans la console

      this.sessions = data;  // Affecte les données reçues à la variable `courses`
    },
    (error) => {
      console.error('Erreur lors de la récupération des cours', error);
    }
  );
  
  }
  // Toggle pour afficher/masquer le formulaire
  toggleAddSession() {
    this.showAddSession = !this.showAddSession;
    this.showCoursesTable = !this.showAddTraining; // Masquer les cours lorsque la formation est ajoutée

  }


  // Méthode pour basculer l'affichage du formulaire d'ajout
  toggleAddTraining() {
    this.showAddTraining = !this.showAddTraining;
    this.showCoursesTable = !this.showAddTraining; // Masquer les cours lorsque la formation est ajoutée

  }
  // Activer l'édition pour un champ spécifique
  enableEditing(field: string, training: Training): void {
    if (!this.editing[training.trainingId]) {
      this.editing[training.trainingId] = [];
    }
    if (!this.editing[training.trainingId].includes(field)) {
      this.editing[training.trainingId].push(field);
    }
  }

  // Vérifier si un champ est en cours d'édition
  isEditing(training: Training, field: string): boolean {
    return this.editing[training.trainingId] && this.editing[training.trainingId].includes(field);
  }

  // Mettre à jour la formation après modification
  updateTraining(training: Training): void {
    this.trainingService.updateTraining(training).subscribe(
      (response) => {
        console.log('Formation mise à jour avec succès:', response);
        this.editing[training.trainingId] = [];  // Désactiver l'édition après mise à jour
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la formation:', error);
      }
    );
  }

  deleteTraining(trainingId: number): void {
    this.trainingService.deleteTraining(trainingId).subscribe(
      (response) => {
        // Rafraîchir la liste des formations après la suppression
        this.trainingService.getTrainings().subscribe(
          (data) => {
            this.trainings = data;  // Met à jour la liste des formations
            console.log('Formation supprimée avec succès');
          },
          (error) => {
            console.error('Erreur lors de la récupération des formations après suppression', error);
          }
        );
      },
      (error) => {
        console.error('Erreur lors de la suppression de la formation', error);
      }
    );
  }
  
  deleteSession(sessionId: number): void {
    this.sessionService.deleteSession(sessionId).subscribe(
      () => {
        // Mise à jour de la liste après suppression
        this.sessions = this.sessions.filter(session => session.sessionId !== sessionId);
        console.log('Session supprimée avec succès');
      },
      (error) => {
        console.error('Erreur lors de la suppression de la session', error);
      }
    );
  }
   // Vérifier si un champ est en cours d'édition
   isEditingS(session: Session, field: string): boolean {
    return this.editing[session.sessionId] && this.editing[session.sessionId].includes(field);
  }

  // Activer l'édition d'un champ spécifique pour une session
  enableEditingS(field: string, session: Session): void {
    if (!this.editing[session.sessionId]) {
      this.editing[session.sessionId] = [];
    }
    this.editing[session.sessionId].push(field);
  }

  // Mettre à jour la session après modification
  updateSession(session: Session): void {
    this.sessionService.updateSession(session).subscribe(
      (response) => {
        console.log('Session mise à jour avec succès:', response);
        this.editing[session.sessionId] = [];  // Désactiver l'édition après mise à jour
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la session:', error);
      }
    );
  }
  
}  
