import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingService } from '../../../Services/training.service';
import { Training } from '../../../Models/training.model';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';
import { ChangeDetectorRef } from '@angular/core';
import { QuizService } from 'src/app/Services/quiz.service';
import { Quiz } from 'src/app/Models/quiz.model';
import { PaymentService } from 'src/app/Services/payment.service';
import { Stripe, loadStripe } from '@stripe/stripe-js'; // ✅ Charger Stripe.js
import { environment } from 'src/environments/environment'; // ✅ Importer les clés Stripe

@Component({
  selector: 'app-training-info',
  imports: [NavbarComponent, FooterComponent, CommonModule,],
  standalone: true,
  templateUrl: './training-info.component.html',
  styleUrl: './training-info.component.scss'
})
export class TrainingInfoComponent implements OnInit {
  selectedTraining!: Training | null;
  trainingDuration: number = 0;
  trainingId!: number;
  quizzes: Quiz[] = [];
  quiz!: Quiz | null;
  quizId: number | null = null;  // ✅ Stocker l'ID du quiz ici
  userId: number = 2; // ✅ Fixe l'ID de l'utilisateur

  stripe!: Stripe; // ✅ Stocker l'instance Stripe
  isUserEnrolled: boolean = false; // ✅ Par défaut, on considère qu'il n'est pas inscrit.


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trainingService: TrainingService,
    private cdr: ChangeDetectorRef,  // 🛠️ Ajout de ChangeDetectorRef
    private quizService: QuizService,
    private paymentService: PaymentService // ✅ Injecte le PaymentService


  ) {}

  async ngOnInit() {
    this.stripe = await loadStripe(environment.stripePublicKey); // ✅ Charger Stripe.js
  
    this.route.paramMap.subscribe(params => {
      const trainingId = Number(params.get('id'));
      if (!isNaN(trainingId)) {
        this.trainingId = trainingId;
        this.getTrainingDetails(trainingId);
        this.loadQuiz(trainingId);
  
        // ✅ Vérifier si l'utilisateur est déjà inscrit
        this.checkUserEnrollment();
      } else {
        this.router.navigate(['/TrainingList']);
      }
    });
  }
  

  getTrainingDetails(trainingId: number) {
    this.trainingService.getTrainingById(trainingId).subscribe(
      (training: Training) => {
        this.selectedTraining = training;
  
        if (this.selectedTraining.startDate && this.selectedTraining.endDate) {
          this.trainingDuration = this.getTrainingDuration(
            this.selectedTraining.startDate, 
            this.selectedTraining.endDate
          );
  
          console.log("✅ Durée Calculée:", this.trainingDuration, "days");
  
          this.cdr.detectChanges(); // 🔄 Force la mise à jour du HTML
        }
      },
      (error) => {
        console.error('❌ Erreur lors du chargement de la formation', error);
        this.router.navigate(['/TrainingList']);
      }
    );
  }
  
  
  getTrainingDuration(start: string | Date, end: string | Date): number {
    if (!start || !end) return 0;
  
    const startDate = new Date(start);
    const endDate = new Date(end);
  
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error("❌ Dates invalides:", start, end);
      return 0;
    }
  
    const difference = endDate.getTime() - startDate.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24)); // Convertit en jours
  }
  
  goToCourses(): void {
    if (this.selectedTraining) {
        this.router.navigate(['/courses/training', this.selectedTraining.trainingId]);
    }
}


// ✅ Naviguer vers la page du quiz
goToQuiz(): void {
  if (this.quizId) {
    this.router.navigate(['/PassQuiz', this.quizId]); // ✅ Rediriger vers le quiz
  } else {
    console.error("❌ Aucun quiz associé à cette formation !");
  }
}
// ✅ Charger l'ID du quiz associé à la formation
loadQuiz(trainingId: number): void {
  this.quizService.getQuizzesByTraining(trainingId).subscribe(
    (quizList) => {
      if (quizList && quizList.length > 0) {
        this.quizId = quizList[0].idQuiz; // ✅ Stocker l'ID du quiz
        console.log("✅ Quiz associé :", this.quizId);
      } else {
        console.warn("⚠️ Aucun quiz trouvé pour cette formation.");
      }
    },
    (error) => {
      console.error("❌ Erreur lors du chargement du quiz", error);
    }
  );
}
async enrollInTraining() {
  if (!this.selectedTraining || !this.stripe) {
    console.error("❌ Erreur : Formation ou Stripe non initialisé !");
    return;
  }

  console.log("🔍 Vérification de l'inscription de l'utilisateur...");

  // 🔍 Vérifier si l'utilisateur est déjà inscrit avant de lancer le paiement
  this.trainingService.isUserEnrolled(this.userId, this.selectedTraining.trainingId).subscribe(
    (isEnrolled) => {
      if (isEnrolled) {
        alert("✅ Vous êtes déjà inscrit à cette formation !");
        console.warn("⚠️ Tentative d'achat d'une formation déjà possédée.");
        return;
      }

      // ✅ Si l'utilisateur n'est pas inscrit, créer la session Stripe
      this.paymentService.createStripeSession(this.userId, this.selectedTraining.trainingId).subscribe(
        (response) => {
          if (response && response.id) {
            console.log("✅ Session Stripe créée :", response.id, response.url);
            this.stripe?.redirectToCheckout({ sessionId: response.id }).then(result => {
              if (result.error) {
                console.error("❌ Erreur lors de la redirection Stripe :", result.error.message);
                alert("Erreur de redirection vers Stripe : " + result.error.message);
              }
            });
          } else {
            console.error("❌ Erreur : Réponse Stripe invalide !");
            alert("Erreur lors de la création de la session de paiement.");
          }
        },
        (error) => {
          console.error("❌ Erreur lors de la création de la session Stripe :", error);
          alert("Erreur de paiement ! Veuillez réessayer.");
        }
      );
    },
    (error) => {
      console.error("❌ Erreur lors de la vérification de l'inscription :", error);
    }
  );
}



checkUserEnrollment() {
  this.trainingService.isUserEnrolled(this.userId, this.trainingId).subscribe(
    (isEnrolled) => {
      this.isUserEnrolled = isEnrolled; // ✅ Mettre à jour la variable d'état
      console.log("📌 Statut d'inscription:", isEnrolled ? "Déjà inscrit" : "Non inscrit");
    },
    (error) => {
      console.error("❌ Erreur lors de la vérification de l'inscription :", error);
    }
  );
}

}