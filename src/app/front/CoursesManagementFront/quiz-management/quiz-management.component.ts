import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { QuizService } from '../../../Services/quiz.service';
import { Quiz } from '../../../Models/quiz.model';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';
import { ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { Router } from '@angular/router'; // ✅ Importer Router
import { Training } from 'src/app/Models/training.model';
import { TrainingService } from 'src/app/Services/training.service';

@Component({
  selector: 'app-quiz-management',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './quiz-management.component.html',
  styleUrls: ['./quiz-management.component.scss']
})
export class QuizManagementComponent implements OnInit {
  @ViewChild('assignTrainingModal') assignTrainingModal!: ElementRef; // ✅ Récupérer l'élément modal

  quizzes: Quiz[] = [];
  quizForm: FormGroup;
  trainings: Training[] = []; // ✅ Store available trainings
  selectedQuizId: number | null = null; // ✅ Store selected quiz ID
  selectedTrainingId: number | null = null; // ✅ Store selected training ID
  userId: number = 1; // ✅ Hardcoded user ID (1)
  successMessage: string | null = null;

  constructor(
    private quizService: QuizService,
    private fb: FormBuilder,
    private router: Router ,
    private trainingService: TrainingService      



  ) {
    this.quizForm = this.fb.group(
      {
        quizName: ['', [Validators.required, Validators.minLength(6)]], // ✅ Minimum 6 caractères
        deadline: ['', [Validators.required, this.dateGreaterThanOrEqualToday]], // ✅ Validation de la date
        minimumGrade: ['', [Validators.required, Validators.min(10)]],
        timeLimit: ['', [Validators.required, Validators.min(10)]],
        maxGrade: ['', [Validators.required]]
      },
      { validators: this.maxGradeGreaterThanMinGrade } // ✅ Ajout du validateur personnalisé
    );
    
    
  }
  maxGradeGreaterThanMinGrade(form: AbstractControl): ValidationErrors | null {
    const minGrade = form.get('minimumGrade')?.value;
    const maxGrade = form.get('maxGrade')?.value;
  
    if (minGrade !== null && maxGrade !== null && maxGrade <= minGrade) {
      return { maxGradeInvalid: true }; // ✅ Retourne une erreur si maxGrade ≤ minGrade
    }
    return null; // ✅ Aucun problème
  }
  

  dateGreaterThanOrEqualToday(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control.value) return null; // ✅ Ne fait rien si le champ est vide
  
    const today = new Date();
    today.setHours(0, 0, 0, 0); // ✅ Supprimer l'heure pour ne comparer que la date
  
    const selectedDate = new Date(control.value);
  
    return selectedDate >= today ? null : { 'dateInvalid': true }; // ✅ Retourne une erreur si la date est passée
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

  onSubmit(): void {
    if (this.quizForm.valid) {
      const newQuiz: Quiz = this.quizForm.value;
      this.quizService.addQuiz(newQuiz).subscribe(
        (data) => {
          console.log('✅ Quiz added successfully:', data);
          this.quizzes.push(data);
          this.quizForm.reset();
  
          // ✅ Afficher un message de succès
          this.successMessage = "🎉 Quiz added successfully! You can now manage it from the list.";
  
          // ✅ Effacer le message après 3 secondes
          setTimeout(() => this.successMessage = null, 3000);
        },
        (error) => {
          console.error("❌ Error adding quiz:", error);
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
  manageQuizzes(): void {
    window.location.href = "/QuizQuestionsManagemet";
  }
  manageQuizQuestions(quizId: number): void {
    this.router.navigate(['/QuizQuestionsManagement', quizId]); // Passer l'ID du quiz dans l'URL
  }


  openTrainingModal(quizId: number): void {
    this.selectedQuizId = quizId;
    this.selectedTrainingId = null;
  
    // 🔥 Charger toutes les formations de l'utilisateur
    this.trainingService.getUserTrainings(this.userId).subscribe(
      (trainings) => {
        // ✅ Stocker temporairement les formations de l'utilisateur
        const userTrainings = trainings;
  
        // 🔥 Récupérer les formations déjà associées au quiz
        this.trainingService.getTrainingsByQuiz(quizId).subscribe(
          (assignedTrainings) => {
            const assignedTrainingIds = assignedTrainings.map(training => training.trainingId);
  
            // ❌ Filtrer les formations déjà associées au quiz
            this.trainings = userTrainings.filter(training => !assignedTrainingIds.includes(training.trainingId));
  
            console.log("📢 Formations disponibles après filtrage :", this.trainings);
          },
          (error) => console.error("❌ Erreur lors du chargement des formations associées au quiz", error)
        );
      },
      (error) => {
        console.error("❌ Erreur lors du chargement des formations de l'utilisateur", error);
      }
    );
  
    // ✅ Afficher le modal
    const modalElement = this.assignTrainingModal.nativeElement;
    modalElement.style.display = 'block';
    modalElement.classList.add('show');
    document.body.classList.add('modal-open');
  }
  
  
  closeTrainingModal(): void {
    const modalElement = this.assignTrainingModal.nativeElement;
    modalElement.style.display = 'none'; // ✅ Cacher le modal
    modalElement.classList.remove('show');
    document.body.classList.remove('modal-open'); // ✅ Réactiver le scrolling
  }

// ✅ Assign Quiz to Training (sans Bootstrap)
assignQuizToTraining(): void {
  if (this.selectedQuizId && this.selectedTrainingId) {
    this.trainingService.assignQuizToTraining(this.selectedTrainingId, this.selectedQuizId).subscribe(
      () => {
        console.log(`Quiz ${this.selectedQuizId} assigned to Training ${this.selectedTrainingId}`);
        alert("Quiz assigned successfully!");

        // ✅ Fermer le modal sans Bootstrap
        this.closeTrainingModal();
      },
      (error) => {
        console.error("Error assigning quiz to training", error);
        alert("Failed to assign quiz.");
      }
    );
  } else {
    alert("Please select a training.");
  }
}
}
