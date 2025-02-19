import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../../../Services/session.service'; // Assurez-vous d'avoir un service pour gérer les sessions
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from 'src/app/theme/layout/admin/navigation/navigation.component';
import { ConfigurationComponent } from 'src/app/theme/layout/admin/configuration/configuration.component';
import { BreadcrumbsComponent } from 'src/app/theme/shared/components/breadcrumbs/breadcrumbs.component';
import { NavLogoComponent } from 'src/app/theme/layout/admin/navigation/nav-logo/nav-logo.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Session } from '../../../Models/session.model'; // Assurez-vous d'importer le modèle Session
import { ReactiveFormsModule } from '@angular/forms';
import { Courses } from 'src/app/Models/courses.model';
import { CourseService } from 'src/app/Services/courses.service';

@Component({
  selector: 'app-add-session', // Changer le selector pour le nom de la session
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
  templateUrl: './add-session.component.html', // Mettre à jour le chemin du template
  styleUrls: ['./add-session.component.scss'],
})
export class AddSessionComponent implements OnInit {
  sessionForm: FormGroup;
  courses: Courses[] = [];




  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService ,
    private courseService: CourseService
     
  ) {
    this.sessionForm = this.fb.group({
      sessionName: ['', Validators.required], // Nom de la session
      startDate: [null, Validators.required], // Date de début
      endDate: [null, Validators.required], // Date de fin
      location: ['', Validators.required], // Lieu de la session
      courseId: [null, Validators.required],  // Modifier ici pour le champ 'courseId'
      program: ['', Validators.required], // Programme
    });
  }

  // Méthode pour ajouter une session
  onSubmit() {
    if (this.sessionForm.valid) {
      const courseId = this.sessionForm.value.courseId; // Récupérer le courseId du formulaire
      const newSession: Session = this.sessionForm.value;
      this.sessionService.createSession(newSession, courseId).subscribe(
        (response) => {
          console.log('Session added successfully:', response);
          this.sessionForm.reset();
        },
        (error) => {
          console.error('Error adding session:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
  
  ngOnInit(): void {
    // Appeler la méthode pour récupérer les cours lors de l'initialisation du composant
    this.getCourses();
  }

  // Méthode pour récupérer les cours
  getCourses(): void {
    this.courseService.getCourses().subscribe(
      (courses: Courses[]) => {
        this.courses = courses; // Stocker les cours dans le tableau courses
      },
      (error) => {
        console.error('Erreur lors du chargement des cours:', error);
      }
    );
  }
}
