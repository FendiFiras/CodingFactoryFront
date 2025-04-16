import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Quiz } from 'src/app/models/quiz.model';
import { QuizQuestionService } from '../../../models/quiz-question.service';
import { QuizService } from 'src/app/services/quiz.service';
import { CommonModule } from '@angular/common';
import { QuizQuestion } from 'src/app/models/quiz-question.model';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';
import { CheatDetectionServiceTsService } from 'src/app/services/cheat-detection.service.ts.service';
import { WebcamHeadtrackerComponent } from '../webcam-headtracker/webcam-headtracker.component';
import jsPDF from 'jspdf';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-quiz-interface',
  imports: [CommonModule, ReactiveFormsModule,FormsModule,NavbarComponent,FooterComponent,WebcamHeadtrackerComponent // ✅ AJOUT ICI !
  ],
  templateUrl: './quiz-interface.component.html',
  styleUrl: './quiz-interface.component.scss'
})
export class QuizInterfaceComponent {
  quiz!: Quiz;
  questions: QuizQuestion[] = [];
  quizId!: number;
  userId!: number;
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
showCheatingModal = false;

  // ⏳ Variables pour le Timer
// ⏳ Variables pour le Timer
timeLeft!: number; 
timerInterval: any;
isTimeUp = false;

clickCount = 0;
tabSwitchCount = 0;
idleSeconds = 0;
wrongAnswersCount = 0;
fastAnswerCount = 0;
startTime!: number;

detectedHeadTurnsCount = 0;
showModal = false;  // Flag to show modal when cheating is detected
isWebcamActive = false; // Par défaut = false

showCameraModal = false;



  constructor(
    private route: ActivatedRoute,
    private quizServiceQuestion: QuizQuestionService,
    private quizservice: QuizService,
    private cheatService: CheatDetectionServiceTsService,
        private authService: AuthService // ✅ ajout ici
    

  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.quizId = Number(params.get('quizId'));
      if (!isNaN(this.quizId)) {

        this.authService.getUserInfo().subscribe(user => {
          this.userId = user.idUser; // ou `user.id` selon ta réponse backend
          console.log("👤 Utilisateur connecté :", this.userId);
        this.loadQuizData();

        this.startTime = Date.now(); // Start quiz timer

        // 🖱️ Suivre les clics
        document.addEventListener('click', () => this.clickCount++);

        // 🔄 Suivre les changements d'onglet
        window.addEventListener('blur', () => {
          this.tabSwitchCount++;
          console.log('Tab switch detected!');
        });

      // 🎯 Suivre le retour sur l'onglet
      window.addEventListener('focus', () => {
        console.log('Tab focused again!');
      
        if (this.tabSwitchCount >= 3 && !this.submitted) {
          console.warn('🚫 Triche détectée par 3 changements d\'onglet');
      
          // 🔄 Forcer la soumission du quiz
          this.submitted = true;
          this.showProgressBar = true;
          this.score = 0;
          this.passed = false;
          this.showCheatingModal = true;
          this.sendCheatingReportToBackend(); // ✅ Ajout ici

      
          const selectedAnswers: number[] = Object.values(this.selectedAnswers)
            .flat()
            .filter(v => v !== null && v !== undefined)
            .map(v => Number(v));
      
          this.quizServiceQuestion.submitAndCalculateScore(this.userId, this.quizId, selectedAnswers).subscribe(
            (response) => {
              // Enregistrer les données côté backend quand même
              console.log("Quiz submitted malgré triche. Score non pris en compte.");
      
              // 🧾 Générer le PDF automatiquement
              this.downloadCheatingReport();
            },
            (error) => console.error("Erreur soumission des réponses après triche :", error)
          );
        }
      });
      


        // 💤 Détecter l’inactivité (idle)
        let lastActivity = Date.now();
        const activityEvents = ['mousemove', 'keydown', 'click'];

        activityEvents.forEach(evt => {
          document.addEventListener(evt, () => lastActivity = Date.now());
        });

        setInterval(() => {
          const now = Date.now();
          if (now - lastActivity > 5000) { // 5 sec sans activité
            this.idleSeconds += 5;
            lastActivity = now;
            console.log('User is idle for ' + this.idleSeconds + ' seconds');
          }
        }, 5000);
      }); // ← FIN DU .subscribe(user => {...})
    
    }});

// ⛔ Bloquer clic droit (menu contextuel)
document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  console.warn('🚫 Clic droit désactivé');
});


    // ⛔ Interdire Ctrl+C / Ctrl+V
document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'v')) {
    event.preventDefault();
    console.warn('🚫 Copie/Coller interdit pendant le quiz');
    alert("Les raccourcis Ctrl+C / Ctrl+V sont désactivés pendant le quiz.");
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
      .flat()
      .filter(v => v !== null && v !== undefined)
      .map(v => Number(v));

    console.log("Réponses sélectionnées :", selectedAnswers);

    // ⏱️ Calculer la durée du quiz
    const now = Date.now();
    const duration = Math.floor((now - this.startTime) / 1000); // durée en secondes
    console.log("Durée totale du quiz :", duration, "secondes");

    this.quizServiceQuestion.submitAndCalculateScore(this.userId, this.quizId, selectedAnswers).subscribe(
      (response) => {
        console.log("Résultat serveur :", response);
        this.score = response.score;
        this.passed = response.passed;
        this.submitted = true;

        // Préparer les données à envoyer à l'IA
        const cheatingData = {
          duration: duration,
          clicks: this.clickCount,
          fast_answers: this.fastAnswerCount || 0,
          tab_switches: this.tabSwitchCount,
          idle_time: this.idleSeconds,
          wrong_answers: this.wrongAnswersCount,
          head_turns: this.detectedHeadTurnsCount || 0
        };

        console.log("Données envoyées à l'IA :", cheatingData);

        // Appel API Flask via Spring Boot
        this.cheatService.detectCheating(cheatingData).subscribe(result => {
          console.log("Réponse IA :", result);
          if (result) {
            console.warn("Triche détectée !");
            alert("Comportement suspect détecté !");
            this.score = 0; // ⚠️ Remettre le score à 0
            this.passed = false;
            this.showCheatingModal = true; // ✅ Affiche la fenêtre modale
            this.sendCheatingReportToBackend(); // ✅ Envoi vers le backend

          } else {
            console.log("Comportement normal détecté");
          }
        });
        
      },
      (error) => {
        console.error("Erreur soumission des réponses :", error);
      }
    );
  }
  
  
 
  onHeadTurnDetected() {
    console.log('Tête tournée détectée !');
    this.detectedHeadTurnsCount++;  // Incrémenter le compteur de détections
    console.log(`Compteur de têtes tournées : ${this.detectedHeadTurnsCount}`);
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



downloadCheatingReport(): void {
  const doc = new jsPDF();
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const refId = `QZ-${this.userId}-${today.getFullYear()}${(today.getMonth()+1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;

  // 🔶 Barre verticale gauche orange
  doc.setFillColor(255, 136, 0);
  doc.rect(10, 10, 5, 270, 'F');


  // 🧾 Titre principal
  doc.setTextColor(33);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Cheating Behavior Report', 105, 25, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('Generated by Training & Evaluation Dept.', 105, 31, { align: 'center' });

  let y = 42;

  // 📌 Ref + Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Reference: ${refId}`, 160, y); y += 6;
  doc.text(`Date: ${dateStr}`, 160, y); y += 8;

  // 📄 Encadré Quiz Info
  doc.setDrawColor(180);
  doc.setFillColor(245, 245, 245);
  doc.rect(20, y, 170, 30, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.text('Quiz Information:', 25, y + 6);

  doc.setFont('helvetica', 'normal');
  y += 12;
  doc.text(`- Title       : ${this.quiz.quizName}`, 25, y); y += 6;
  doc.text(`- Score Given : 0 / ${this.quiz.maxGrade}`, 25, y); y += 6;

  y += 10;

  // 📊 Encadré Behavior Summary
  doc.setFillColor(245, 245, 245);
  doc.rect(20, y, 170, 42, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.text('Behavior Summary:', 25, y + 6);

  doc.setFont('helvetica', 'normal');
  y += 12;
  doc.text(`- Clicks         : ${this.clickCount}`, 25, y); y += 6;
  doc.text(`- Tab Switches   : ${this.tabSwitchCount}`, 25, y); y += 6;
  doc.text(`- Idle Time      : ${this.idleSeconds} seconds`, 25, y); y += 6;
  doc.text(`- Very Fast Ans. : ${this.fastAnswerCount}`, 25, y); y += 6;
  doc.text(`- Head Turns     : ${this.detectedHeadTurnsCount}`, 25, y); y += 12;

  // 🚨 Verdict Box
  doc.setFillColor(255, 230, 230);
  doc.setDrawColor(255, 0, 0);
  doc.rect(20, y, 170, 12, 'FD');
  doc.setTextColor(200, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Verdict: Suspicious behavior detected.', 105, y + 8, { align: 'center' });
  y += 25;

  // 📩 Message final
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text('This report was automatically generated due to anomalies detected during the quiz.', 25, y, { maxWidth: 160 }); y += 6;
  doc.text('If you believe this decision is incorrect, you may file a complaint within 48 hours.', 25, y, { maxWidth: 160 }); y += 6;
  doc.text('For assistance, contact: support_CodingFactory@codingfactory.tn', 25, y, { maxWidth: 160 }); y += 12;

  // 📎 Ligne de fin + footer
  doc.setDrawColor(220);
  doc.line(20, 275, 190, 275);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100);
  doc.text('CodingFactory - Training and Evaluation Technical Team', 105, 282, { align: 'center' });

  doc.save('cheating_behavior_report.pdf');
}

onWebcamStatusChanged(status: boolean): void {
  this.isWebcamActive = status;
  this.showCameraModal = !status; // Si la caméra n’est pas active, on affiche le modal

}

reloadPage(): void {
  window.location.reload();
}
generateCheatingPdf(): jsPDF {
  const doc = new jsPDF();
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const refId = `QZ-${this.userId}-${today.getFullYear()}${(today.getMonth()+1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;

  doc.setFillColor(255, 136, 0);
  doc.rect(10, 10, 5, 270, 'F');
  doc.setTextColor(33);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Cheating Behavior Report', 105, 25, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('Generated by Training & Evaluation Dept.', 105, 31, { align: 'center' });

  let y = 42;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Reference: ${refId}`, 160, y); y += 6;
  doc.text(`Date: ${dateStr}`, 160, y); y += 8;

  doc.setDrawColor(180);
  doc.setFillColor(245, 245, 245);
  doc.rect(20, y, 170, 30, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.text('Quiz Information:', 25, y + 6);

  doc.setFont('helvetica', 'normal');
  y += 12;
  doc.text(`- Title       : ${this.quiz.quizName}`, 25, y); y += 6;
  doc.text(`- Score Given : 0 / ${this.quiz.maxGrade}`, 25, y); y += 6;

  y += 10;
  doc.setFillColor(245, 245, 245);
  doc.rect(20, y, 170, 42, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.text('Behavior Summary:', 25, y + 6);

  doc.setFont('helvetica', 'normal');
  y += 12;
  doc.text(`- Clicks         : ${this.clickCount}`, 25, y); y += 6;
  doc.text(`- Tab Switches   : ${this.tabSwitchCount}`, 25, y); y += 6;
  doc.text(`- Idle Time      : ${this.idleSeconds} seconds`, 25, y); y += 6;
  doc.text(`- Very Fast Ans. : ${this.fastAnswerCount}`, 25, y); y += 6;
  doc.text(`- Head Turns     : ${this.detectedHeadTurnsCount}`, 25, y); y += 12;

  doc.setFillColor(255, 230, 230);
  doc.setDrawColor(255, 0, 0);
  doc.rect(20, y, 170, 12, 'FD');
  doc.setTextColor(200, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Verdict: Suspicious behavior detected.', 105, y + 8, { align: 'center' });

  y += 25;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text('This report was automatically generated due to anomalies detected during the quiz.', 25, y, { maxWidth: 160 }); y += 6;
  doc.text('If you believe this decision is incorrect, you may file a complaint within 48 hours.', 25, y, { maxWidth: 160 }); y += 6;
  doc.text('For assistance, contact: support_CodingFactory@codingfactory.tn', 25, y, { maxWidth: 160 });

  return doc;
}
sendCheatingReportToBackend(): void {
  const doc = this.generateCheatingPdf();
  const pdfBlob = doc.output('blob');

  const formData = new FormData();
  formData.append('file', pdfBlob, 'cheating_report.pdf');
  formData.append('quizId', this.quizId.toString());

  this.quizServiceQuestion.sendCheatingReport(this.quizId, pdfBlob).subscribe({
    next: () => {
      console.log('📤 Rapport envoyé au formateur');
    },
    error: (err) => {
      console.error('❌ Erreur lors de l’envoi du rapport au backend', err);
    }
  });
}

}
