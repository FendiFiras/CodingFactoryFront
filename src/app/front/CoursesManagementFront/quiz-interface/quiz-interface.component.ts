import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Quiz } from 'src/app/Models/quiz.model';
import { QuizQuestionService } from '../../../Services/quiz-question.service';
import { QuizService } from 'src/app/Services/quiz.service';
import { CommonModule } from '@angular/common';
import { QuizQuestion } from 'src/app/Models/quiz-question.model';
@Component({
  selector: 'app-quiz-interface',
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './quiz-interface.component.html',
  styleUrl: './quiz-interface.component.scss'
})
export class QuizInterfaceComponent {
  quiz!: Quiz;
  questions: QuizQuestion[] = [];
  quizId!: number;
  userId: number = 2;
  submitted = false;
  score!: number;
  passed!: boolean;
  currentQuestionIndex = 0;
  selectedAnswers: { [key: number]: number | null } = {}; 

  constructor(
    private route: ActivatedRoute,
    private quizServiceQuestion: QuizQuestionService,
    private quizservice: QuizService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.quizId = Number(params.get('quizId'));
      if (!isNaN(this.quizId)) {
        this.loadQuizData();
      }
    });
  }

  loadQuizData(): void {
    this.quizservice.getQuizById(this.quizId).subscribe(
      (quizData) => {
        this.quiz = quizData;
        this.quizServiceQuestion.getQuestionsByQuiz(this.quizId).subscribe(
          (questionsData) => {
            this.questions = questionsData || [];
            this.questions.forEach(question => {
              this.selectedAnswers[question.idQuizQ] = null;
            });
          },
          (error) => console.error("❌ Erreur chargement questions", error)
        );
      },
      (error) => console.error("❌ Erreur chargement quiz", error)
    );
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitQuiz(): void {
    const selectedAnswers: number[] = Object.values(this.selectedAnswers)
        .filter(v => v !== null && v !== undefined)
        .map(v => Number(v));

    console.log("📤 Données envoyées :", selectedAnswers);

    this.quizServiceQuestion.submitAndCalculateScore(this.userId, this.quizId, selectedAnswers).subscribe(
      (response) => {
        console.log("✅ Réponse serveur :", response);
        this.score = response.score;
        this.passed = response.passed;
        this.submitted = true;
      },
      (error) => {
        console.error("❌ Erreur soumission :", error);
      }
    );
}



calculateScore(): void {
  this.quizServiceQuestion.calculateQuizScore(this.quizId, this.userId).subscribe(
    (response) => {
      console.log("📊 Réponse du serveur pour le score :", response); // 🔍 Debug
      
      if (response && response.score !== undefined && response.passed !== undefined) {
        this.score = response.score;
        this.passed = response.passed;
        this.submitted = true; // ✅ Affiche le score et le message après soumission
      } else {
        console.error("⚠️ Réponse inattendue du backend :", response);
      }
    },
    (error) => console.error("❌ Erreur calcul score", error)
  );
}



  reviewQuiz(): void {
    // 🔍 Action pour revoir les réponses
    alert("🔍 Fonctionnalité à implémenter : afficher les réponses !");
}

restartQuiz(): void {
    // 🔄 Réinitialisation du quiz
    this.submitted = false;
    this.currentQuestionIndex = 0;
    this.selectedAnswers = {}; // Efface les réponses précédentes
    this.score = 0;
    this.passed = false;
}

}
