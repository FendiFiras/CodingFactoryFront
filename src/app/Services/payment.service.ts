import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8081/pidev/api/payments';
  constructor(private http: HttpClient) {}

  createStripeSession(userId: number, trainingId: number): Observable<{ id: string; url: string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // ✅ Utilisation de paramètres de requête comme dans le contrôleur Spring Boot
    return this.http.post<{ id: string; url: string }>(
      `${this.apiUrl}/create-checkout-session?userId=${userId}&trainingId=${trainingId}`,
      {},
      { headers }
    );
  }

  confirmPayment(sessionId: string): Observable<string> {
    // ✅ Pas besoin de passer userId/trainingId ici, ils sont dans les métadonnées
    return this.http.get<string>(`${this.apiUrl}/success?session_id=${sessionId}`);
  }
}