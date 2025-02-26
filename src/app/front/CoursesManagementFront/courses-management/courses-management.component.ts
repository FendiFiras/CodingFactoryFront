import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Courses } from '../../../Models/courses.model';
import { CourseService } from '../../../Services/courses.service';
import { ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { Training } from '../../../Models/training.model';
import { TrainingService } from '../../../Services/training.service';
@Component({
  selector: 'app-courses-management',
  imports: [NavbarComponent, FooterComponent, CommonModule, ReactiveFormsModule,    FormsModule   // <-- Ajoutez FormsModule ici
  ],
  standalone: true,
  templateUrl: './courses-management.component.html',
  styleUrls: ['./courses-management.component.scss']
})
export class CoursesManagementComponent implements OnInit {
  courses: Courses[] = [];  
  trainings: Training[] = [];  
  courseForm: FormGroup;
  selectedTrainingId: number | null = null;
  userId: number = 1; // 🔥 Utilisateur test
  selectedFiles: File[] = []; // Liste des fichiers sélectionnés
// ✅ Variables pour gérer l'affichage du modal et les fichiers sélectionnés
showFileModal: boolean = false;
selectedCourseFiles: string[] = [];
editingCourse: Courses | null = null;
isEditing: boolean = false;  // ✅ Ajout d'un état pour savoir si on est en mode update



  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private trainingService: TrainingService
  ) {
    this.courseForm = this.fb.group({
      courseName: ['', [Validators.required, Validators.minLength(3)]], // ✅ Min 3 caractères
      courseDescription: ['', [Validators.required, Validators.minLength(12)]], // ✅ Min 12 caractères
      difficulty: ['', Validators.required],
      trainingId: ['', Validators.required]
  });
  }  

  ngOnInit(): void {
    this.loadCourses();
    this.loadTrainingsForUser();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe(
      (data) => {
        this.courses = data;
      },
      (error) => {
        console.error('❌ Erreur chargement cours', error);
      }
    );
  }

  loadTrainingsForUser(): void {
    this.trainingService.getUserTrainings(this.userId).subscribe(
      (trainings) => {
        this.trainings = trainings;
      },
      (error) => {
        console.error('❌ Erreur chargement formations utilisateur', error);
      }
    );
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
        console.log("📝 Training ID sélectionné :", this.selectedTrainingId);

        if (!this.selectedTrainingId) {
            console.error("❌ Aucun Training sélectionné !");
            return;
        }

        const formData = new FormData();
        const courseData: any = {
            courseId: this.isEditing ? this.editingCourse?.courseId : null, // ✅ Vérifie si c'est une mise à jour
            courseName: this.courseForm.value.courseName,
            courseDescription: this.courseForm.value.courseDescription,
            difficulty: this.courseForm.value.difficulty,
            trainingId: this.courseForm.value.trainingId
        };

        formData.append('course', new Blob([JSON.stringify(courseData)], { type: 'application/json' }));

        // ✅ Ajouter les fichiers déjà enregistrés (évite de les perdre)
        this.selectedCourseFiles.forEach(fileUrl => {
            formData.append('existingFiles', fileUrl);
        });

        // ✅ Ajouter les nouveaux fichiers sélectionnés
        this.selectedFiles.forEach(file => {
            formData.append('files', file);
        });

        console.log("📢 Données envoyées :", courseData);

        if (this.isEditing) {
            // 🔥 **Mode Mise à jour**
            this.courseService.updateCourse(formData).subscribe(() => {
                console.log('✅ Cours mis à jour avec succès');
                this.loadCourses();
                this.resetForm();
            }, error => console.error('❌ Erreur mise à jour du cours', error));
        } else {
            // 🔥 **Mode Ajout**
            this.courseService.addCourse(formData, this.selectedTrainingId!).subscribe(() => {
                console.log('✅ Nouveau cours ajouté');
                this.loadCourses();
                this.resetForm();
            }, error => console.error('❌ Erreur ajout du cours', error));
        }
    } else {
        console.error("⚠️ Formulaire invalide !");
    }
}

resetForm(): void {
  this.courseForm.reset();
  this.selectedTrainingId = null;
  this.selectedFiles = [];
  this.selectedCourseFiles = [];
  this.isEditing = false;
  this.editingCourse = null;
}


onUpdate(): void {
  if (this.courseForm.valid && this.editingCourse) {
      const updatedCourse: any = {
          courseId: this.editingCourse.courseId, 
          courseName: this.courseForm.value.courseName,
          courseDescription: this.courseForm.value.courseDescription,
          difficulty: this.courseForm.value.difficulty,
          trainingId: this.courseForm.value.trainingId
      };

      const formData = new FormData();
      formData.append('course', new Blob([JSON.stringify(updatedCourse)], { type: 'application/json' }));

      // ✅ Envoyer la liste des fichiers existants sous forme de JSON (Blob)
      formData.append('existingFiles', new Blob([JSON.stringify(this.selectedCourseFiles)], { type: 'application/json' }));

      // ✅ Ajouter les nouveaux fichiers sélectionnés
      this.selectedFiles.forEach(file => {
          formData.append('files', file);
      });

      console.log("📢 Données envoyées au backend :", updatedCourse);
      console.log("📢 Fichiers existants envoyés :", this.selectedCourseFiles);

      this.courseService.updateCourse(formData).subscribe(
          () => {
              console.log('✅ Cours mis à jour avec succès');
              this.loadCourses();
              this.resetForm();
          },
          (error) => {
              console.error('❌ Erreur mise à jour du cours', error);
          }
      );
  } else {
      console.error("⚠️ Formulaire invalide !");
  }
}





  onDelete(courseId: number): void {
    this.courseService.deleteCourse(courseId).subscribe(
      () => {
        this.courses = this.courses.filter(course => course.courseId !== courseId);
      },
      (error) => {
        console.error('❌ Erreur suppression du cours', error);
      }
    );
  }

  editCourse(course: Courses): void {
    console.log("✏️ Mode édition activé pour :", course);

    // ✅ Passer en mode édition
    this.isEditing = true;
    this.editingCourse = course;

    // ✅ Remplir le formulaire avec les valeurs du cours sélectionné
    this.courseForm.patchValue({
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        difficulty: course.difficulty
    });

    // ✅ Stocker les fichiers existants et les afficher
    this.selectedCourseFiles = course.fileUrls ? [...course.fileUrls] : [];

    // ✅ Réinitialiser la formation sélectionnée
    this.selectedTrainingId = null;

    // 🔥 Charger la formation associée au cours
    this.trainingService.getTrainingsForCourse(course.courseId).subscribe(
        (trainings) => {
            if (trainings.length > 0) {
                this.selectedTrainingId = trainings[0].trainingId;
                console.log("📌 Formation associée trouvée :", this.selectedTrainingId);

                // ✅ Mettre à jour le formulaire avec la formation trouvée
                this.courseForm.patchValue({
                    trainingId: this.selectedTrainingId
                });
            } else {
                console.warn("⚠️ Aucun training trouvé pour ce cours.");
            }
        },
        (error) => {
            console.error("❌ Erreur lors de la récupération de la formation associée", error);
        }
    );
}


removeExistingFile(fileUrl: string) {
  this.selectedCourseFiles = this.selectedCourseFiles.filter(f => f !== fileUrl);
}





  onFileSelected(event: any) {
    const files: FileList = event.target.files;

    // Ajouter les nouveaux fichiers à la liste existante
    for (let i = 0; i < files.length; i++) {
        if (!this.selectedFiles.some(f => f.name === files[i].name)) {
            this.selectedFiles.push(files[i]);
        }
    }

    console.log("📂 Fichiers sélectionnés :", this.selectedFiles);
}

// Supprimer un fichier de la liste avant l'envoi
removeFile(file: File) {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
}

// Extraire le nom du fichier à partir de l'URL
extractFileName(fileUrl: string): string {
    return fileUrl.split('/').pop() || 'Unknown File';
}


 // ✅ Fonction pour ouvrir un fichier
 openFile(fileUrl: string): void {
  const filename = this.extractFileName(fileUrl);
  this.courseService.openFile(filename);
}

  onTrainingChange(event: any): void {
    console.log("🎯 Training sélectionné :", this.selectedTrainingId);
}
// ✅ Ouvrir le modal avec les fichiers du cours sélectionné
openFilesModal(fileUrls: string[]) {
  console.log("🔍 Ouverture du modal, fichiers reçus :", fileUrls);
  this.selectedCourseFiles = fileUrls;
  this.showFileModal = true;
}


// ✅ Fermer le modal
closeFilesModal() {
  this.showFileModal = false;
  this.selectedCourseFiles = [];
}

}