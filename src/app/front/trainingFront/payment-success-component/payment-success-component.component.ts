import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment-success',
  template: `
    <div class="payment-container">
      <div class="payment-card">
        <div class="payment-icon">✅</div>
        <h2>Congratulations!</h2>
        <p class="payment-message">
          Your payment has been successfully processed.  
          You are now enrolled in this training! 🚀
        </p>
        <p class="payment-thanks">Thank you for your trust and commitment! 🙏</p>
        
        <div class="payment-actions">
          <button class="btn-secondary" (click)="goToHome()">🏠 Back to Home</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .payment-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f8f9fa;
    }

    .payment-card {
      background: #ffffff;
      padding: 40px;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
      max-width: 500px;
      border: 3px solid #ff6600;
    }

    .payment-icon {
      font-size: 50px;
      margin-bottom: 15px;
    }

    h2 {
      font-size: 26px;
      font-weight: bold;
      color: #ff6600;
      margin-bottom: 15px;
    }

    .payment-message {
      font-size: 18px;
      color: #444;
      line-height: 1.7;
      margin-bottom: 12px;
    }

    .payment-thanks {
      font-size: 20px;
      font-weight: bold;
      color: #ff6600;
      margin-top: 20px;
      text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
    }

    .payment-actions {
      margin-top: 20px;
      display: flex;
      gap: 15px;
      justify-content: center;
    }

    .btn-primary, .btn-secondary {
      padding: 12px 20px;
      font-size: 16px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      border-radius: 5px;
    }

    .btn-primary {
      background-color: #ff6600;
      color: white;
    }

    .btn-primary:hover {
      background-color: #e65c00;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }
  `]
})
export class PaymentSuccessComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router, private paymentService: PaymentService) {}

  ngOnInit() {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (sessionId) {
      this.paymentService.confirmPayment(sessionId).subscribe(
        (response) => {
          console.log("✅ Payment Confirmation Successful:", response);
        },
        (error) => {
          console.error("❌ Payment Confirmation Failed:", error);
        }
      );
    } else {
      console.error("❌ No session_id provided in URL.");
      alert("An error occurred. Please try again.");
    }
  }

  goToTraining() {
    const trainingId = this.route.snapshot.queryParamMap.get('trainingId'); // ✅ Récupère l'ID depuis l'URL
    if (trainingId) {
      this.router.navigate([`/courses/training/${trainingId}`]); // ✅ Redirige vers la page des cours
    } else {
      console.error("❌ Training ID not found!");
      alert("An error occurred. Please try again.");
    }
  }
  

  goToHome() {
    this.router.navigate(['/']);
  }
}
