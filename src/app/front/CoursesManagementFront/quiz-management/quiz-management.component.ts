import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../../Services/quiz.service';
import { Quiz } from '../../../Models/quiz.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';
import { ReactiveFormsModule,FormsModule  } from '@angular/forms';

@Component({
  selector: 'app-quiz-management',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './quiz-management.component.html',
  styleUrls: ['./quiz-management.component.scss']
})
export class QuizManagementComponent implements OnInit {
  quizzes: Quiz[] = [];
  quizForm: FormGroup;

  constructor(
    private quizService: QuizService,
    private fb: FormBuilder
  ) {
    this.quizForm = this.fb.group({
      quizName: ['', Validators.required],
      deadline: ['', Validators.required],
      minimumGrade: ['', [Validators.required, Validators.min(0)]],
      timeLimit: ['', [Validators.required, Validators.min(1)]],
      maxGrade: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadQuizzes();
  }

  // Charger tous les quiz
  loadQuizzes(): void {
    this.quizService.getAllQuizzes().subscribe(
      (data) => {
        this.quizzes = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des quiz', error);
      }
    );
  }

  // Ajouter un quiz
  onSubmit(): void {
    if (this.quizForm.valid) {
      const newQuiz: Quiz = this.quizForm.value;
      this.quizService.addQuiz(newQuiz).subscribe(
        (data) => {
          console.log('Quiz ajouté :', data);
          this.quizzes.push(data);
          this.quizForm.reset();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du quiz', error);
        }
      );
    }
  }

  // Mettre à jour un quiz
  onUpdate(quiz: Quiz): void {
    this.quizService.updateQuiz(quiz).subscribe(
      (updatedQuiz) => {
        console.log('Quiz mis à jour :', updatedQuiz);
        this.loadQuizzes();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du quiz', error);
      }
    );
  }

  // Supprimer un quiz
  onDelete(id: number): void {
    this.quizService.deleteQuiz(id).subscribe(
      () => {
        console.log('Quiz supprimé');
        this.quizzes = this.quizzes.filter(q => q.idQuiz !== id);
      },
      (error) => {
        console.error('Erreur lors de la suppression du quiz', error);
      }
    );
  }
  formatDate(date: string | Date): string {
    if (!date) return ''; // Vérifier si la date est valide
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split('T')[0]; // Convertir en format YYYY-MM-DD
  }
  
  
}
