import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from 'src/app/Services/payment.service';

@Component({
  selector: 'app-payment-success',
  template: `
    <h2>Paiement réussi !</h2>
    <p>Votre inscription à la formation a été confirmée.</p>
    <button (click)="goToTraining()">Retour aux formations</button>
  `,
  styles: [`
    h2 { color: green; }
    button { margin-top: 10px; padding: 10px 20px; background-color: #4CAF50; color: white; border: none; cursor: pointer; }
    button:hover { background-color: #45a049; }
  `]
})
export class PaymentSuccessComponent implements OnInit {
  constructor(private route: ActivatedRoute, private paymentService: PaymentService) {}

  ngOnInit() {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (sessionId) {
      this.paymentService.confirmPayment(sessionId).subscribe(
        (response) => {
          console.log("✅ Confirmation de paiement :", response);
        },
        (error) => {
          console.error("❌ Erreur lors de la confirmation du paiement :", error);
        }
      );
    } else {
      console.error("❌ Aucun session_id fourni dans l'URL.");
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  }

  goToTraining() {
    // Rediriger vers la liste des formations ou une autre page
    window.location.href = '/TrainingList'; // Ajustez selon vos routes
  }
}