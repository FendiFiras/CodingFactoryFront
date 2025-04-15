import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Courses } from '../../../models/courses.model';
import { CourseService } from '../../../services/courses.service';
import { SafeUrlPipe } from 'src/app/pipes/safe-url.pipe';

@Component({
  selector: 'app-courses-student',
  imports: [NavbarComponent, FooterComponent, CommonModule, ReactiveFormsModule,FormsModule,SafeUrlPipe ],  // <-- Ajoutez FormsModule ici
  templateUrl: './courses-student.component.html',
  styleUrl: './courses-student.component.scss'
})
export class CoursesStudentComponent implements OnInit {
  courses: Courses[] = [];
  trainingId!: number;
  selectedCourse: Courses | null = null;
  previewUrls: Map<number, string | null> = new Map(); // ✅ Stocke les aperçus par ID de cours


  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.trainingId = Number(params.get('trainingId'));
      this.loadCourses();
    });
  }

  loadCourses(): void {
    this.courseService.getCoursesByTraining(this.trainingId).subscribe(
      (data) => {
        this.courses = data.map(course => ({
          ...course,
          previewUrl: null // ✅ Initialiser l'aperçu du fichier pour chaque cours
        }));
      },
      (error) => {
        console.error('❌ Erreur lors du chargement des cours', error);
      }
    );
  }

  // ✅ Affiche/Masque la liste des fichiers du cours sélectionné
  toggleFilesDropdown(course: Courses): void {
    this.selectedCourse = this.selectedCourse === course ? null : course;
  }

// ✅ Fonction pour prévisualiser un fichier (PDF, image, vidéo)
previewFile(course: Courses, fileUrl: string): void {
  const filename = this.extractFileName(fileUrl);
  this.previewUrls.set(course.courseId, this.getDisplayUrl(filename));
}



// ✅ Vérifie si un fichier a un aperçu
getPreviewUrl(course: Courses): string | null {
  const url = this.previewUrls.get(course.courseId) || null;
  console.log("🔎 URL de prévisualisation générée :", url);
  return url;
}


  // ✅ Vérifie si un fichier est une image
  isImage(fileUrl: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);
  }

  // ✅ Vérifie si un fichier est une vidéo
  isVideo(fileUrl: string): boolean {
    return /\.(mp4|webm|ogg)$/i.test(fileUrl);
  }
// ✅ Ferme uniquement l'aperçu du fichier du cours sélectionné
// ✅ Ferme uniquement l'aperçu du fichier du cours sélectionné
clearPreview(course: Courses): void {
  this.previewUrls.set(course.courseId, null);
}

// ✅ Vérifie si un fichier est un PDF
isPDF(fileUrl: string | null): boolean {
  return !!fileUrl && fileUrl.toLowerCase().endsWith('.pdf');
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

  // ✅ Génère une image pour chaque cours
  getCourseImage(index: number): string {
    const imageNumber = (index % 6) + 1;
    return `assets1/images/course/course-1-${imageNumber}.png`;
  }
  getDisplayUrl(filename: string): string {
    const url = `http://localhost:8089/pidev/Courses/Courses/${(filename)}`;
    console.log("🔎 URL générée pour l'affichage :", url);
    return url;
  }
  
// ✅ Fonction pour ouvrir le PDF en plein écran dans un nouvel onglet
openPdfInNewTab(course: Courses): void {
  const pdfUrl = this.getPreviewUrl(course);
  if (pdfUrl) {
      window.open(pdfUrl, '_blank'); // 🔥 Ouvre dans un nouvel onglet
  }
}

}





