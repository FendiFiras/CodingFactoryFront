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
  filteredTrainings: Training[] = [];
  filteredCourses: Courses[] = [];

  editingSessions: { [key: number]: { field: string, value: any } } = {};
  searchTraining: string = "";
  filteredSessions: Session[] = [];
  searchSession: string = "";
  searchCourse: string = "";
  sortAscending: boolean = true; // ✅ Par défaut, tri croissant
  selectedTrainingType: string = ""; // Par défaut, afficher tous les types

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
        this.filteredTrainings = [...data]; // ✅ Assurez-vous que la liste filtrée est initialisée avec toutes les formations

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
      this.filteredCourses =[...data];
    },
    (error) => {
      console.error('Erreur lors de la récupération des cours', error);
    }
  );
  this.sessionService.getSessions().subscribe(
    (data) => {
      console.log(data); // Affiche la réponse de l'API dans la console

      this.sessions = data;  // Affecte les données reçues à la variable `courses`
      this.filteredSessions = [...data];

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

  updateTraining(training: Training): void {
    // ✅ Vérifier si le nom de la formation a au moins 5 caractères
    if (training.trainingName.length < 5) {
        console.error('❌ Le nom de la formation doit contenir au moins 5 caractères !');
        alert('Le nom de la formation doit contenir au moins 5 caractères !');
        return;
    }

    // ✅ Vérifier que la date de début est au moins 5 jours après aujourd’hui
    const minStartDate = new Date();
    minStartDate.setDate(minStartDate.getDate() + 5);
    const startDate = new Date(training.startDate);

    if (startDate < minStartDate) {
        console.error('❌ La date de début doit être au moins 5 jours après aujourd’hui !');
        alert('La date de début doit être au moins 5 jours après aujourd’hui !');
        return;
    }

    // ✅ Vérifier que la date de fin est après la date de début
    const endDate = new Date(training.endDate);
    if (endDate <= startDate) {
        console.error('❌ La date de fin doit être après la date de début !');
        alert('La date de fin doit être après la date de début !');
        return;
    }

    // ✅ Vérifier que le type de formation est sélectionné
    if (!training.type) {
        console.error('❌ Le type de formation est obligatoire !');
        alert('Le type de formation est obligatoire !');
        return;
    }

 // ✅ Vérifier que le prix est requis et n'est pas négatif
 if (training.price === null || training.price === undefined || training.price < 0) {
  console.error('❌ Le prix est obligatoire et ne peut pas être négatif !');
  alert('Le prix est obligatoire et ne peut pas être négatif !');
  return;
}

    // ✅ Mise à jour si tout est valide
    this.trainingService.updateTraining(training).subscribe(
        (response) => {
            console.log('✅ Formation mise à jour avec succès:', response);
            this.editing[training.trainingId] = []; // Désactiver l'édition après mise à jour
        },
        (error) => {
            console.error('❌ Erreur lors de la mise à jour de la formation:', error);
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


// ✅ Désactiver l'édition après modification
disableEditing(sessionId: number) {
  delete this.editingSessions[sessionId];
}
   // Vérifier si un champ est en cours d'édition
   isEditingS(session: Session, field: string): boolean {
    return this.editing[session.sessionId] && this.editing[session.sessionId].includes(field);
  }

// ✅ Activer le mode édition sur un champ spécifique
enableEditingS(field: string, session: Session) {
  this.editingSessions[session.sessionId] = { field, value: session[field] };
}

updateSession(session: Session) {
  const editedField = this.editingSessions[session.sessionId];
  if (!editedField) return;

  const { field, value } = editedField;

  // ✅ Validation des horaires
  if (field === 'startTime' || field === 'endTime') {
      const newDate = new Date(value);
      const hour = newDate.getHours();

      // ✅ Start Time doit être entre 08:00 et 20:00
      if (field === 'startTime' && (hour < 8 || hour > 20)) {
          console.error("❌ L'heure de début doit être entre 08:00 et 20:00 !");
          alert("L'heure de début doit être entre 08:00 et 20:00 !");
          return;
      }

      // ✅ Vérification de End Time
      if (field === 'endTime') {
          const startTime = new Date(session.startTime);
          
          // ✅ L'heure de fin doit être après l'heure de début
          if (newDate <= startTime) {
              console.error("❌ L'heure de fin doit être après l'heure de début !");
              alert("L'heure de fin doit être après l'heure de début !");
              return;
          }

          // ✅ Vérifier que la session ne dépasse pas 3 heures
          const diffInHours = (newDate.getTime() - startTime.getTime()) / (1000 * 60 * 60);
          if (diffInHours > 3) {
              console.error("❌ La session ne peut pas durer plus de 3 heures !");
              alert("La session ne peut pas durer plus de 3 heures !");
              return;
          }
      }
  }

  // ✅ Validation du programme
  if (field === 'program' && value.length < 10) {
      console.error("❌ Le programme doit contenir au moins 10 caractères !");
      alert("Le programme doit contenir au moins 10 caractères !");
      return;
  }

  // ✅ Envoi de la mise à jour
  const updatedSession = { ...session, [field]: value };

  this.sessionService.updateSession(updatedSession).subscribe(
      () => {
          console.log("✅ Session mise à jour avec succès !");
          session[field] = value;
          this.disableEditing(session.sessionId);
      },
      (error) => {
          console.error("❌ Erreur lors de la mise à jour :", error);
      }
  );
}
 // ✅ Charger les Trainings
 getTrainings() {
  this.trainingService.getTrainings().subscribe(
    (data) => {
      this.trainings = data;
      this.filteredTrainings = data; // ✅ Initialiser la liste filtrée
    },
    (error) => console.error("❌ Erreur chargement trainings :", error)
  );
}
filterTrainings() {
  let filtered = this.trainings;

  // ✅ Filtrer par nom si un texte est entré
  if (this.searchTraining.trim()) {
    filtered = filtered.filter((training) =>
      training.trainingName.toLowerCase().includes(this.searchTraining.toLowerCase())
    );
  }

  // ✅ Filtrer par type de formation si un type est sélectionné
  if (this.selectedTrainingType) {
    filtered = filtered.filter((training) => training.type === this.selectedTrainingType);
  }

  this.filteredTrainings = filtered;
}


getSessions() {
  this.sessionService.getSessions().subscribe(
    (data) => {
      this.sessions = data;
      this.filteredSessions = data;
    },
    (error) => console.error("❌ Erreur chargement sessions :", error)
  );
}


filterSessions() {
  this.filteredSessions = this.sessions.filter((session) =>
    session.location.toLowerCase().includes(this.searchSession.toLowerCase())
  );
}
  // ✅ Charger les Cours
  getCourses() {
    this.courseService.getCourses().subscribe(
      (data) => {
        this.courses = data;
        this.filteredCourses = data;
      },
      (error) => console.error("❌ Erreur chargement cours :", error)
    );
  }
   // ✅ Filtrer les Cours
   filterCourses() {
    this.filteredCourses = this.courses.filter((course) =>
      course.courseName.toLowerCase().includes(this.searchCourse.toLowerCase())
    );
  }
  toggleSortOrder() {
    this.sortAscending = !this.sortAscending; // ✅ Inverser l'ordre du tri
    this.sortTrainingsByPrice();
  }
  
  sortTrainingsByPrice() {
    this.filteredTrainings.sort((a, b) => {
      return this.sortAscending ? a.price - b.price : b.price - a.price;
    });
  }




}
  
