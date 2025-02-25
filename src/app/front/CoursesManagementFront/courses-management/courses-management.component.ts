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



  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private trainingService: TrainingService
  ) {
    this.courseForm = this.fb.group({
      courseName: ['', Validators.required],
      courseDescription: ['', Validators.required],
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

        const newCourse: any = {
            courseName: this.courseForm.value.courseName,
            courseDescription: this.courseForm.value.courseDescription,
            difficulty: this.courseForm.value.difficulty
        };

        formData.append('course', new Blob([JSON.stringify(newCourse)], { type: 'application/json' }));

        // ✅ **Ajouter les fichiers déjà enregistrés (sans les écraser)**
        const existingFiles = this.courses.find(c => c.courseName === this.courseForm.value.courseName)?.fileUrls || [];
        existingFiles.forEach(url => {
            formData.append('existingFiles', url); // Conserver les fichiers déjà présents
        });

        // ✅ **Ajouter les nouveaux fichiers sélectionnés**
        this.selectedFiles.forEach(file => {
            formData.append('files', file);
        });

        this.courseService.addCourse(formData, this.selectedTrainingId).subscribe(
            (data) => {
                console.log('✅ Cours ajouté avec fichiers:', data);
                this.courses.push(data);
                this.courseForm.reset();
                this.selectedFiles = [];
            },
            (error) => {
                console.error('❌ Erreur ajout du cours', error);
            }
        );
    }
}




  onUpdate(course: Courses): void {
    const formData = new FormData();
    formData.append('course', new Blob([JSON.stringify(course)], { type: 'application/json' }));

    this.selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    this.courseService.updateCourse(course, this.selectedFiles).subscribe(
      () => {
        console.log('✅ Cours mis à jour');
      },
      (error) => {
        console.error('❌ Erreur mise à jour du cours', error);
      }
    );
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