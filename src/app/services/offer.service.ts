import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, mergeMap, Observable, retryWhen, switchMap, throwError, timer ,take} from 'rxjs';
import { Offer } from '../models/Offer';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  private apiUrl = 'http://localhost:8083/pidev/offers'; // Replace with your backend API URL
  private apiUrlAI = 'http://localhost:8083/pidev/generate-description';

  constructor(private http: HttpClient) {}

  createOffer(offerData: any, userId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create/${userId}`, offerData).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.error?.message || "Failed to create offer"));
      })
    );
  }
 // offer.service.ts
// Updated with proper rate limit handling


generateDescription(promptData: any): Observable<any> {
  return this.http.post(this.apiUrlAI, promptData);
}
  // Fetch all offers
  getOffers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
    // Fetch all offers
    getOffersfront(): Observable<Offer[]> {
      return this.http.get<Offer[]>(this.apiUrl);
    }

  // Fetch a single offer by ID
  getOfferById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Update an offer
  updateOffer(id: number, offer: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateoffer/${id}`, offer);
  }


  getOffersByCompanyRepresentative(userId: number): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.apiUrl}/companyrepresentative/${userId}`);
  }

  // Delete an offer
  deleteOffer(offerId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteoffer/${offerId}`);
  }
  
}