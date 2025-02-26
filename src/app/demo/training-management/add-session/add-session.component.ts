import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      sessionName: ['', Validators.required], 
      startTime: [null, [Validators.required, this.validateStartTime]], 
      endTime: [null, [Validators.required, this.validateEndTime.bind(this)]], 
      location: ['', Validators.required], 
      courseId: [null, Validators.required],  
      program: ['', [Validators.required, Validators.minLength(10)]], 
    });
  }
    

  onSubmit() {
    if (this.sessionForm.valid) {
        const courseId = this.sessionForm.get('courseId')?.value;
        if (!courseId) {
            console.error("❌ Course ID is undefined or null!");
            return;
        }
  
        // 🔥 Vérifie si les dates existent avant conversion
        const startTime = this.sessionForm.get('startTime')?.value 
            ? new Date(this.sessionForm.get('startTime')?.value).toISOString() 
            : null;
        
        const endTime = this.sessionForm.get('endTime')?.value 
            ? new Date(this.sessionForm.get('endTime')?.value).toISOString() 
            : null;
  
        if (!startTime || !endTime) {
            console.error("❌ StartTime ou EndTime est NULL !");
            return;
        }
  
        const newSession: Session = {
            ...this.sessionForm.value,
            startTime: startTime,  // ✅ Utilisation de startTime pour correspondre au backend
            endTime: endTime
        };
  
        console.log("📢 Données envoyées au backend:", newSession);
  
        this.sessionService.createSession(newSession, courseId).subscribe(
            (response) => {
                console.log("✅ Session ajoutée avec succès:", response);
                this.sessionForm.reset();
            },
            (error) => {
                console.error("❌ Erreur lors de l'ajout de la session:", error);
            }
        );
    } else {
        console.error("⚠️ Le formulaire est invalide");
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




// ✅ Validation pour s'assurer que `startTime` est entre 08:00 et 18:00
validateStartTime(control: AbstractControl) {
  if (!control.value) return null;

  const startTime = new Date(control.value);
  const hour = startTime.getHours();

  // ✅ Modification : La session doit être entre 08:00 et 18:00
  if (hour < 8 || hour > 18) {
    return { invalidStartTime: true };
  }
  return null;
}


// ✅ Validation pour s'assurer que `endTime` est supérieur à `startTime` et que la session ne dépasse pas 3 heures
validateEndTime(control: AbstractControl) {
  if (!control.value || !this.sessionForm) return null;
  const startTime = new Date(this.sessionForm.get('startTime')?.value);
  const endTime = new Date(control.value);

  if (startTime >= endTime) {
    return { endTimeBeforeStart: true };
  }

  const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // en heures
  if (duration > 3) {
    return { maxSessionDuration: true };
  }

  return null;
}





}
