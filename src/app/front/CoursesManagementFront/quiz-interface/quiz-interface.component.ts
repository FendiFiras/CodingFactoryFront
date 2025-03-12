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
  userId: number = 3;
  submitted = false;
  score!: number;
  passed!: boolean;
  currentQuestionIndex = 0;
  selectedAnswers: { [key: number]: number[] } = {};
  circleDashoffset = 0;
totalTime!: number;
circleCircumference = 282.6; // Circumference for a circle with radius 45
timerColor = 'green';
showProgressBar = false; // ✅ Nouvelle variable pour gérer l'affichage différé

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
  toggleAnswer(answerId: number, questionId: number): void {
    if (!this.selectedAnswers[questionId]) {
      this.selectedAnswers[questionId] = [];
    }
  
    const index = this.selectedAnswers[questionId].indexOf(answerId);
  
    if (index === -1) {
      // Ajouter l'ID de la réponse si elle n'est pas encore sélectionnée
      this.selectedAnswers[questionId].push(answerId);
    } else {
      // Retirer la réponse si elle est déjà sélectionnée
      this.selectedAnswers[questionId].splice(index, 1);
    }
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
        .flat() // 🔥 Aplatir les réponses multiples
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
startTimer(): void {
  this.totalTime = this.quiz.timeLimit * 60;
  this.circleDashoffset = this.circleCircumference;

  this.timerInterval = setInterval(() => {
    if (this.timeLeft > 0) {
      this.timeLeft--;
      this.updateCircleProgress();

      if (this.timeLeft === 20) {
        this.playAlertSound(); 
        this.speakMessage('Hurry up! The quiz will be closed soon!');
        document.querySelector('.timer-circle')?.classList.add('blink');
      }

    } else {
      this.isTimeUp = true;
      this.autoSubmitQuiz();
    }
  }, 1000);
}
// 🎙️ Play an Alert Sound
playAlertSound(): void {
  const audio = new Audio();
  audio.src = 'https://freesound.org/data/previews/66/66717_931655-lq.mp3'; // Free and accessible beep sound
  audio.load();
  audio.play();
}

updateCircleProgress(): void {
  const progress = this.timeLeft / this.totalTime;
  this.circleDashoffset = this.circleCircumference * progress;

  if (progress <= 0.3) {
      this.timerColor = 'red';
  } else if (progress <= 0.6) {
      this.timerColor = 'yellow';
  } else {
      this.timerColor = 'green';
  }
}

getFormattedTime(): string {
  const minutes = Math.floor(this.timeLeft / 60);
  const seconds = this.timeLeft % 60;
  return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
}


// ✅ Ajout du zéro devant les chiffres uniques (ex: 09:05)
padZero(num: number): string {
  return num < 10 ? '0' + num : num.toString();
}
autoSubmitQuiz(): void {
  clearInterval(this.timerInterval); // Arrêter le timer
  this.isTimeUp = true;

  // ✅ Attendre 5 secondes avant d'afficher le résultat
  setTimeout(() => {
    this.submitted = true;
    this.showProgressBar = true;
    this.submitQuiz(); // ✅ Soumettre le quiz automatiquement après le temps écoulé
  }, 5000);
}

getRewardBadge(): string {
  if (this.score === this.quiz.maxGrade) {
      return '🏆 Perfect Score!';
  } else if (this.passed) {
      return '🎖️ Great Job!';
  } else {
      return '📚 Keep Practicing!';
  }
}

speakMessage(message: string): void {
  const speech = new SpeechSynthesisUtterance();
  speech.text = message;
  speech.lang = 'en-US';  // Langue en anglais
  speech.volume = 1;       // Volume (0 à 1)
  speech.rate = 1;         // Vitesse de lecture (0.1 à 10)
  speech.pitch = 1;        // Hauteur de la voix (0 à 2)

  // Parler le message
  window.speechSynthesis.speak(speech);
}
}
