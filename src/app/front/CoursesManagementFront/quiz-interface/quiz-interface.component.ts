import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Quiz } from 'src/app/Models/quiz.model';
import { QuizQuestionService } from '../../../Services/quiz-question.service';
import { QuizService } from 'src/app/Services/quiz.service';
import { CommonModule } from '@angular/common';
import { QuizQuestion } from 'src/app/Models/quiz-question.model';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';
@Component({
  selector: 'app-quiz-interface',
  imports: [CommonModule, ReactiveFormsModule,FormsModule,NavbarComponent,FooterComponent],
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
  
  // ⏳ Variables pour le Timer
// ⏳ Variables pour le Timer
timeLeft!: number; 
timerInterval: any;
isTimeUp = false;
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
        this.timeLeft = this.quiz.timeLimit * 60; // Convertir les minutes en secondes
        this.startTimer(); // ✅ Démarrer le Timer

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

getProgressColor(): string {
  if (this.score >= this.quiz.maxGrade * 0.8) {
      return '#4CAF50'; // Vert 🎯 (Réussi)
  } else if (this.score >= this.quiz.maxGrade * 0.5) {
      return '#FFC107'; // Jaune ⚠️ (Moyen)
  } else {
      return '#FF5722'; // Rouge ❌ (Échec)
  }
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
// ✅ Démarrage du Timer
startTimer(): void {
  this.timerInterval = setInterval(() => {
    if (this.timeLeft > 0) {
      this.timeLeft--; // Diminue le temps restant
    } else {
      this.isTimeUp = true;
      this.autoSubmitQuiz(); // Soumission automatique quand le temps est écoulé
    }
  }, 1000); // Diminue chaque seconde
}

// ✅ Format d'affichage du Timer (mm:ss)
getFormattedTime(): string {
  const minutes = Math.floor(this.timeLeft / 60);
  const seconds = this.timeLeft % 60;
  return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
}

// ✅ Ajout du zéro devant les chiffres uniques (ex: 09:05)
padZero(num: number): string {
  return num < 10 ? '0' + num : num.toString();
}
// ✅ Soumission automatique si le temps est écoulé
autoSubmitQuiz(): void {
  clearInterval(this.timerInterval); // Arrêter le timer
  this.score = 0;
  this.passed = false;
  this.submitted = true;
}

}
