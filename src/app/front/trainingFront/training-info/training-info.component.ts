import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingService } from '../../../services/training.service';
import { Training } from '../../../models/training.model';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';
import { ChangeDetectorRef } from '@angular/core';
import { QuizService } from 'src/app/services/quiz.service';
import { Quiz } from 'src/app/models/quiz.model';
import { PaymentService } from 'src/app/services/payment.service';
import { Stripe, loadStripe } from '@stripe/stripe-js'; // ✅ Charger Stripe.js
import { environment } from 'src/environments/environment'; // ✅ Importer les clés Stripe
import { FormsModule } from '@angular/forms';  // ✅ Ajouter FormsModule
import { SessionService } from 'src/app/services/session.service';
import { Session } from 'src/app/models/session.model';

@Component({
  selector: 'app-training-info',
  imports: [NavbarComponent, FooterComponent, CommonModule,FormsModule],
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
  userId: number = 3; // ✅ Fixe l'ID de l'utilisateur
  predictedRevenue: number = 0;

  stripe!: Stripe; // ✅ Stocker l'instance Stripe
  isUserEnrolled: boolean = false; // ✅ Par défaut, on considère qu'il n'est pas inscrit.
  latestTrainings: Training[] = [];
  notEnrolledTrainings: Training[] = [];
  isEligibleForDiscount: boolean = false;
  promoCode: string = "";
  isPromoApplied: boolean = false;
  discountedPrice!: number;

  sessions: Session[] = [];
  filteredSessions: Session[] = [];
  searchQuery: string = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trainingService: TrainingService,
    private cdr: ChangeDetectorRef,  // 🛠️ Ajout de ChangeDetectorRef
    private quizService: QuizService,
    private paymentService: PaymentService, // ✅ Injecte le PaymentService
    private sessionService: SessionService


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

        // ✅ Charger les formations récentes
        this.getLatestTrainings();

        // ✅ Charger les formations non achetées
        this.getTrainingsNotEnrolled();

        // ✅ Vérifier si l'utilisateur est éligible au discount
        this.checkUserDiscount();
        this.loadSessions(trainingId);

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





// ✅ Récupérer les dernières formations ajoutées
getLatestTrainings() {
  this.trainingService.getLatestTrainings().subscribe(
      (trainings) => this.latestTrainings = trainings,
      (error) => console.error("❌ Erreur récupération formations récentes :", error)
  );
}

// ✅ Récupérer les formations auxquelles l'utilisateur n'est pas inscrit
getTrainingsNotEnrolled() {
  this.trainingService.getTrainingsNotEnrolled(this.userId).subscribe(
      (trainings) => this.notEnrolledTrainings = trainings,
      (error) => console.error("❌ Erreur récupération formations non achetées :", error)
  );
}
goToTraining(trainingId: number) {
  this.router.navigate(['/TrainingInfo', trainingId]);
}
checkUserDiscount() {
  console.log("🔍 Vérification de l'éligibilité au discount...");
  this.trainingService.isUserEligibleForDiscount(this.userId).subscribe(
    (promoCode) => {
      if (promoCode) { // ✅ Si un code promo est renvoyé
        this.isEligibleForDiscount = true;
        this.promoCode = promoCode;
        console.log("📩 Code promo récupéré :", this.promoCode);
      } else {
        this.isEligibleForDiscount = false;
        console.warn("⚠️ Pas de code promo pour cet utilisateur.");
      }
    },
    (error) => {
      console.error("❌ Erreur lors de la vérification du discount :", error);
    }
  );
}


applyPromoCode() {
  if (!this.promoCode.trim()) {
    alert("❌ Please enter a promo code.");
    return;
  }

  this.trainingService.validatePromoCode(this.userId, this.promoCode).subscribe(
    (isValid) => {
      if (isValid) { // ✅ Code promo correct
        this.discountedPrice = this.selectedTraining!.price * 0.7; // ✅ Appliquer 30% de réduction
        this.isPromoApplied = true;
        alert("🎉 Promo code applied successfully!");
        console.log("✅ Promo applied:", this.discountedPrice);
      } else { // ❌ Code promo incorrect
        alert("❌ Invalid promo code. Please try again.");
      }
    },
    (error) => {
      console.error("❌ Erreur de validation du code promo :", error);
      alert("❌ An error occurred. Please try again.");
    }
  );
}









 // ✅ Charger les sessions et obtenir le nom des localisations
 loadSessions(trainingId: number) {
  this.sessionService.getSessionsByTraining(trainingId).subscribe(
    (data) => {
      this.sessions = data;
      this.sessions.forEach(session => {
        const [lat, lon] = session.location.split(',').map(Number);
        this.sessionService.getLocationName(lat, lon).subscribe(res => {
          session.location = res.display_name;
        });
      });
      this.filteredSessions = [...this.sessions];
    },
    (error) => {
      console.error('❌ Erreur lors du chargement des sessions', error);
    }
  );
}

// ✅ Ouvrir la carte dans un nouvel onglet
openMap(location: string) {
  const [lat, lon] = location.split(',');
  window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=18/${lat}/${lon}`, '_blank');
}

// ✅ Filtrer les sessions par localisation ou programme
filterSessions(): void {
  const query = this.searchQuery.trim().toLowerCase();

  if (!query) {
    this.filteredSessions = this.sessions;  // Si la recherche est vide, afficher toutes les sessions
    return;
  }

  this.filteredSessions = this.sessions.filter(session =>
    (session.location && session.location.toLowerCase().includes(query)) ||
    (session.program && session.program.toLowerCase().includes(query))
  );
}
}



