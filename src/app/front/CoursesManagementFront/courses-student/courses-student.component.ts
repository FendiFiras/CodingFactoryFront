import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Courses } from '../../../Models/courses.model';
import { CourseService } from '../../../Services/courses.service';
@Component({
  selector: 'app-courses-student',
  imports: [NavbarComponent, FooterComponent, CommonModule, ReactiveFormsModule,FormsModule ],  // <-- Ajoutez FormsModule ici
  templateUrl: './courses-student.component.html',
  styleUrl: './courses-student.component.scss'
})
export class CoursesStudentComponent implements OnInit {
  courses: Courses[] = [];
  trainingId!: number;

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
          this.courses = data;
        },
        (error) => {
          console.error('❌ Erreur lors du chargement des cours', error);
        }
      );
    }

    getFileName(fileUrl: string): string {
      if (!fileUrl) return 'No File';
      return fileUrl.split('/').pop() || 'No File'; // ✅ Récupère uniquement le nom du fichier
    }
    getCourseImage(index: number): string {
      const imageNumber = (index % 6) + 1; // Sélectionne une image entre 1 et 6
      return `assets1/images/course/course-1-${imageNumber}.png`;
    }
    
    
}
