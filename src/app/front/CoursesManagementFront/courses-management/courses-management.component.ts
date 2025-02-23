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
  courses: Courses[] = [];  // Liste des cours
  trainings: Training[] = [];  // Liste des trainings pour le select
  courseForm: FormGroup;
  selectedTrainingId: number | null = null;
  userId: number = 1; //fixer user 1 pour faire le test 
  selectedFileUrl: string = ''; // ✅ Stocker l'URL locale du fichier importé
  selectedFile!: File;

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
        console.error('Erreur lors du chargement des cours', error);
      }
    );
  }

  loadTrainingsForUser(): void {
    this.trainingService.getUserTrainings(this.userId).subscribe(
      (trainings) => {
        this.trainings = trainings;
      },
      (error) => {
        console.error('❌ Erreur lors du chargement des formations de l\'utilisateur', error);
      }
    );
  }
  onSubmit(): void {
    if (this.courseForm.valid) {
      const newCourse: Courses = this.courseForm.value;
  
      // ✅ Ajoute uniquement l'URL relative du fichier
      newCourse.fileUrls = this.selectedFileUrl;  
  
      this.courseService.addCourse(newCourse, this.selectedTrainingId!)
        .subscribe(
          (data) => {
            console.log('Cours ajouté avec fichier local:', data);
            this.courses.push(data);
            this.courseForm.reset();
            this.selectedFileUrl = ''; // Réinitialisation après ajout
          },
          (error) => {
            console.error('Erreur lors de l\'ajout du cours', error);
          }
        );
    }
  }
  
  
  
  openLocalFile(fileName: string) {
    const filePath = `${fileName}`; // ✅ Garde l'URL relative correcte
    window.open(filePath, '_blank'); // ✅ Ouvre correctement dans un nouvel onglet
  }
  
  
  
  

  onUpdate(course: Courses): void {
    this.courseService.updateCourse( course).subscribe(
      () => {
        console.log('Cours mis à jour');
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du cours', error);
      }
    );
  }

  onDelete(courseId: number): void {
    this.courseService.deleteCourse(courseId).subscribe(
      () => {
        this.courses = this.courses.filter(course => course.courseId !== courseId);
      },
      (error) => {
        console.error('Erreur lors de la suppression du cours', error);
      }
    );
  }
  onFileSelected(event: any, courseId: number) {
    const file: File = event.target.files[0]; // 📂 Récupère le fichier sélectionné
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
  
      // 📤 Envoie le fichier au backend pour l’enregistrer
      this.courseService.uploadFile(courseId, formData).subscribe(
        (response) => {
          console.log("✅ Fichier uploadé avec succès :", response);
          this.loadCourses(); // 🔄 Recharge les cours pour afficher le fichier uploadé
        },
        (error) => {
          console.error("❌ Erreur lors de l'upload du fichier", error);
        }
      );
    }
  }
  
  
  
  saveFileToUploads(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const filePath = `assets/uploads/${file.name}`; // Chemin du fichier
      localStorage.setItem(filePath, reader.result as string); // 🔥 Simule un stockage local (alternative Angular)
    };
    reader.readAsDataURL(file);
  }
  
  
  

  getFileName(fileUrl: string): string {
    if (!fileUrl) return 'No File';
    return fileUrl.split('/').pop() || 'No File'; // 🔥 Extraire le dernier élément de l'URL
  }
  
  
}
